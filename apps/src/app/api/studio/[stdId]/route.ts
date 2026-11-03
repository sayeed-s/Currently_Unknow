import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stdId: string }> },
) {
  try {
    const { stdId } = await params;

    if (!stdId) {
      return NextResponse.json(
        {
          success: false,
          message: "Studio ID is required to fetch details",
        },
        { status: 400 },
      );
    }

    const studio = await prisma.$transaction(
      async (tx) => {
        // 1. Find creator profile linked to the user/studio ID
        const creator = await tx.creatorProfile.findUnique({
          where: {
            userId: stdId,
          },
        });

        if (!creator) {
          throw new Error("STUDIO_NOT_FOUND");
        }

        // 2. Fetch all channels belonging to this creator
        const channels = await tx.channel.findUnique({
          where: {
            creatorId: creator.id,
          },
          select: {
            id: true,
            channelName: true,
            bio: true,
            channelImage: true,
            channelPoster: true,
            joiningPrice: true,
          },
        });

        // 3. Fetch videos across all channels ordered by recent creation date
        const rawVideos = await tx.video.findMany({
          where: {
            channelId: channels?.id,
          },
          select: {
            id: true,
            title: true,
            isPublished: true,
            description: true,
            thumbnailUrl: true,
            createdAt: true,
            channelId: true,
            rentPrice: true,
            buyPrice: true,
            isIntro: true,
            purchases: {
              select: {
                pricePaid: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc", // Global recent order across all channels
          },
          take: 10, // Optional: limit total recent videos fetched
        });

        let totalStudioEarnings = 0;

        const videos = rawVideos.map((video) => {
          // Sum up all purchase amounts for this specific video
          const videoEarnings = video.purchases.reduce((sum, purchase) => {
            return sum + Number(purchase.pricePaid || 0);
          }, 0);

          totalStudioEarnings += videoEarnings;

          // Return video object with computed earnings & purchase count (omit raw purchases array if desired)
          return {
            id: video.id,
            title: video.title,
            isPublished: video.isPublished,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            createdAt: video.createdAt,
            channelId: video.channelId,
            rentPrice: video.rentPrice,
            isIntro: video.isIntro,
            buyPrice: video.buyPrice,
            totalPurchases: video.purchases.length,
            totalEarnings: videoEarnings, // 💰 Computed earnings for this video
          };
        });

        return {
          channels,
          videos,
          totalStudioEarnings,
        };
      },
      {
        timeout: 10000,
        maxWait: 10000,
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Studio data fetched successfully",
        studio_data: studio,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("Error while fetching the studio data:", error);

    if (error.message === "STUDIO_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          message: "Studio data not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Error while fetching the studio data",
      },
      { status: 500 },
    );
  }
}
