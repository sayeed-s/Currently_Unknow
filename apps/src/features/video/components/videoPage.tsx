// src/features/video/components/VideoCardPage.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { VideoDetails } from "@/features/actions/video.action";
import VideoPlayer from "./videoPlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Film, Clock, AlertCircle, ShieldAlert } from "lucide-react";
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

  // Render responsive luxury skeleton while Clerk session or video query loads
  if (isLoading || !isLoaded) {
    return <VideoCardPageSkeleton />;
  }

  if (isError || !data?.video) {
    return (
      <div className="w-full max-w-5xl mx-auto py-20 px-6 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800/80 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">
            Playback Unavailable
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Failed to load video details or the rental period for this content
            has expired.
          </p>
        </div>
      </div>
    );
  }

  const { title, description, muxPlaybackId, thumbnailUrl, duration } =
    data.video;

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-12">
      {/* Cinematic Theater Frame for Video Player */}
      <div className="relative group rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-zinc-800/80 bg-zinc-950">
        {/* Subtle Gold Ambient Glow Effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-[#C6A15B]/20 via-transparent to-[#C6A15B]/10 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 pointer-events-none" />

        <div className="relative w-full aspect-video">
          {muxPlaybackId ? (
            <VideoPlayer
              playbackId={muxPlaybackId}
              posterUrl={thumbnailUrl || undefined}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950/90 text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#C6A15B]/10 border border-[#C6A15B]/20 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-[#C6A15B]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">
                  Stream Restricted or Processing
                </p>
                <p className="text-xs text-zinc-400">
                  Video is currently processing or your 48-hour rental period
                  has expired.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editorial Video Details Section */}
      <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              {title}
            </h1>
            {duration && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#C6A15B]" />
                  {Math.round(duration)} mins runtime
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
            Description
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed whitespace-pre-wrap font-light">
            {description || "No description provided for this video."}
          </p>
        </div>
      </div>
    </div>
  );
};

// Premium Skeleton Loader Matching the Layout Structure
const VideoCardPageSkeleton = () => (
  <div className="space-y-8 w-full max-w-6xl mx-auto pb-12 animate-pulse">
    {/* Cinematic Player Skeleton */}
    <div className="relative w-full aspect-video rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-center overflow-hidden shadow-2xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#C6A15B]/10 border border-[#C6A15B]/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#C6A15B]" />
        </div>
        <span className="text-xs text-zinc-400 font-medium tracking-widest uppercase">
          Initializing Secure Stream...
        </span>
      </div>
    </div>

    {/* Metadata Card Skeleton */}
    <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="border-b border-zinc-800/80 pb-6 space-y-3">
        <Skeleton className="h-8 w-3/4 rounded-lg bg-zinc-800/80" />
        <Skeleton className="h-5 w-28 rounded-full bg-zinc-800/50" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded bg-zinc-800/60" />
        <Skeleton className="h-4 w-full rounded bg-zinc-800/40" />
        <Skeleton className="h-4 w-4/5 rounded bg-zinc-800/40" />
      </div>
    </div>
  </div>
);

export default VideoCardPage;
