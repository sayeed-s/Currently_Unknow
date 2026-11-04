// src/features/channel/components/LockedChannelView.tsx
"use client";

import React from "react";
import { Lock, Sparkles, CoinsIcon, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LockedChannelViewProps {
  channelName?: string;
  price?: number;
  isLoading?: boolean;
  onJoinClick: (e: React.MouseEvent) => void;
}

export const LockedChannelView: React.FC<LockedChannelViewProps> = ({
  channelName = "this channel",
  price = 0,
  isLoading = false,
  onJoinClick,
}) => {
  const joiningCost = Number(price);

  return (
    <div className="mt-8 rounded-3xl border border-border/50 bg-gradient-to-b from-muted/30 via-background to-muted/20 p-8 sm:p-12 text-center shadow-xs backdrop-blur-xs flex flex-col items-center justify-center space-y-5 transition-all">
      {/* Decorative Lock Badge */}
      <div className="relative flex items-center justify-center">
        <div className="absolute -inset-2 rounded-full bg-primary/10 blur-md" />
        <div className="relative p-4 rounded-2xl bg-card border border-border/60 shadow-md text-primary">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>
      </div>

      {/* Header & Subtitle */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center justify-center gap-2">
          Exclusive Content Locked
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Join{" "}
          <span className="font-semibold text-foreground">{channelName}</span>{" "}
          to get instant access to full video posts, community updates, and
          creator perks.
        </p>
      </div>

      {/* Pricing Badge & Call to Action */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={onJoinClick}
          disabled={isLoading}
          size="lg"
          className="rounded-full px-8 py-6 font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Sparkles className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400/20" />
          <span className="flex items-center gap-1.5 text-base">
            {joiningCost <= 0 ? (
              "Unlock Channel for Free"
            ) : (
              <>
                <span>Join Channel for</span>
                <CoinsIcon className="size-5 text-[#C6A15B]" />
                <span>{joiningCost}</span>
              </>
            )}
          </span>
        </Button>
      </div>

      {/* Non-refundable Disclaimer */}
      {joiningCost > 0 && (
        <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1 pt-1">
          <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground/60" />
          One-time channel entry fee • Non-refundable upon leaving
        </p>
      )}
    </div>
  );
};

export default LockedChannelView;
