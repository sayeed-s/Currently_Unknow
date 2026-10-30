import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { payoutMethod, accountHolderName, accountNumber, ifscCode, upiId } =
      body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    // Check if creator profile already exists
    const existingCreator = await prisma.creatorProfile.findUnique({
      where: { userId },
    });

    if (existingCreator) {
      return NextResponse.json(
        {
          success: false,
          message: "Creator profile already exists for this user",
        },
        { status: 400 },
      );
    }

    // Validate based on payout method
    if (payoutMethod === "upi" || upiId) {
      if (!upiId) {
        return NextResponse.json(
          { success: false, message: "UPI ID is required" },
          { status: 400 },
        );
      }
    } else if (payoutMethod === "bank" || accountNumber || ifscCode) {
      if (!accountNumber || !ifscCode || !accountHolderName) {
        return NextResponse.json(
          { success: false, message: "All bank detail fields are required" },
          { status: 400 },
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Valid payout method and details are required",
        },
        { status: 400 },
      );
    }

    const resolvedMethod = upiId ? "UPI" : "BANK";

    // Create Creator Profile in DB
    const creatorProfile = await prisma.creatorProfile.create({
      data: {
        userId,
        payoutMethod: resolvedMethod,
        upiId: resolvedMethod === "UPI" ? upiId : null,
        accountHolderName: resolvedMethod === "BANK" ? accountHolderName : null,
        accountNumber: resolvedMethod === "BANK" ? accountNumber : null,
        ifscCode: resolvedMethod === "BANK" ? ifscCode : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Creator registered successfully",
        data: creatorProfile,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error while registering the creator:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while creating the creator account",
      },
      { status: 500 },
    );
  }
}
