"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // Adjusted to standard lib cn import if applicable
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { GetChannel } from "@/features/actions/channel.type";
import { Loader2 } from "lucide-react";
import { ChannelApiResponse } from "../types/types";

interface ChannelProps {
  children: React.ReactNode;
}

const Channel = ({ children }: ChannelProps) => {
  const params = useParams<{ chnId: string }>();
  const channelId = params.chnId;
  // const params = useParams();
  const path = usePathname();
  const router = useRouter();
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // Fetch channel data using the real channelId prop
  const { data, isLoading } = useQuery<ChannelApiResponse>({
    queryKey: ["channel", channelId],
    queryFn: () => GetChannel(channelId),
    enabled: !!channelId,
  });

  const channel = data?.channel;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12">
      {/* Channel Poster Banner */}
      <div
        className={cn(
          "w-full h-44 md:h-52 rounded-2xl bg-muted relative overflow-hidden flex items-center justify-center",
          !channel?.channelPoster &&
            "bg-linear-to-br from-violet-500 via-pink-500 to-orange-600 text-white font-medium",
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Circular Channel Avatar */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md bg-muted shrink-0">
            <Image
              src={
                channel?.channelImage ||
                "https://t4.ftcdn.net/jpg/21/60/45/55/240_F_2160455551_K7sBKVfXLBnd4xvCRTh8ODd5ZpAJNZDN.jpg"
              }
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
              onClick={() => {
                toast.success(`Joined ${channel?.channelName || "channel"}`);
              }}
              className={cn(
                "min-w-40 cursor-pointer mt-2",
                Number(channel?.joiningPrice) < 0
                  ? "bg-green-400"
                  : "bg-blue-400",
              )}
            >
              {Number(channel?.joiningPrice) <= 0
                ? "Join Free"
                : `Join for ${Number(channel?.joiningPrice)}`}
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
      <div className="mt-6">{children}</div>
    </div>
  );
};

export default Channel;
