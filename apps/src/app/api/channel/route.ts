import { prisma } from "@/lib/prisma";
import { shuffleArray } from "@/lib/shuffleArray";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 1. Fetch all channels from the database
    const channels = await prisma.channel.findMany({
      select: {
        id: true,
        channelName: true,
        bio: true,
        channelImage: true,
        joiningPrice: true,
      },
    });

    // 2. Shuffle the channels array randomly on every request
    const randomizedChannels = shuffleArray(channels);

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
