// app/api/webhook/mux/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.type;

    // Triggered when Mux successfully finishes processing and encoding the uploaded video
    // app/api/webhook/mux/route.ts
    if (eventType === "video.asset.ready") {
      const asset = body.data;
      const uploadId = asset.upload_id;
      const playbackId = asset.playback_ids?.[0]?.id;
      const duration = asset.duration;

      // Updates the single database row with Mux streaming data
      await prisma.video.updateMany({
        where: { muxUploadId: uploadId },
        data: {
          muxAssetId: asset.id,
          muxPlaybackId: playbackId,
          duration: duration,
        },
      });
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
