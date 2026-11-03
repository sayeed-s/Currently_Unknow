// components/channel/VideoCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChannelVideoProps } from "@/features/channel/types/types";
import Image from "next/image";
import React from "react";
import { CoinsIcon } from "lucide-react";
import { formatTimeAgo } from "@/lib/dateFormated";
import { cn } from "cn";

interface VideoCardProps {
  video: ChannelVideoProps;
  intro?: boolean;
  onClick?: () => void;
}

const VideoCard = ({ video, intro, onClick }: VideoCardProps) => {
  const formattedRent = Number(video.rentPrice || 0).toFixed(2);
  const formattedBuy = video.buyPrice
    ? Number(video.buyPrice).toFixed(2)
    : null;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group flex flex-col  w-full overflow-hidden px-2 py-2 sm:p-2 border-none bg-transparent shadow-none hover:bg-muted-foreground/10 cursor-pointer rounded-xl ring-0 gap-2.5 transition-all",
        intro && "sm:flex-row",
      )}
    >
      {/* 16:9 Thumbnail Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={video.thumbnailUrl || "/placeholder-thumbnail.png"}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
          draggable={false}
          className="object-cover"
        />

        {/* Intro Badge */}
        {intro && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-indigo-600/90 hover:bg-indigo-600 text-white border-none text-[10px] px-2 py-0.5 backdrop-blur-md flex items-center gap-1 shadow-sm">
              channel Intro
            </Badge>
          </div>
        )}

        {/* Duration Chip (YouTube Style) */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 z-10 bg-black/80 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs tracking-wide">
            {Math.floor(video.duration / 60)}:
            {Math.floor(video.duration % 60)
              .toString()
              .padStart(2, "0")}
          </div>
        )}
      </div>

      {/* Metadata Section */}
      <CardContent className="px-2 pb-2 sm:py-2 space-y-1 w-full">
        <h3 className="font-semibold text-sm sm:text-base tracking-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
          {video.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-1 leading-normal">
          {video.description || "No description provided."}
        </p>

        {/* Details & Monetization Badges */}
        <div className="flex items-center justify-between sm:justify-start text-xs text-muted-foreground pt-1">
          {video.createdAt && (
            <span className="text-[12px]">
              {formatTimeAgo(video.createdAt)}
            </span>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {video.rentPrice !== undefined && (
              <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] gap-2">
                <CoinsIcon className="size-4 text-[#C6A15B]" />
                {formattedRent}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
