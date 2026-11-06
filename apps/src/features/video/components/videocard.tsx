// components/channel/VideoCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChannelVideoProps } from "@/features/channel/types/types";
import Image from "next/image";
import React, { useState } from "react";
import { CoinsIcon, LockIcon, LockOpenIcon, Clock } from "lucide-react";
import { formatTimeAgo, formatVideoExpiry } from "@/lib/dateFormated";
import { cn } from "cn";
import { useRouter } from "next/navigation";
import MultiUseDialog from "@/features/components/MultiUseDialog";
import { WalletPayModal } from "@/features/wallet/components/walletPayModel";

interface VideoCardProps {
  video: ChannelVideoProps;
  userId?: string;
  intro?: boolean;
  onClick?: () => void;
}

const VideoCard = ({ video, intro, userId }: VideoCardProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const formattedRent = Number(video.rentPrice || 0).toFixed(2);
  const formattedBuy = video.buyPrice
    ? Number(video.buyPrice).toFixed(2)
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
          "group flex flex-col w-full overflow-hidden ring-0 p-3 border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/80 cursor-pointer rounded-2xl shadow-xl transition-all duration-300 gap-3 backdrop-blur-sm",
          intro && "sm:flex-row",
        )}
      >
        {/* 16:9 Thumbnail Container */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-zinc-800/60">
          <Image
            src={video.thumbnailUrl || "/placeholder-thumbnail.png"}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            draggable={false}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Intro Badge */}
          {intro && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <Badge className="bg-[#C6A15B] text-black font-semibold border-none text-[10px] px-2.5 py-0.5 shadow-md">
                Intro
              </Badge>
            </div>
          )}

          {/* Lock / Unlock Status Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {!video.isPurchased ? (
              <Badge className="bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 border border-zinc-700/60 backdrop-blur-md p-1.5 shadow-md">
                <LockIcon className="size-3.5 text-[#C6A15B]" />
              </Badge>
            ) : (
              <Badge className="bg-emerald-950/80 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/30 backdrop-blur-md p-1.5 shadow-md">
                <LockOpenIcon className="size-3.5 text-emerald-400" />
              </Badge>
            )}
          </div>

          {/* Duration Chip */}
          {video.duration && (
            <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/80 text-white text-[11px] font-medium px-2 py-0.5 rounded-md backdrop-blur-md tracking-wide border border-white/10">
              {Math.floor(video.duration / 60)}:
              {Math.floor(video.duration % 60)
                .toString()
                .padStart(2, "0")}
            </div>
          )}
        </div>

        {/* Metadata Section */}
        <CardContent className="p-0 space-y-2.5 w-full">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm sm:text-base tracking-tight line-clamp-2 text-white group-hover:text-[#C6A15B] transition-colors leading-snug">
              {video.title}
            </h3>

            <p className="text-xs text-zinc-400 line-clamp-1 leading-normal font-light">
              {video.description || "No description provided."}
            </p>
          </div>

          {/* Pricing or Expiry Status Footer */}
          <div className="flex items-end justify-between pt-2 border-t border-zinc-800/80 text-xs">
            {!video.isPurchased ? (
              <div className="flex items-center md:flex-col md:items-start gap-3">
                {video.rentPrice !== undefined && (
                  <span className="inline-flex items-center font-medium text-[#C6A15B] bg-[#C6A15B]/10 px-2.5 py-1 rounded-md border border-[#C6A15B]/20 gap-1.5 text-xs">
                    <CoinsIcon className="size-3.5" />
                    Rent: ₹{formattedRent}
                  </span>
                )}
                {video.buyPrice !== undefined && Number(formattedBuy) >= 1 && (
                  <span className="inline-flex items-center font-medium text-zinc-300 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700/60 gap-1.5 text-xs">
                    Buy: ₹{formattedBuy}
                  </span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center font-medium text-[#C6A15B] bg-[#C6A15B]/10 px-2.5 py-1 rounded-md border border-[#C6A15B]/20 gap-1.5 text-xs">
                Alreay Purchased
              </div>
            )}

            {video.createdAt && (
              <span className="text-[11px] text-zinc-500 font-medium">
                {formatTimeAgo(video.createdAt)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Purchase Modal Dialog */}
      {!video.isPurchased && (
        <MultiUseDialog
          title="Unlock Video Masterclass"
          description="Rent or buy this content to unlock instant HD playback."
          open={open}
          onOpenChange={setOpen}
        >
          <WalletPayModal
            amount={Number(video.rentPrice)}
            title={`Unlock: ${video.title}`}
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

export default VideoCard;
