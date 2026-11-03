import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "channel id is requried to fetch details",
      });
    }

    const channel = await prisma.channel.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        channelName: true,
        bio: true,
        channelPoster: true,
        channelImage: true,
        createdAt: true,
        joiningPrice: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Channel Details",
        channel,
      },
      {
        status: 200,
      },
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
