// src/features/overview/components/OverViewCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatTimeAgo, formatVideoExpiry } from "@/lib/dateFormated";
import { CoinsIcon, LockIcon, LockOpenIcon, Clock } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { overviewVideos } from "../types/overview.types";
import { cn } from "cn";
import { useRouter } from "next/navigation";
import MultiUseDialog from "@/features/components/MultiUseDialog";
import { WalletPayModal } from "@/features/wallet/components/walletPayModel";
import { formatDuration } from "@/lib/duration";

interface OverViewCardProps {
  video: overviewVideos;
  userId?: string;
}

const OverViewCard = ({ video, userId }: OverViewCardProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const formattedRent = Number(video.rentPrice || 0).toFixed(2);

  // Clean expiry or purchase label
  const expiryText = video.purchaseExpiresAt
    ? formatVideoExpiry(video.purchaseExpiresAt)
    : video.isPurchased
      ? "Lifetime Access"
      : null;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video.isPurchased) {
      setOpen(true);
    } else {
      router.push(`/watch/${video.id}`);
    }
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        className={cn(
          "group flex flex-col w-full overflow-hidden p-0 border-none bg-transparent shadow-none hover:bg-transparent cursor-pointer rounded-xl ring-0 gap-3 transition-all",
        )}
      >
        {/* 16:9 Thumbnail Container (YouTube Style Rounded Corners) */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900">
          <Image
            src={video.thumbnailUrl || "/placeholder-thumbnail.png"}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            draggable={false}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Lock / Unlock Status Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            {!video.isPurchased ? (
              <Badge className="bg-zinc-950/80 hover:bg-zinc-950 text-zinc-300 border border-zinc-800 backdrop-blur-md p-1.5 shadow-md">
                <LockIcon className="size-3.5 text-[#C6A15B]" />
              </Badge>
            ) : (
              <Badge className="bg-emerald-950/80 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/30 backdrop-blur-md p-1.5 shadow-md">
                <LockOpenIcon className="size-3.5 text-emerald-400" />
              </Badge>
            )}
          </div>

          {/* Duration Chip (YouTube Style) */}
          {video.duration && (
            <div className="absolute bottom-2.5 right-2.5 z-10  backdrop-blur-2xl text-white text-[11px] font-medium px-1.5 py-0.5 rounded tracking-wide">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>

        {/* Metadata Section (YouTube Home Feed Layout) */}
        <CardContent className="p-0 flex items-start gap-3 w-full">
          {/* Channel Avatar */}
          <div className="relative size-9 sm:size-10 rounded-full overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800">
            <Image
              src={video.channel?.channelImage || "/vercel.svg"}
              alt={video.channel?.channelName || "Channel"}
              fill
              className="object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col flex-1 min-w-0 space-y-1">
            {/* Title */}
            <h3 className="font-semibold text-sm tracking-tight line-clamp-2 text-white group-hover:text-[#C6A15B] transition-colors leading-snug">
              {video.title}
            </h3>

            {/* Channel Name */}

            {/* Metadata Footer: Timestamp & Inline Purchase / Rent Badge */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-500 font-light pt-0.5">
              <p className="text-xs text-zinc-400 font-medium truncate hover:text-zinc-200">
                {video.channel?.channelName}
              </p>
              <span>{formatTimeAgo(video.createdAt)}</span>

              {!video.isPurchased ? (
                video.rentPrice !== undefined &&
                Number(video.rentPrice) > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center font-medium text-[#C6A15B] bg-[#C6A15B]/10 px-1.5 py-0.5 rounded border border-[#C6A15B]/20 gap-1 text-[10px]">
                      <CoinsIcon className="size-3" />{formattedRent}
                    </span>
                  </>
                )
              ) : (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <Clock className="size-3" />
                    <span>{expiryText}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Modal Dialog */}
      {!video.isPurchased && (
        <MultiUseDialog
          title={`Unlock ${video.title}`}
          description="Rent or buy this content to unlock instant HD playback."
          open={open}
          onOpenChange={setOpen}
        >
          <WalletPayModal
            amount={Number(video.rentPrice)}
            title={`${video.title}`}
            type="VIDEO_PURCHASE"
            userId={userId as string}
            onSuccess={() => {
              setOpen(false);
              router.push(`/watch/${video.id}`);
            }}
            targetId={video.id}
          />
        </MultiUseDialog>
      )}
    </>
  );
};

export default OverViewCard;
