import { GenrateExpiry } from "@/lib/dateFormated";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, targetId, type, amount } = await request.json();
    // type: "VIDEO_PURCHASE" or "CHANNEL_JOIN"
    // targetId: videoId or channelId

    console.log(amount, userId, targetId, type);

    if (!userId || !targetId || !type || amount === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const cost = Number(amount);

    // 1. Pre-check active access BEFORE processing payments (Prevents unnecessary database work)
    if (type === "VIDEO_PURCHASE") {
      const now = new Date();
      const activePurchase = await prisma.purchase.findFirst({
        where: {
          userId,
          videoId: targetId,
          OR: [
            { expiresAt: null }, // Lifetime purchase already exists
            { expiresAt: { gt: now } }, // Active 48-hr rental is still running
          ],
        },
      });

      if (activePurchase) {
        return NextResponse.json(
          {
            success: false,
            message: "You already have active access to this video.",
          },
          { status: 400 },
        );
      }
    }

    // 2. Fetch user's wallet
    const userWallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!userWallet || Number(userWallet.walletBalance) < cost) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient wallet balance. Please top up.",
        },
        { status: 402 }, // 402 Payment Required
      );
    }

    // 3. Fetch Creator's Wallet ID based on whether it's a video or channel
    let creatorWalletId: string | null = null;

    if (type === "VIDEO_PURCHASE") {
      const video = await prisma.video.findUnique({
        where: { id: targetId },
        include: {
          channel: {
            include: {
              creator: {
                include: {
                  user: {
                    include: { wallet: true },
                  },
                },
              },
            },
          },
        },
      });
      creatorWalletId = video?.channel?.creator?.user?.wallet?.id || null;
    } else if (type === "CHANNEL_JOIN") {
      const channel = await prisma.channel.findUnique({
        where: { id: targetId },
        include: {
          creator: {
            include: {
              user: {
                include: { wallet: true },
              },
            },
          },
        },
      });
      creatorWalletId = channel?.creator?.user?.wallet?.id || null;
    }

    // 4. Perform atomic database transaction
    await prisma.$transaction(async (tx) => {
      // Double check inside transaction for race conditions
      if (type === "VIDEO_PURCHASE") {
        const now = new Date();
        const alreadyHave = await tx.purchase.findFirst({
          where: {
            userId,
            videoId: targetId,
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          },
        });

        if (alreadyHave) {
          throw new Error("ALREADY_OWNED");
        }
      }

      // A. Deduct balance from user wallet
      await tx.wallet.update({
        where: { userId },
        data: { walletBalance: { decrement: cost } },
      });

      // B. Log viewer's outgoing wallet transaction
      await tx.walletTransactions.create({
        data: {
          walletId: userWallet.id,
          type: type,
          amount: cost,
        },
      });

      // C. If creator has a wallet, credit their balance and log their incoming earning
      if (creatorWalletId) {
        await tx.wallet.update({
          where: { id: creatorWalletId },
          data: { walletBalance: { increment: cost } },
        });

        await tx.walletTransactions.create({
          data: {
            walletId: creatorWalletId,
            type: "CREATOR_EARNING",
            amount: cost,
          },
        });
      }

      // D. Handle specific target logic
      if (type === "VIDEO_PURCHASE") {
        const expiry = GenrateExpiry(); // Generates 48-hr expiry or null depending on your pricing model
        await tx.purchase.create({
          data: {
            userId,
            videoId: targetId,
            pricePaid: cost,
            expiresAt: expiry,
          },
        });
      } else if (type === "CHANNEL_JOIN") {
        await tx.channel.update({
          where: { id: targetId },
          data: {
            user: { connect: { clerkId: userId } },
          },
        });

        await tx.user.update({
          where: { clerkId: userId },
          data: {
            channel: { connect: { id: targetId } },
          },
        });
      }
    });

    return NextResponse.json(
      {
        success: true,
        message:
          type === "VIDEO_PURCHASE"
            ? "Video purchased successfully!"
            : "Successfully joined the channel!",
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.message === "ALREADY_OWNED") {
      return NextResponse.json(
        {
          success: false,
          message: "You already own or have an active rental for this video.",
        },
        { status: 400 },
      );
    }

    console.error("Wallet transaction error:", error);
    return NextResponse.json(
      { success: false, message: "Transaction failed. Please try again." },
      { status: 500 },
    );
  }
}
