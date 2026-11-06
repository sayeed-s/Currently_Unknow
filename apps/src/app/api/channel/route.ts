import { prisma } from "@/lib/prisma";
import { shuffleArray } from "@/lib/shuffleArray";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // 1. Fetch all channels along with their creator info and subscriber check
    const channels = await prisma.channel.findMany({
      select: {
        id: true,
        channelName: true,
        bio: true,
        channelImage: true,
        joiningPrice: true,
        // Fetch creator details to verify ownership
        creator: {
          select: {
            user: {
              select: {
                clerkId: true,
              },
            },
          },
        },
        // Checks if the specific user ID exists in this channel's members list
        user: userId
          ? {
              where: { clerkId: userId },
              select: { clerkId: true },
            }
          : false,
      },
    });

    // 2. Map the data to add `isCreator` and automatic `isSubscribed` override
    const channelsWithStatus = channels.map((channel) => {
      const { user, creator, ...channelData } = channel;

      // Check if the requesting user is the creator/owner of this channel
      const creatorClerkId = creator?.user?.clerkId;
      const isCreator = Boolean(userId && creatorClerkId === userId);

      // Creator is automatically subscribed/unlocked without payment
      const isSubscribed =
        isCreator || (userId ? Array.isArray(user) && user.length > 0 : false);

      return {
        ...channelData,
        isCreator,
        isSubscribed,
      };
    });

    // 3. Shuffle the channels array randomly on every request
    const randomizedChannels = shuffleArray(channelsWithStatus);

    return NextResponse.json(
      {
        success: true,
        message: "Channels fetched successfully",
        channels: randomizedChannels,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "Error while getting the channels details:",
      error?.message || error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal Error while Getting channels details",
      },
      { status: 500 },
    );
  }
}
