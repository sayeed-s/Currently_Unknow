import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "UserId is required",
        },
        {
          status: 400,
        },
      );
    }

    const now = new Date();

    // 1. Fetch videos from free channels including creator and active purchase checks
    const rawVideos = await prisma.video.findMany({
      where: {
        channel: {
          joiningPrice: { lt: 1 },
        },
      },
      select: {
        id: true,
        title: true,
        duration: true,
        rentPrice: true,
        buyPrice: true,
        thumbnailUrl: true,
        createdAt: true,
        channel: {
          select: {
            id: true,
            channelName: true,
            channelImage: true,
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
        },
        videoProgress: {
          where: {
            userId,
          },
          select: {
            id: true,
            lastSeen: true,
            updatedAt: true,
          },
        },
        purchases: {
          where: {
            userId,
            OR: [
              { expiresAt: { gt: now } }, // Active 48h rental
              { expiresAt: null }, // Lifetime purchase
            ],
          },
          select: {
            id: true,
            expiresAt: true,
            accessType: true,
          },
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      take: 20,
    });

    // 2. Map video records to compute `isPurchased` and expiration metadata
    const videos = rawVideos.map((video) => {
      const activePurchase = video.purchases[0] || null;

      // Creator of the channel gets automatic full access without purchasing
      const isCreator = Boolean(
        video.channel?.creator?.user?.clerkId &&
        video.channel.creator.user.clerkId === userId,
      );

      // Check if user has a valid active rental/purchase or owns the channel
      const isPurchased = isCreator || Boolean(activePurchase);

      const { purchases, channel, ...videoData } = video;

      // Strip out creator nested relational data from response
      const { creator, ...channelData } = channel;

      return {
        ...videoData,
        channel: channelData,
        isPurchased,
        purchaseExpiresAt: isCreator ? null : activePurchase?.expiresAt || null,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enjoy Channel Videos",
        videos,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("Error while fetching the videos:", error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Error while fetching videos",
      },
      {
        status: 500,
      },
    );
  }
}
