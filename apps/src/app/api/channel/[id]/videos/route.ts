import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Channel id & User Id are required to get videos",
        },
        { status: 400 },
      );
    }

    // 1. Fetch internal User ID if userId passed is a clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { clerkId: true },
    });

    const targetUserId = user?.clerkId || userId;

    // 2. Fetch videos with filtered user purchases and progress
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
            userId: targetUserId,
          },
          select: {
            lastSeen: true,
            updatedAt: true,
          },
        },
        purchases: {
          where: {
            userId: targetUserId,
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

    // 3. Process video items and calculate valid active purchase state
    const videos = rawVideos.map((video) => {
      const activePurchase = video.purchases[0] || null;

      // Check if purchase exists AND is not expired
      const isPurchased =
        !!activePurchase &&
        (!activePurchase.expiresAt || new Date(activePurchase.expiresAt) > now);

      const { purchases, ...videoData } = video;

      return {
        ...videoData,
        isPurchased,
        purchaseExpiresAt: activePurchase?.expiresAt || null,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Channel Videos",
        videos,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error while fetching channel videos:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Error while Getting channel videos",
      },
      { status: 500 },
    );
  }
}
