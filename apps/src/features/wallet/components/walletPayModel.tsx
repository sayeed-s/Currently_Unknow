"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CoinsIcon, Loader2, Wallet } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface WalletPayModalProps {
  userId: string;
  targetId: string; // videoId or channelId
  title: string;
  amount: number;
  type: "VIDEO_PURCHASE" | "CHANNEL_JOIN";
  onSuccess: () => void;
}

export const WalletPayModal: React.FC<WalletPayModalProps> = ({
  userId,
  targetId,
  title,
  amount,
  type,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const res = await api.post("/wallet/pay", {
        userId,
        targetId,
        type,
        amount,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Payment failed";
      toast.error(errorMessage,error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-card border border-border/40 shadow-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Confirm Purchase</h3>
          <p className="text-xs text-muted-foreground">
            Secure Wallet Checkout
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Item:</span>
          <span className="font-medium text-foreground truncate max-w-50">
            {title}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Cost:</span>
          <span className="font-bold text-foreground flex items-center gap-1">
            <CoinsIcon className="w-4 h-4 text-[#C6A15B]" />
            {amount} Coins
          </span>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full rounded-xl py-6 font-semibold shadow-lg shadow-primary/20"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : (
          <CoinsIcon className="w-5 h-5 mr-2 text-[#C6A15B]" />
        )}
        Pay {amount} Coins & Unlock
      </Button>
    </div>
  );
};
