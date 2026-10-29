import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeTransactions = searchParams.get("transactions") === "true";

    const wallet = await prisma.wallet.findUnique({
      where: { userId: userId },
      select: {
        id: true,
        walletBalance: true,
        ...(includeTransactions && {
          walletTransactions: {
            take: 10,
            skip: 0,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              amount: true,
              type: true,
              createdAt: true,
            },
          },
        }),
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: `Wallet not found for ID: ${userId}` },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Data from Wallet ID: ${userId}`,
      walletData: wallet,
    });
  } catch (error: any) {
    console.error("Error while fetching wallet data:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching wallet",
      },
      { status: 500 },
    );
  }
}
