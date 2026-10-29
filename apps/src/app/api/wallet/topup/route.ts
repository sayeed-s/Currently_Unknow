import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      walletId,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!walletId) {
      return NextResponse.json(
        { success: false, message: "Wallet ID is required" },
        { status: 400 },
      );
    }

    // --- WORKFLOW A: Create Razorpay Order ---
    if (action === "create_order") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid amount" },
          { status: 400 },
        );
      }

      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise (e.g., ₹100 = 10000)
        currency: "INR",
        receipt: `receipt_wallet_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    }

    // --- WORKFLOW B: Verify Payment & Top-Up Wallet ---
    if (action === "verify_payment") {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { success: false, message: "Payment verification details missing" },
          { status: 400 },
        );
      }

      // Cryptographically verify signature to ensure payment is authentic
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(sign.toString())
        .digest("hex");

      if (expectedSign !== razorpay_signature) {
        return NextResponse.json(
          { success: false, message: "Invalid payment signature" },
          { status: 400 },
        );
      }

      // Fetch payment details from Razorpay to get the exact amount paid
      const paymentInfo = await razorpay.payments.fetch(razorpay_payment_id);
      const paidAmountInRupees = Number(paymentInfo.amount) / 100;

      // Execute atomic database transaction
      const result = await prisma.$transaction(
        async (tx) => {
          const updatedWallet = await tx.wallet.update({
            where: { id: walletId },
            data: {
              walletBalance: {
                increment: paidAmountInRupees,
              },
            },
          });

          const newTransaction = await tx.walletTransactions.create({
            data: {
              walletId,
              amount: paidAmountInRupees,
              referenceId: razorpay_payment_id,
              type: "TOP_UP",
            },
          });

          return { updatedWallet, newTransaction };
        },
        {
          maxWait: 10000, // default: 2000ms - time to wait to acquire a connection from the pool
          timeout: 10000, // default: 5000ms - time the transaction can run before timing out
        },
      );

      return NextResponse.json({
        success: true,
        message: "Wallet topped up successfully via Razorpay!",
        data: result,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action specified" },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("Error in wallet topup/payment API:", error.message);
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Internal server error during payment processing",
      },
      { status: 500 },
    );
  }
}
