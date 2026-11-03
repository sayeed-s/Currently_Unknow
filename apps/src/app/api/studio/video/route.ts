// app/api/studio/video/route.ts (Example backend for final form submit)
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      channelId,
      title,
      description,
      muxUploadId,
      thumbnailUrl,
      thumbnailPublicId,
      isIntro,
      isPublished,
      rentPrice,
      buyPrice,
    } = body;

    // Creates exactly ONE record with both Cloudinary image & Mux upload link
    const video = await prisma.video.create({
      data: {
        channelId,
        title,
        description: description || "",
        muxUploadId, // Linked to Mux upload
        thumbnailUrl, // Cloudinary image URL
        thumbnailPublicId,
        isIntro: isIntro || false,
        isPublished: isPublished || false,
        rentPrice: rentPrice ? parseFloat(rentPrice) : 5.0,
        buyPrice: buyPrice ? parseFloat(buyPrice) : 0,
      },
    });

    return NextResponse.json(
      { success: true, message: "Video record created successfully", video },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating video record:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
