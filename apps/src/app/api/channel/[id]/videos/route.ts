import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Channel id is Requried to get details",
        },
        {
          status: 400,
        },
      );
    }

    const videos = await prisma.video.findMany({
      where: {
        channelId: id,
      },
      take: 10,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Channel Videos",
        videos,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("Error while fetching channel videos", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Error while Getting channel videos",
      },
      {
        status: 500,
      },
    );
  }
}
