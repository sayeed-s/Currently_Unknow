"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GetChannelVideos } from "@/features/actions/channel.action";
import { ChannelVideosApiResponse } from "../types/types";
import VideoCard from "@/features/video/components/videocard";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelVideoProps {
  channelId: string;
}

const ChannelVideo: React.FC<ChannelVideoProps> = ({ channelId }) => {
  const { data, isLoading, isError } = useQuery<ChannelVideosApiResponse>({
    queryKey: ["channel_videos", channelId],
    queryFn: () => GetChannelVideos(channelId),
    enabled: !!channelId,
  });

  if (isLoading) {
    return <VideoGridSkeleton />;
  }

  if (isError || !data?.videos) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Failed to load channel videos. Please try again later.
      </div>
    );
  }

  // Separate intro video from standard videos
  const introVideo = data.videos.find((vid) => vid.isIntro);
  const regularVideos = data.videos.filter((vid) => !vid.isIntro);

  if (data.videos.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No videos uploaded to this channel yet.
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full">
      {/* 1. Featured Channel Intro / Trailer Video */}
      {introVideo && (
        <div className="space-y-3 pb-8 border-b border-border/40">
          <div className="max-w-4xl">
            <VideoCard video={introVideo} intro={true} />
          </div>
        </div>
      )}

      {/* 2. YouTube Responsive Video Grid */}
      {regularVideos.length > 0 && (
        <div className="space-y-4">
          {introVideo && (
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Videos
            </h2>
          )}

          {/* Responsive YouTube Grid Breakpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
            {regularVideos.map((vid) => (
              <VideoCard key={vid.id} video={vid} intro={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Skeleton Loader for smooth page transitions
const VideoGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="w-full aspect-video rounded-xl" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

export default ChannelVideo;
