import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, channelId } = body;

    if (!userId || !channelId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID and Channel ID are required",
        },
        { status: 400 },
      );
    }

    // 1. Check if the user is already connected/joined to this channel
    const channelWithUser = await prisma.channel.findFirst({
      where: {
        id: channelId,
        user: {
          some: {
            clerkId: userId,
          },
        },
      },
    });

    let isSubscribed = false;

    if (channelWithUser) {
      // User is already joined -> Disconnect (Leave channel)
      await prisma.channel.update({
        where: { id: channelId },
        data: {
          user: {
            disconnect: { clerkId: userId },
          },
        },
      });
      isSubscribed = false;
    } else {
      // User is not joined -> Connect (Join channel)
      await prisma.channel.update({
        where: { id: channelId },
        data: {
          user: {
            connect: { clerkId: userId },
          },
        },
      });
      isSubscribed = true;
    }

    return NextResponse.json(
      {
        success: true,
        message: isSubscribed
          ? "Successfully joined the channel"
          : "Successfully left the channel",
        isSubscribed,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error while joining/leaving the channel:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Error while processing channel subscription",
      },
      { status: 500 },
    );
  }
}
