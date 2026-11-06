import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // Clerk User ID

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Channel id is required to fetch details",
        },
        { status: 400 },
      );
    }

    const rawChannel = await prisma.channel.findUnique({
      where: { id },
      select: {
        id: true,
        channelName: true,
        bio: true,
        channelPoster: true,
        channelImage: true,
        createdAt: true,
        joiningPrice: true,
        creator: {
          select: {
            user: {
              select: {
                clerkId: true,
              },
            },
          },
        },
        user: userId
          ? {
              where: { clerkId: userId },
              select: { clerkId: true },
            }
          : false,
      },
    });

    if (!rawChannel) {
      return NextResponse.json(
        {
          success: false,
          message: "Channel not found",
        },
        { status: 404 },
      );
    }

    const { user, creator, ...channelData } = rawChannel;

    // Check if the requesting user is the owner/creator of this channel
    const creatorClerkId = creator?.user?.clerkId;
    const isCreator = Boolean(userId && creatorClerkId === userId);

    // Subscribed if they are the creator OR if they exist in the members relation
    const isSubscribed = isCreator || (Array.isArray(user) && user.length > 0);

    return NextResponse.json(
      {
        success: true,
        message: "Channel Details retrieved successfully",
        channel: {
          ...channelData,
          isCreator,
          isSubscribed,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "Error while getting channel details:",
      error?.message || error,
    );
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while getting the channel details",
      },
      { status: 500 },
    );
  }
}
