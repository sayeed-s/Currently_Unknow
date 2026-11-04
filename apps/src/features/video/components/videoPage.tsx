// src/features/video/components/VideoCardPage.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { VideoDetails } from "@/features/actions/video.action";
import VideoPlayer from "./videoPlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface VideoCardPageProps {
  videoId: string;
}

const VideoCardPage: React.FC<VideoCardPageProps> = ({ videoId }) => {
  const { userId, isLoaded } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Video", videoId],
    queryFn: () => VideoDetails(videoId, userId as string),
    enabled: isLoaded && !!userId && !!videoId,
  });

  if (isLoading) {
    return <VideoCardPageSkeleton />;
  }

  if (isError || !data?.video) {
    return (
      <div className="w-full py-16 text-center text-sm text-muted-foreground bg-muted/20 rounded-2xl border border-border/40">
        Failed to load video details or video not found.
      </div>
    );
  }

  const { title, description, muxPlaybackId, thumbnailUrl, isLocked } =
    data.video;

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Secure HLS Video Stream Player */}
      {muxPlaybackId ? (
        <VideoPlayer
          playbackId={muxPlaybackId}
          posterUrl={thumbnailUrl || undefined}
          className="shadow-2xl border border-border/40 w-full"
        />
      ) : (
        <div className="w-full aspect-video rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center text-muted-foreground text-sm">
          Video is still processing or unavailable for playback.
        </div>
      )}
      {/* Video Details Section */}
      <div className="space-y-3 px-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
          {title}:{isLocked}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {description || "No description provided for this video."}
        </p>
      </div>
    </div>
  );
};

// Premium Skeleton Loader for smooth transitions
const VideoCardPageSkeleton = () => (
  <div className="space-y-6 w-full max-w-5xl mx-auto">
    <div className="relative w-full aspect-video rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
    <div className="space-y-3 px-1">
      <Skeleton className="h-8 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
    </div>
  </div>
);

export default VideoCardPage;
