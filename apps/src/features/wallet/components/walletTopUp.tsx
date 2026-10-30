"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

interface WalletaTopUpProps {
  walletId: string;
  onSuccess?: () => void;
}

const WalletaTopUp = ({ walletId, onSuccess }: WalletaTopUpProps) => {
  const topUpAmounts = [
    { id: "50", value: 50 },
    { id: "100", value: 100 },
    { id: "200", value: 200 },
    { id: "500", value: 500 },
    { id: "1000", value: 1000 },
  ];

  const [amount, setAmount] = useState<number>(50);
  const [isLoading, setIsLoading] = useState(false);

  // Load Razorpay Script dynamically if not already loaded
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleTopUp = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    try {
      setIsLoading(true);
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.info(
          "Razorpay SDK failed to load. Check your internet connection.",
        );
        setIsLoading(false);
        return;
      }

      // 1. Call API to create Razorpay Order
      const orderRes = await api.post("/wallet/topup", {
        action: "create_order",
        walletId,
        amount,
      });

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || "Failed to create order");
      }

      const { orderId, currency, amount: orderAmount } = orderRes.data;

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: currency,
        name: "VST Media Paltform",
        description: "Wallet Top-Up",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment on Backend after success
            const verifyRes = await api.post("/wallet/topup", {
              action: "verify_payment",
              walletId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              setAmount(50);
              if (onSuccess) {
                toast.success("Top-up successful!");
                onSuccess?.();
              }
            }
          } catch (err: any) {
            console.error("Payment verification failed", err);
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: "Guest user",
        },
        theme: {
          color: "#2D2D2D",
        },
      };

      const paymentWindow = new (window as any).Razorpay(options);
      paymentWindow.open();
    } catch (error: any) {
      console.error("Top-up error:", error);
      toast.error(error.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleTopUp}
      className="space-y-6 w-full max-w-md mx-auto p-4"
    >
      <div className="space-y-2">
        <Label htmlFor="amount-input" className="text-sm font-medium">
          Enter Top-Up Amount
        </Label>
        <div className="relative border-2 rounded-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
            ₹
          </span>
          <Input
            id="amount-input"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d+$/.test(val)) {
                setAmount(Number(val));
              }
            }}
            minLength={2}
            placeholder="Enter Top up Amount"
            className="pl-8 text-lg font-medium"
          />
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">
          Quick Select Amount
        </span>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          {topUpAmounts.map((tp) => (
            <Button
              key={tp.id}
              type="button"
              variant={amount === tp.value ? "default" : "outline"}
              onClick={() => setAmount(tp.value)}
              className="flex-1 min-w-20"
            >
              ₹{tp.value}
            </Button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!amount || amount <= 49 || isLoading}
      >
        {isLoading ? "Processing..." : `Pay ${amount ? `₹${amount}` : ""}`}
      </Button>
    </form>
  );
};

export default WalletaTopUp;
