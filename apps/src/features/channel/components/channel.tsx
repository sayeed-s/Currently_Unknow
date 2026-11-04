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
  }, [channel?.isSubscribed]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <p className="text-muted-foreground">
          Channel not found or unavailable.
        </p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
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
    <div className="w-full max-w-7xl mx-auto px-4 pt-4 pb-12">
      {/* Channel Poster Banner */}
      <div
        className={cn(
          "w-full h-44 md:h-52 rounded-2xl bg-muted relative overflow-hidden flex items-center justify-center",
          !channel?.channelPoster &&
            "bg-Linear-to-br from-violet-500 via-pink-500 to-orange-600 text-white font-medium",
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
          <span>Channel Banner</span>
        )}
      </div>

      {/* Channel Header Information */}
      <div className="flex flex-col space-y-6 border-b py-6">
        <div className="flex flex-col min-[375px]:flex-row items-start sm:items-center gap-6">
          {/* Circular Channel Avatar */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md bg-muted shrink-0">
            <Image
              src={channel?.channelImage || "/vercel.svg"}
              alt={channel?.channelName || "Channel avatar"}
              fill
              className="object-cover"
              draggable={false}
            />
          </div>

          {/* Channel Details */}
          <div className="space-y-2 flex-1">
            <h1 className="font-bold text-2xl tracking-tight">
              {channel?.channelName || "Loading Channel..."}
            </h1>

            {channel?.bio && (
              <div className="text-muted-foreground text-sm max-w-2xl">
                <p className={cn(!isBioExpanded && "line-clamp-1")}>
                  {channel.bio}
                </p>
                {channel.bio.length > 80 && (
                  <button
                    type="button"
                    onClick={() => setIsBioExpanded(!isBioExpanded)}
                    className="text-blue-500 hover:underline text-xs font-medium mt-0.5 cursor-pointer"
                  >
                    {isBioExpanded ? "Show less" : "more"}
                  </button>
                )}
              </div>
            )}

            <Button
              onClick={handleChnJoin}
              disabled={isActionLoading}
              variant={isSubscribed ? "secondary" : "default"}
              className={cn(
                "rounded-full px-5 font-semibold transition-all duration-200",
                isSubscribed
                  ? "bg-muted text-foreground hover:bg-muted/80 border border-border/60"
                  : "bg-primary text-primary-foreground shadow-sm",
              )}
            >
              {isActionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              ) : isSubscribed ? (
                <UserCheck className="w-4 h-4 mr-1.5 text-emerald-500" />
              ) : (
                <UserPlus className="w-4 h-4 mr-1.5" />
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
          </div>
        </div>

        {/* Navigation Tabs (Videos / Community) */}
        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="ghost"
            onClick={() => router.push(`/channel/${channelId}`)}
            className={cn(
              "rounded-lg font-medium",
              !path.includes("community") && "bg-accent text-accent-foreground",
            )}
          >
            Videos
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push(`/channel/${channelId}/community`)}
            className={cn(
              "rounded-lg font-medium",
              path.includes("community") && "bg-accent text-accent-foreground",
            )}
          >
            Community
          </Button>
        </div>
      </div>

      {/* Nested Page Content */}
      {isSubscribed && <div className="mt-6">{children}</div>}
      {!isSubscribed && (
        <LockedChannelView
          onJoinClick={handleChnJoin}
          channelName={channel.channelName}
          price={Number(channel.joiningPrice)}
        />
      )}

      {/* Wallet Payment Modal Dialog */}
      <MultiUseDialog
        title={`Join channel ${channel.channelName}`}
        description="join your favorite creator channel"
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
