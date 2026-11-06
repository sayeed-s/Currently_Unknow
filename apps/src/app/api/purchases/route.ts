import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required for further process",
        },
        { status: 400 },
      );
    }

    const now = new Date();

    const purchases = await prisma.purchase.findMany({
      where: {
        userId,
        OR: [
          // Condition 1: If it's a RENT, it must not be expired
          {
            accessType: "RENT",
            expiresAt: { gt: now },
          },
          // Condition 2: If it's LIFETIME, expiry must be null
          {
            accessType: "LIFETIME",
            expiresAt: null,
          },
        ],
      },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
            duration: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Shows newly acquired videos first
      },
    });

    return NextResponse.json({
      success: true,
      message: "Active purchased videos retrieved successfully",
      purchased_videos: purchases,
    });
  } catch (error: any) {
    console.error("Error while fetching active purchases:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching purchased videos",
      },
      { status: 500 },
    );
  }
}
