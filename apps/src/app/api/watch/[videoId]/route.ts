import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> },
) {
  try {
    const { searchParams } = new URL(request.url);
    const { videoId } = await params;
    const userId = searchParams.get("userId"); // string or null

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: "VideoId is required to get data" },
        { status: 400 },
      );
    }

    // 1. Fetch video, channel owner profile, and user purchases in a single efficient query
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        channel: {
          select: {
            creator: {
              select: {
                userId: true, // Clerk/Auth User ID of the creator
              },
            },
          },
        },
        purchases: userId
          ? {
              where: {
                userId: userId,
                OR: [
                  { accessType: "RENT", expiresAt: { gt: new Date() } },
                  {
                    accessType: "LIFETIME",
                    expiresAt: null,
                  },
                ],
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            }
          : false,
      },
    });

    if (!video) {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 },
      );
    }

    // 2. Check Access Permissions safely
    const creatorUserId = video.channel?.creator?.userId;
    const isOwner = Boolean(
      userId && creatorUserId && userId === creatorUserId,
    );
    const hasPurchased = Boolean(video.purchases && video.purchases.length > 0);

    const isFree =
      (!video.rentPrice || Number(video.rentPrice) === 0) &&
      (!video.buyPrice || Number(video.buyPrice) === 0);

    const canViewPlayback = isOwner || isFree || hasPurchased;

    // 3. Construct response
    const responseData = {
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.createdAt,
      duration: video.duration,
      muxPlaybackId: canViewPlayback ? video.muxPlaybackId : null,
      isLocked: !canViewPlayback,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Video data fetched successfully",
        video: responseData,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "Error while getting the video details",
      error?.message || error,
    );
    return NextResponse.json(
      { success: false, message: "Internal Network Error while Fetching Data" },
      { status: 500 },
    );
  }
}
