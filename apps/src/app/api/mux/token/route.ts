// src/app/api/mux/token/route.ts
import Mux from "@mux/mux-node";
import { NextRequest, NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playbackId = searchParams.get("playbackId");

    if (!playbackId) {
      return NextResponse.json(
        { success: false, message: "Playback ID is required" },
        { status: 400 },
      );
    }

    // Generate a Signed JWT for video playback
    // ⚠️ Ensure your MUX_SIGNING_KEY and MUX_PRIVATE_KEY are added to your .env
    const token = await mux.jwt.signPlaybackId(playbackId, {
      type: "video",
      expiration: "6h", // Token valid for 12 hours
    });

    return NextResponse.json({
      success: true,
      token,
      streamUrl: `https://stream.mux.com/${playbackId}.m3u8?token=${token}`,
    });
  } catch (error: any) {
    console.error("Error generating Mux playback token:", error);
    return NextResponse.json(
      { success: false, message: "Failed to authorize video stream" },
      { status: 500 },
    );
  }
}
