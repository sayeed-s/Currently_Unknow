import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "please login or register your self",
        },
        {
          status: 400,
        },
      );
    }

    const User = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        creatorProfile: true,
      },
    });

    if (!User) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found for this userId",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User profile found",
      User,
    });
  } catch (error: any) {
    console.error("Error while getting the user details:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while getting the user details",
      },
      { status: 500 },
    );
  }
}
