"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Film, Compass } from "lucide-react";

import { MyPurchaseVideo } from "@/features/actions/video.action";
import { ChannelVideoProps } from "@/features/channel/types/types";
import VideoSkeleton from "@/features/components/VideoSkeleton";
import VideoCard from "@/features/video/components/videocard";
import { Button } from "@/components/ui/button";
import { PurchaseVideoApiResponse } from "../types/purchaseVIdeoProps";
import PurchaseVideoCard from "./purchaseVideoCard";

const PurchaseVideosPage = () => {
  const { userId, isLoaded } = useAuth();

  const { data, isLoading } = useQuery<PurchaseVideoApiResponse>({
    queryKey: ["Purchased_videos", userId],
    queryFn: () => MyPurchaseVideo(userId as string),
    enabled: isLoaded && !!userId,
  });

  if (isLoading || !isLoaded) {
    return <VideoSkeleton grid={4} />;
  }

  const purchases = data?.purchased_videos ?? [];
  const isEmpty = purchases.length === 0;

  return (
    <div className="w-full space-y-6">
      {/* Header Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          My Library
        </h1>
        <p className="text-sm text-zinc-400">
          Access your active video rentals and permanent lifetime purchases.
        </p>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 text-center space-y-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#C6A15B]/10 border border-[#C6A15B]/20">
            <Film className="size-6 text-[#C6A15B]" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h2 className="text-lg font-semibold text-white">
              No active videos found
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              You haven't unlocked any videos yet, or your 48-hour rental
              periods have expired.
            </p>
          </div>
          <Button
            asChild
            className="mt-2 bg-[#C6A15B] hover:bg-[#b5924f] text-black font-semibold rounded-lg px-6"
          >
            <Link href="/home" className="flex items-center gap-2">
              <Compass className="size-4" />
              Explore Catalog
            </Link>
          </Button>
        </div>
      )}

      {/* Video Grid */}
      {!isEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {purchases.map((vid) => (
            <PurchaseVideoCard key={vid.id} pvc={vid} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseVideosPage;
