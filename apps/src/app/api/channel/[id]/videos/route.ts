import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // Channel ID
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // Clerk ID

    if (!id || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Channel id & User Id are required to get videos",
        },
        { status: 400 },
      );
    }

    // 1. Fetch channel details to see who owns it (creator's clerkId)
    const channel = await prisma.channel.findUnique({
      where: { id },
      select: {
        creator: {
          select: {
            user: {
              select: {
                clerkId: true,
              },
            },
          },
        },
      },
    });

    if (!channel) {
      return NextResponse.json(
        {
          success: false,
          message: "Channel not found",
        },
        { status: 404 },
      );
    }

    const creatorClerkId = channel.creator?.user?.clerkId;
    const isCreator = Boolean(creatorClerkId && creatorClerkId === userId);

    // 2. Fetch channel videos along with purchases and progress for the user
    const rawVideos = await prisma.video.findMany({
      where: {
        channelId: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        isIntro: true,
        rentPrice: true,
        buyPrice: true,
        createdAt: true,
        thumbnailUrl: true,
        videoProgress: {
          where: {
            userId: userId,
          },
          select: {
            lastSeen: true,
            updatedAt: true,
          },
        },
        purchases: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
            createdAt: true,
            expiresAt: true,
          },
          take: 1,
        },
      },
      take: 10,
    });

    const now = new Date();

    // 3. Process video items and calculate valid access state (Creator gets instant access)
    const videos = rawVideos.map((video) => {
      const activePurchase = video.purchases[0] || null;

      // Check if user has an active purchase/rental
      const hasValidPurchase =
        !!activePurchase &&
        (!activePurchase.expiresAt || new Date(activePurchase.expiresAt) > now);

      // If the user is the creator of the channel OR has purchased it, grant full access
      const isPurchased = isCreator || hasValidPurchase;

      const { purchases, ...videoData } = video;

      return {
        ...videoData,
        isPurchased,
        purchaseExpiresAt: isCreator ? null : activePurchase?.expiresAt || null,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Channel Videos fetched successfully",
        videos,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "Error while fetching channel videos:",
      error?.message || error,
    );
    return NextResponse.json(
      {
        success: false,
        message: "Internal Error while Getting channel videos",
      },
      { status: 500 },
    );
  }
}
