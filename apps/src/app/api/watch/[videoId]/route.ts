import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> },
) {
  try {
    const { searchParams } = new URL(request.url);
    const { videoId } = await params;
    const userId = searchParams.get("userId");

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: "VideoId is required to get data" },
        { status: 400 },
      );
    }

    const creator = await prisma.creatorProfile.findUnique({
      where: {
        userId: userId as string,
      },
      select: {
        id: true,
      },
    });

    // 1. Fetch the video along with its channel owner and purchase records
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        channel: {
          select: { creatorId: true }, // Channel owner's user ID
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

    // 2. Check Access Permissions
    const isOwner = userId && video.channel.creatorId === creator?.id;
    const hasPurchased = video.purchases && video.purchases.length > 0;
    // Assuming you have a boolean or pricing flag. If rentPrice/buyPrice are 0 or null, it's free:
    const isFree =
      (!video.rentPrice || Number(video.rentPrice) === 0) &&
      (!video.buyPrice || Number(video.buyPrice) === 0);

    // If it's not free, user hasn't purchased it, and user isn't the owner -> block access to muxPlaybackId
    const canViewPlayback = isOwner || isFree || hasPurchased;

    // 3. Construct response (hide muxPlaybackId if unauthorized)
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
    console.error("Error while getting the video details", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Network Error while Fetching Data" },
      { status: 500 },
    );
  }
}
