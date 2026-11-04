// src/features/channel/components/ChannelCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { channelProps, UserChannelViewProps } from "../types/types";
import { cn } from "@/lib/utils";
import { CoinsIcon, Loader2, UserCheck, UserPlus } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import MultiUseDialog from "@/features/components/MultiUseDialog";
import { WalletPayModal } from "@/features/wallet/components/walletPayModel";
import LeaveChannelModal from "./leaveChannel";

interface ChannelCardProps {
  channel: channelProps | UserChannelViewProps;
  userId: string;
  studio?: boolean;
}

const ChannelCard = ({ channel, studio, userId }: ChannelCardProps) => {
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(
    channel.isSubscribed || false,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const price = Number(channel.joiningPrice || 0);

  const handleChnJoin = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔑 Stop card click from triggering navigation

    if (!userId) {
      toast.error("Please sign in to join channels.");
      return;
    }

    // If user is already subscribed, open the leave warning modal
    if (isSubscribed) {
      setIsLeaveModalOpen(true);
      return;
    }

    // If channel costs coins, trigger wallet payment modal
    if (price > 0) {
      setIsPayModalOpen(true);
      return;
    }

    // Otherwise, handle free join directly via API
    try {
      setIsLoading(true);
      const res = await api.post("/channel/join", {
        userId,
        channelId: channel.id,
      });

      if (res.data.success) {
        setIsSubscribed(res.data.isSubscribed);
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.error("Failed to join channel:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsSubscribed(true);
    setIsPayModalOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <Card
        onClick={() => router.push(`/channel/${channel.id}`)}
        className="py-3 hover:bg-muted/50 cursor-pointer px-4 flex flex-col rounded-2xl border border-border/40 transition-all min-[375px]:flex-row min-[375px]:items-center min-[375px]:justify-between gap-4 shadow-sm"
      >
        {/* Channel Details Section */}
        <div className="flex items-center gap-4">
          <Image
            src={channel.channelImage || "/placeholder-avatar.png"}
            alt={channel.channelName || "Channel avatar"}
            width={400}
            height={400}
            className="w-14 h-14 rounded-full object-cover border border-border/60"
            draggable={false}
          />

          <div className="space-y-0.5">
            <span className="font-bold text-lg text-foreground">
              {channel.channelName}
            </span>
            <p className="text-xs text-muted-foreground max-w-30 md:max-w-60 sm:max-w-xs truncate">
              {channel.bio || "Creator channel"}
            </p>
          </div>
        </div>

        {/* Action Button / Pricing */}
        {!studio ? (
          <Button
            onClick={handleChnJoin}
            disabled={isLoading}
            variant={isSubscribed ? "secondary" : "default"}
            className={cn(
              "rounded-full px-5 font-semibold transition-all duration-200",
              isSubscribed
                ? "bg-muted text-foreground hover:bg-muted/80 border border-border/60"
                : "bg-primary text-primary-foreground shadow-sm",
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
            ) : (
              isSubscribed && (
                <UserCheck className="w-4 h-4 mr-1.5 text-emerald-500" />
              )
            )}

            <span className="flex items-center gap-1">
              {isSubscribed ? (
                "Joined"
              ) : price <= 0 ? (
                "Join Free"
              ) : (
                <>
                  <span>Join for</span>
                  <CoinsIcon className="size-4 text-[#C6A15B]" />
                  {price}
                </>
              )}
            </span>
          </Button>
        ) : (
          <div className="text-sm font-medium text-muted-foreground px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 flex items-center gap-1.5">
            {price <= 0 ? (
              "Free Joining"
            ) : (
              <>
                <CoinsIcon className="size-4 text-[#C6A15B]" />
                <span>{price} Entry Cost</span>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Wallet Payment Modal Dialog */}
      <MultiUseDialog
        title="Channel Joining Fee"
        description="Join this channel to unlock exclusive content and perks."
        open={isPayModalOpen}
        onOpenChange={setIsPayModalOpen}
      >
        <WalletPayModal
          amount={price}
          title={`Join ${channel.channelName}`}
          userId={userId as string}
          targetId={channel.id}
          type="CHANNEL_JOIN"
          onSuccess={handlePaymentSuccess}
        />
      </MultiUseDialog>

      {/* Leave Channel Warning Modal Dialog */}
      <MultiUseDialog
        title="Leave Channel"
        description="Review terms before leaving this channel."
        open={isLeaveModalOpen}
        onOpenChange={setIsLeaveModalOpen}
      >
        <LeaveChannelModal
          channelId={channel.id}
          channelName={channel.channelName}
          joiningPrice={Number(channel.joiningPrice)}
          userId={userId}
          onCancel={() => setIsLeaveModalOpen(false)}
          onSuccess={() => {
            setIsSubscribed(false);
            setIsLeaveModalOpen(false);
            router.refresh();
          }}
        />
      </MultiUseDialog>
    </div>
  );
};

export default ChannelCard;