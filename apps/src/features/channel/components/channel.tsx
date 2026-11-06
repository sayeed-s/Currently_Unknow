// src/features/channel/components/ChannelView.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { GetChannel } from "@/features/actions/channel.action";
import { CoinsIcon, Loader2, UserCheck, UserPlus } from "lucide-react";
import { ChannelApiResponse } from "../types/types";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/axios";
import MultiUseDialog from "@/features/components/MultiUseDialog";
import { WalletPayModal } from "@/features/wallet/components/walletPayModel";
import LeaveChannelModal from "./leaveChannel";
import LockedChannelView from "@/features/components/lockChannelView";

interface ChannelViewProps {
  children: React.ReactNode;
}

const Channel = ({ children }: ChannelViewProps) => {
  const params = useParams<{ chnId: string }>();
  const channelId = params.chnId;
  const { userId, isLoaded } = useAuth();
  const path = usePathname();
  const router = useRouter();

  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery<ChannelApiResponse>({
    queryKey: ["channel", channelId, userId],
    queryFn: () => GetChannel(channelId, userId as string),
    enabled: !!channelId && !!userId && isLoaded,
  });

  const channel = data?.channel;
  const price = Number(channel?.joiningPrice || 0);

  // Sync subscription state when query data updates
  useEffect(() => {
    if (channel?.isSubscribed !== undefined) {
      setIsSubscribed(channel.isSubscribed);
    }

    if (channel?.isCreator !== undefined) {
      setIsCreator(channel.isCreator);
    }
  }, [channel?.isSubscribed, channel?.isCreator]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C6A15B]" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 px-4">
        <p className="text-zinc-400 text-sm">
          Channel not found or unavailable.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-[#C6A15B] text-black font-semibold hover:bg-[#b08d4a]"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  const handleChnJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId) {
      toast.error("Please sign in to join channels.");
      return;
    }

    if (isSubscribed) {
      setIsLeaveModalOpen(true);
      return;
    }

    // If channel costs coins and user is NOT already subscribed, trigger wallet payment modal
    if (price > 0 && !isSubscribed) {
      setIsPayModalOpen(true);
      return;
    }

    // Otherwise, handle free join or leave (toggle) directly via API
    try {
      setIsActionLoading(true);
      const res = await api.post("/channel/join", {
        userId,
        channelId: channel.id,
      });

      if (res.data.success) {
        setIsSubscribed(res.data.isSubscribed);
        toast.success(res.data.message);
        refetch();
      }
    } catch (error: any) {
      console.error("Failed to join channel:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsSubscribed(true);
    setIsPayModalOpen(false);
    toast.success("Successfully joined the channel!");
    refetch();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-12 overflow-x-hidden">
      {/* Channel Poster Banner */}
      <div
        className={cn(
          "w-full h-36 sm:h-48 md:h-56 rounded-xl bg-zinc-900 relative overflow-hidden flex items-center justify-center border border-zinc-800/60 shadow-xl",
          !channel?.channelPoster &&
            "bg-linear-to-br from-violet-600 via-pink-600 to-orange-600 text-white font-semibold",
        )}
      >
        {channel?.channelPoster ? (
          <Image
            src={channel.channelPoster}
            alt="Channel banner"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <span className="text-xs sm:text-sm tracking-wider uppercase opacity-80">
            Channel Banner
          </span>
        )}
      </div>

      {/* Channel Header Information */}
      <div className="flex flex-col space-y-6 border-b border-zinc-800/80 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Circular Channel Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-xl bg-zinc-900 shrink-0">
            <Image
              src={channel?.channelImage || "/vercel.svg"}
              alt={channel?.channelName || "Channel avatar"}
              fill
              className="object-cover"
              draggable={false}
            />
          </div>

          {/* Channel Details */}
          <div className="space-y-3 flex-1 w-full">
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl tracking-tight text-white wrap-words">
              {channel?.channelName || "Loading Channel..."}
            </h1>

            {channel?.bio && (
              <div className="text-zinc-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
                <p
                  className={cn(
                    !isBioExpanded && "line-clamp-2 sm:line-clamp-1",
                  )}
                >
                  {channel.bio}
                </p>
                {channel.bio.length > 70 && (
                  <button
                    type="button"
                    onClick={() => setIsBioExpanded(!isBioExpanded)}
                    className="text-[#C6A15B] hover:underline text-xs font-semibold mt-1 cursor-pointer"
                  >
                    {isBioExpanded ? "Show less" : "...more"}
                  </button>
                )}
              </div>
            )}
            {!isCreator && (
              <Button
                onClick={handleChnJoin}
                disabled={isActionLoading}
                variant={isSubscribed ? "secondary" : "default"}
                className={cn(
                  "rounded-full px-6 font-semibold transition-all duration-200 text-xs sm:text-sm cursor-pointer shadow-md",
                  isSubscribed
                    ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700/60"
                    : "bg-[#C6A15B] text-black hover:bg-[#b08d4a]",
                )}
              >
                {isActionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : isSubscribed ? (
                  <UserCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-1.5" />
                )}

                <span className="flex items-center gap-1.5">
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
            )}
          </div>
        </div>

        {/* Navigation Tabs (Videos / Community) */}
        <div className="flex items-center space-x-2 pt-2 border-t border-zinc-800/40">
          <Button
            variant="ghost"
            onClick={() => router.push(`/channel/${channelId}`)}
            className={cn(
              "rounded-xl font-medium text-xs sm:text-sm transition-colors",
              !path.includes("community")
                ? "bg-zinc-800/80 text-white border border-zinc-700/60"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/60",
              !isSubscribed && "pointer-events-none opacity-50",
            )}
          >
            Videos
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push(`/channel/${channelId}/community`)}
            disabled={!isSubscribed}
            className={cn(
              "rounded-xl font-medium text-xs sm:text-sm transition-colors",
              path.includes("community")
                ? "bg-zinc-800/80 text-white border border-zinc-700/60"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/60",
              !isSubscribed && "pointer-events-none opacity-50",
            )}
          >
            Community
          </Button>
        </div>
      </div>

      {/* Nested Page Content */}
      {isSubscribed && <div className="mt-6 w-full">{children}</div>}
      {!isSubscribed && !isCreator && (
        <div className="mt-6 w-full">
          <LockedChannelView
            onJoinClick={handleChnJoin}
            channelName={channel.channelName}
            price={Number(channel.joiningPrice)}
          />
        </div>
      )}

      {/* Wallet Payment Modal Dialog */}
      <MultiUseDialog
        title={`Join channel ${channel.channelName}`}
        description="Join your favorite creator channel to unlock exclusive masterclasses."
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
        description="Review membership terms before leaving this channel."
        open={isLeaveModalOpen}
        onOpenChange={setIsLeaveModalOpen}
      >
        <LeaveChannelModal
          channelId={channel.id}
          channelName={channel.channelName}
          joiningPrice={Number(channel.joiningPrice)}
          userId={userId as string}
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

export default Channel;
