// src/features/channel/components/LeaveChannelModal.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CoinsIcon, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface LeaveChannelModalProps {
  channelId: string;
  channelName: string;
  joiningPrice?: number;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LeaveChannelModal: React.FC<LeaveChannelModalProps> = ({
  channelId,
  channelName,
  joiningPrice = 0,
  userId,
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const price = Number(joiningPrice);

  const handleLeaveChannel = async () => {
    try {
      setIsLoading(true);
      const res = await api.post("/channel/join", {
        userId,
        channelId,
      });

      if (res.data.success) {
        toast.success(res.data.message || `Left ${channelName}`);
        onSuccess();
      }
    } catch (error: any) {
      console.error("Failed to leave channel:", error);
      toast.error(error?.response?.data?.message || "Failed to leave channel.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-card border border-border/40 shadow-2xl max-w-xl w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Leave {channelName}?
          </h3>
          <p className="text-xs text-muted-foreground">
            Confirm channel departure
          </p>
        </div>
      </div>

      {/* Warning Message Box */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-2 text-sm text-muted-foreground leading-relaxed">
        <p>Are you sure you want to leave this channel?</p>
        {price > 0 && (
          <p className="text-foreground font-medium pt-1">
            ⚠️ Leaving will{" "}
            <span className="text-destructive font-semibold">not refund</span>{" "}
            your{" "}
            <span className="inline-flex items-center gap-0.5 text-[#C6A15B] font-semibold">
              <CoinsIcon className="w-3.5 h-3.5" />
              {price} coins
            </span>
            . If you decide to rejoin later, you will have to pay the entry fee
            again.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-evenly">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="min-w-40 rounded-xl py-5 font-semibold border-border/60"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isLoading}
          onClick={handleLeaveChannel}
          className="min-w-40 rounded-xl py-5 font-semibold shadow-lg shadow-destructive/20"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Yes, Leave Channel
        </Button>
      </div>
    </div>
  );
};

export default LeaveChannelModal;
