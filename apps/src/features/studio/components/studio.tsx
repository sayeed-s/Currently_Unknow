"use client";

import React, { useState } from "react";
import StudioAnalytics from "./studioAnalytics";
import StudioVideos from "./studioVideos";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ChannelCard from "@/features/channel/components/channelCard";
import MultiUseDialog from "@/features/components/MultiUseDialog";
import ChannelCreationForm from "@/features/form/channel/channelCreateForm";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { StudiDashbord } from "@/features/actions/studio.action";
import { StudioVideoProps } from "../studio.type";
import VideoCreationForm from "@/features/form/video/videoCreationForm";

const CreatorStudio = () => {
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideOpen] = useState(false);
  const { userId, isLoaded } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Studio", userId],
    queryFn: () => StudiDashbord(userId as string),
    enabled: isLoaded && !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading Studio data...</p>
      </div>
    );
  }

  const chn = data?.studio_data?.channels;
  const videos = data?.studio_data?.videos ?? [];
  const totalEarnings = data?.studio_data?.totalStudioEarnings || 0;

  const handleVideoDialog = () => setVideOpen((prev) => !prev);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 scrollbar-none pb-12">
      {/* Analytics Section */}
      <h2 className="text-lg font-semibold">Analytics</h2>
      <StudioAnalytics Lifetime={totalEarnings} TotalVideos={videos.length} />

      {/* Channels Header */}
      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-xl font-semibold">Channels</h2>
        {!chn && (
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Channel</span>
          </Button>
        )}
      </div>

      {/* Channel Creation Dialog */}
      <MultiUseDialog
        open={open}
        onOpenChange={setOpen}
        title="Channel Creation Form"
        description="Create a channel to publish your content in a more secure platform"
      >
        <ChannelCreationForm userId={userId as string} />
      </MultiUseDialog>

      {/* Channel Card or Empty State */}
      {chn ? (
        <ChannelCard userId={userId as string} channel={chn} studio={true} />
      ) : (
        <div className="flex items-center justify-center py-10 border border-dashed border-border/60 rounded-2xl bg-muted/20">
          <p className="text-muted-foreground text-sm">
            No Channels are Listed yet.
          </p>
        </div>
      )}

      {/* Recent Videos Header */}
      <div className="flex items-center justify-between mt-10">
        <h2 className="text-xl font-semibold">Recent Videos</h2>
        <div className="space-x-2 flex items-center">
          {videos.length > 5 && <Button variant={"outline"}>View all</Button>}
          {chn && (
            <Button
              onClick={() => setVideOpen(true)}
              className="flex items-center gap-1.5"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Video</span>
            </Button>
          )}
        </div>
      </div>

      {/* Video Creation Dialog */}
      <MultiUseDialog
        open={videoOpen}
        onOpenChange={setVideOpen}
        title="Video Creation Form"
        description="Upload and publish a new video to your channel"
      >
        <VideoCreationForm
          closeForm={handleVideoDialog}
          channelId={chn?.id as string}
          onRefresh={refetch}
        />
      </MultiUseDialog>

      {/* Videos List */}
      <div className="space-y-3 pt-2">
        {videos.length > 0 ? (
          videos.map((vid: StudioVideoProps) => (
            <StudioVideos key={vid.id} video={vid} />
          ))
        ) : (
          <div className="flex items-center justify-center py-8 border border-dashed border-border/60 rounded-2xl bg-muted/20">
            <p className="text-muted-foreground text-sm">
              No videos published yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorStudio;
