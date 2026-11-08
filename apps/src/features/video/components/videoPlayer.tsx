// src/features/video/components/VideoPlayer.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { api } from "@/lib/axios";
import { Loader2, Clock, Coins } from "lucide-react";
import MultiUseDialog from "@/features/components/MultiUseDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoPlayerProps {
  playbackId: string;
  videoId: string;
  userId: string;
  isPurchased: boolean;
  rentPrice: number;
  title: string;
  posterUrl?: string;
  className?: string;
  onPurchaseSuccess?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  playbackId,
  videoId,
  userId,
  isPurchased,
  rentPrice,
  title,
  posterUrl,
  className = "",
  onPurchaseSuccess,
}) => {
  const playerRef = useRef<any>(null);
  const [tokens, setTokens] = useState<{ playback?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rental & Access States
  const [hasAccess, setHasAccess] = useState(isPurchased);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // 1. Fetch Mux Signed Token on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchSignedToken() {
      try {
        setIsLoading(true);
        const response = await api.get(`/mux/token?playbackId=${playbackId}`);
        const { token } = response.data;

        if (isMounted) {
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

  // 2. Intercept playback if the user hasn't purchased/rented the video yet
  const handlePlayAttempt = (e: Event) => {
    if (!hasAccess) {
      e.preventDefault();
      if (playerRef.current) {
        playerRef.current.pause();
      }
      setIsModalOpen(true);
    }
  };

  // 3. Handle Rental Confirmation & API Call
  const handleConfirmRent = async () => {
    try {
      setIsConfirming(true);

      const res = await api.post("/video/track", {
        userId,
        videoId,
      });

      if (res.data.success) {
        toast.success(
          "Rental unlocked! Your 48-hour viewing window has started.",
        );
        setHasAccess(true);
        setIsModalOpen(false);

        if (onPurchaseSuccess) {
          onPurchaseSuccess();
        }

        // Resume playback automatically
        if (playerRef.current) {
          playerRef.current.play();
        }
      }
    } catch (err: any) {
      console.error("Failed to process rental:", err);
      toast.error(
        err?.response?.data?.message || "Failed to process rental transaction.",
      );
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`relative w-full aspect-video rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center ${className}`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-[#C6A15B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`relative w-full aspect-video rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center p-6 text-center text-red-400 text-xs sm:text-sm ${className}`}
      >
        {error}
      </div>
    );
  }

  return (
    <>
      <div
        className={`relative w-full aspect-video md:rounded-2xl overflow-hidden shadow-2xl ${className}`}
      >
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
          tokens={tokens}
          poster={posterUrl}
          streamType="on-demand"
          accentColor="#C6A15B"
          onPlay={handlePlayAttempt}
          metadata={{
            video_id: videoId,
            video_title: title,
          }}
          className="w-full h-full"
        />
      </div>

      {/* 48-Hour Rental Notice Modal */}
      <MultiUseDialog
        title="48-Hour Rental Notice"
        description={`Renting "${title}" will start your 48-hour viewing window immediately.`}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <div className="space-y-6 pt-2">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <Clock className="size-5 text-[#C6A15B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">
                How rentals work
              </h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Once confirmed, ₹{Number(rentPrice || 0).toFixed(2)} will be
                deducted from your wallet, granting you unlimited replays for
                the next 48 hours.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isConfirming}
              className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRent}
              disabled={isConfirming}
              className="bg-[#C6A15B] hover:bg-[#b08d4a] text-black font-semibold rounded-xl cursor-pointer shadow-lg shadow-[#C6A15B]/20 text-xs"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Processing...</span>
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>Confirm & Rent for</span>
                  <Coins className="size-3.5" />
                  <span>₹{Number(rentPrice || 0).toFixed(2)}</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </MultiUseDialog>
    </>
  );
};

export default VideoPlayer;
