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

interface ChannelCardProps {
  channel: (channelProps | UserChannelViewProps);
  studio?: boolean;
  userId?: string;
}

const ChannelCard = ({ channel, studio, userId }: ChannelCardProps) => {
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(
    channel.isSubscribed || false,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChnJoin = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔑 Stop card click from triggering navigation

    if (!userId) {
      toast.error("Please sign in to join channels.");
      return;
    }

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
            <p className="text-xs text-muted-foreground max-w-60 sm:max-w-xs truncate">
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
            ) : isSubscribed && (
              <UserCheck className="w-4 h-4 mr-1.5 text-emerald-500" />
            )}

            <span className="flex items-center gap-1">
              {isSubscribed ? (
                "Joined"
              ) : Number(channel.joiningPrice) <= 0 ? (
                "Join Free"
              ) : (
                <>
                  <span>Join for</span>
                  <CoinsIcon className="size-4 text-[#C6A15B]" />
                  {Number(channel.joiningPrice)}
                </>
              )}
            </span>
          </Button>
        ) : (
          <div className="text-sm font-medium text-muted-foreground px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 flex items-center gap-1.5">
            {Number(channel.joiningPrice) <= 0 ? (
              "Free Joining"
            ) : (
              <>
                <CoinsIcon className="size-4 text-[#C6A15B]" />
                <span>{Number(channel.joiningPrice)} Entry Cost</span>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChannelCard;
