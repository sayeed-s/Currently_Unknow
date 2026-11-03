import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      bio,
      channelName,
      channelImage,
      channelImagePublicId,
      channelPoster,
      channelPosterPublicId,
      joiningPrice,
    } = body;

    // 1. Validate mandatory fields
    if (!userId || !channelName || !channelImage || !channelImagePublicId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing mandatory fields (userId, channelName, channelImage, channelImagePublicId)",
        },
        { status: 400 },
      );
    }

    // 2. Perform database transaction
    const newChannel = await prisma.$transaction(
      async (tx) => {
        // Find the creator profile linked to the user
        const creator = await tx.creatorProfile.findUnique({
          where: { userId },
        });

        if (!creator) {
          throw new Error("CREATOR_NOT_FOUND");
        }

        // Optional: Check if a channel with this name already exists for this creator
        const existingChannel = await tx.channel.findFirst({
          where: {
            creatorId: creator.id,
            channelName: channelName.trim(),
          },
        });

        if (existingChannel) {
          throw new Error("DUPLICATE_CHANNEL_NAME");
        }

        // Create the channel using the creator's actual ID and public IDs
        const channel = await tx.channel.create({
          data: {
            creatorId: creator.id,
            channelName: channelName.trim(),
            channelImage,
            channelImagePublicId,
            channelPoster: channelPoster || null,
            channelPosterPublicId: channelPosterPublicId || null,
            joiningPrice:
              joiningPrice !== undefined ? parseFloat(joiningPrice) : 0,
            bio: bio ? bio.trim() : null,
          },
        });

        return channel;
      },
      {
        maxWait: 10000,
        timeout: 10000,
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: `New channel '${newChannel.channelName}' created successfully!`,
        newChannel,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error while creating a channel:", error);

    // Handle specific custom errors thrown inside the transaction
    if (error.message === "CREATOR_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          message: "Creator profile not found for this user ID.",
        },
        { status: 404 },
      );
    }

    if (error.message === "DUPLICATE_CHANNEL_NAME") {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a channel with this name.",
        },
        { status: 409 },
      );
    }

    // Fallback general error response
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Internal server error while creating the channel.",
      },
      { status: 500 },
    );
  }
}
