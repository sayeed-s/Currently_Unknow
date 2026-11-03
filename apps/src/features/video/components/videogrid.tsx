// components/channel/VideoGrid.tsx
import React from "react";
import VideoCard from "./videocard";
import { ChannelVideoProps } from "@/features/channel/types/types";

interface VideoGridProps {
  videos: ChannelVideoProps[];
  introVideo?: ChannelVideoProps;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, introVideo }) => {
  return (
    <div className="space-y-8 w-full">
      {/* Optional Intro/Featured Video Header */}
      {introVideo && (
        <div className="space-y-3 pb-6 border-b">
          <h2 className="text-lg font-bold tracking-tight">Channel Trailer</h2>
          <div className="max-w-2xl">
            <VideoCard video={introVideo} intro />
          </div>
        </div>
      )}

      {/* 
        Exact YouTube Responsive Grid Breakpoints:
        - Mobile: 1 column
        - Small Tablet (640px+): 2 columns
        - Tablet/Laptop (1024px+): 3 columns
        - Large Desktop (1280px+): 4 columns
        - Ultra-wide Screens (1536px+): 5 columns
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
