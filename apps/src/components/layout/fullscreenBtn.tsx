// src/components/fullscreen-button.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";

export function FullscreenToggleButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync state if user exits via ESC key or browser controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenEnabled) {
        toast.error(
          "Fullscreen mode is not supported on this browser. Add to Home Screen for an app experience.",
        );
        return;
      }

      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Error toggling fullscreen mode:", err);
    }
  };

  return (
    <Button
      onClick={toggleFullscreen}
      className="text-black font-bold rounded-xl px-4 gap-2 shadow-lg shadow-[#C6A15B]/20 cursor-pointer"
    >
      {isFullscreen ? (
        <>
          <Minimize2 className="size-4" />
        </>
      ) : (
        <>
          <Maximize2 className="size-4" />
        </>
      )}
    </Button>
  );
}
