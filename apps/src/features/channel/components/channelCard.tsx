"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { channelProps, UserChannelViewProps } from "../types/types";
import { cn } from "cn";
import { CoinsIcon } from "lucide-react";

interface ChannelCardProps {
  channel: channelProps | UserChannelViewProps;
  studio?: boolean;
}

const ChannelCard = ({ channel, studio }: ChannelCardProps) => {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <Card
        onClick={() => router.push(`/channel/${channel.id}`)}
        className="py-2 hover:bg-muted cursor-pointer px-2 flex-col rounded-xl sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <Image
            src={channel.channelImage}
            alt="video thumbnail"
            width={400}
            height={400}
            className="max-w-14 h-14 rounded-full object-cover"
            draggable={false}
          />

          <div>
            <span className="font-bold text-lg">{channel.channelName}</span>
            <p className="text-xs text-muted-foreground max-w-60 truncate">
              {channel.bio}
            </p>
          </div>
        </div>
        {!studio ? (
          <Button className={cn("")}>
            <p className="px-4 flex gap-1">
              {Number(channel.joiningPrice) <= 0 ? (
                "Join Free"
              ) : (
                <>
                  <span>Join for</span>
                  <CoinsIcon className="size-5 text-[#C6A15B]" />
                  {Number(channel.joiningPrice)}
                </>
              )}
            </p>
          </Button>
        ) : (
          <p className="text-muted-foreground px-4 flex gap-1">
            {Number(channel.joiningPrice) <= 0 ? (
              "Free Joining"
            ) : (
              <>
                <CoinsIcon className="size-5 text-[#C6A15B]" />
                {Number(channel.joiningPrice)}
                <span>Entry Cost</span>
              </>
            )}
          </p>
        )}
      </Card>
    </div>
  );
};

export default ChannelCard;
