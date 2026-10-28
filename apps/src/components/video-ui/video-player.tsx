"use client";

import React from "react";
import "@videojs/react/video/skin.css";
import { VideoPlayer, VideoSkin, Video } from "@videojs/react/video";

interface MediaPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function MediaPlayer({
  src,
  poster,
  className = "",
}: MediaPlayerProps) {
  return (
    <div
      className={`w-full overflow-hidden border shadow-sm ${className}`}
    >
      <VideoPlayer>
        <VideoSkin className="rounded-none">
          <Video src={src} poster={poster} playsInline />
        </VideoSkin>
      </VideoPlayer>
    </div>
  );
}
