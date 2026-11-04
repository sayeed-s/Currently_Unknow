// src/features/video/components/VideoPlayer.tsx
"use client";

import React, { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { api } from "@/lib/axios";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  playbackId: string;
  posterUrl?: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  playbackId,
  posterUrl,
  className = "",
}) => {
  // 🔑 Updated state type definition to match Mux's expected shape
  const [tokens, setTokens] = useState<{ playback?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchSignedToken() {
      try {
        setIsLoading(true);
        const response = await api.get(`/mux/token?playbackId=${playbackId}`);
        const { token } = response.data;

        if (isMounted) {
          // 🔑 Pass 'playback' instead of 'playbackToken'
          setTokens({ playback: token });
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Failed to load video token:", err);
        if (isMounted) {
          setError("Unable to authorize stream playback.");
          setIsLoading(false);
        }
      }
    }

    if (playbackId) {
      fetchSignedToken();
    }

    return () => {
      isMounted = false;
    };
  }, [playbackId]);

  if (isLoading) {
    return (
      <div
        className={`relative w-full aspect-video rounded-xl bg-black flex items-center justify-center ${className}`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`relative w-full aspect-video rounded-xl bg-black/90 flex items-center justify-center p-6 text-center text-destructive text-sm ${className}`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black max-w-7xl ${className}`}
    >
      <MuxPlayer
        playbackId={playbackId}
        tokens={tokens}
        poster={posterUrl}
        streamType="on-demand"
        accentColor="#3b82f6"
        className="w-full h-full"
      />
    </div>
  );
};

export default VideoPlayer;
