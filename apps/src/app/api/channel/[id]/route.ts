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

    const { user, ...channelData } = rawChannel;
    const isSubscribed = userId
      ? Array.isArray(user) && user.length > 0
      : false;

    return NextResponse.json(
      {
        success: true,
        message: "Channel Details",
        channel: {
          ...channelData,
          isSubscribed,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error while getting channel details:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while getting the channel details",
      },
      { status: 500 },
    );
  }
}
