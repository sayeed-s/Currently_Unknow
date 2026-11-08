"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { GetOverView } from "@/features/actions/overview.action";
import { overviewVideos } from "../types/overview.types";
import OverViewCard from "./overviewCard";
import VideoSkeleton from "@/features/components/VideoSkeleton";

const VideoHomePage = () => {
  const { userId, isLoaded } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["overview", userId],
    queryFn: () => GetOverView(userId as string),
    enabled: isLoaded && !!userId,
  });

  if (isLoading || !isLoaded) {
    return <VideoSkeleton grid={6} />;
  }
  return (
    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data?.videos.map((vido: overviewVideos) => (
        <OverViewCard key={vido.id} video={vido} userId={userId as string} />
      ))}
    </div>
  );
};

export default VideoHomePage;
