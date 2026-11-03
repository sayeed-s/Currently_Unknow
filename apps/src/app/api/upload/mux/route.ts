// app/api/upload/mux/route.ts
import Mux from "@mux/mux-node";
import { NextRequest, NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // 1. Create a Mux Direct Upload URL (Do NOT create a Prisma record here!)
    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["signed"], // Secure playback
        mp4_support: "capped-1080p",
      },
    });

    return NextResponse.json({
      success: true,
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (error: any) {
    console.error("Error creating Mux upload URL:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to initialize upload",
      },
      { status: 500 },
    );
  }
}
