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
          include: {
            channels: {
              // 👈 Directly fetches the single unique channel belonging to this creator
              select: {
                id: true,
                channelName: true,
                bio: true,
                channelImage: true,
                channelPoster: true,
                joiningPrice: true,
              },
            },
          },
        });

        if (!creator) {
          throw new Error("STUDIO_NOT_FOUND");
        }

        const channel = creator.channels;
        const channelId = channel?.id;

        // 2. Fetch videos strictly belonging to this creator's single channel (if created)
        const rawVideos = channelId
          ? await tx.video.findMany({
              where: {
                channelId: channelId,
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
                createdAt: "desc",
              },
              take: 10,
            })
          : [];

        let totalStudioEarnings = 0;

        const videos = rawVideos.map((video) => {
          const videoEarnings = video.purchases.reduce((sum, purchase) => {
            return sum + Number(purchase.pricePaid || 0);
          }, 0);

          totalStudioEarnings += videoEarnings;

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
            totalEarnings: videoEarnings,
          };
        });

        return {
          channels: channel || null, // Matches your frontend expectation: data.studio_data.channels
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
      { status: 200 },
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
