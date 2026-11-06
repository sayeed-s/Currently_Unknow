import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface VideoSkeletonProps {
  grid: number;
  className?: string;
}

const VideoSkeleton = ({ grid, className }: VideoSkeletonProps) => {
  return (
    <div
      className={`space-y-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}
    >
      {Array.from({ length: grid }).map((_, idx) => (
        <div key={idx} className="space-y-3">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
};

export default VideoSkeleton;
