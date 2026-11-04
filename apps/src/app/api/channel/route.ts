import { prisma } from "@/lib/prisma";
import { shuffleArray } from "@/lib/shuffleArray";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // 1. Fetch all channels and conditionally check if the user is in the channel's `user` relation
    const channels = await prisma.channel.findMany({
      select: {
        id: true,
        channelName: true,
        bio: true,
        channelImage: true,
        joiningPrice: true,
        // Efficiently checks if the specific user ID exists in this channel's members list
        user: userId
          ? {
              where: { clerkId: userId },
              select: { clerkId: true },
            }
          : false,
      },
    });

    // 2. Map the data to add a clean `isSubscribed` boolean flag for each channel
    const channelsWithStatus = channels.map((channel) => {
      const { user, ...channelData } = channel;
      return {
        ...channelData,
        isSubscribed: userId ? Array.isArray(user) && user.length > 0 : false,
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