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
import { StudiDashbord } from "@/features/actions/studio.types";
import { channelProps } from "@/features/channel/types/types";
import { StudioVideoProps } from "../studio.type";
import VideoCreationForm from "@/features/form/video/videoCreationForm";
import { id } from "zod/v4/locales";

const CreatorStudio = () => {
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideOpen] = useState(false);
  const { userId } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Studio"],
    queryFn: () => StudiDashbord(userId as string),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div>
        <p>Loading channels</p>
      </div>
    );
  }

  const chn = data?.studio_data.channels ?? {};
  const videos = data.studio_data.videos ?? [];

  const handleVideoDialog = () => setVideOpen((prev) => !prev);
  return (
    // <div className="space-y-4">
    <div className="w-full max-w-4xl mx-auto space-y-4 scrollbar-none">
      <h2 className="text-lg font-semibold">Analytics</h2>
      <StudioAnalytics
        Lifetime={data.studio_data.totalStudioEarnings}
        TotalVideos={videos.length}
      />

      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-xl font-semibold">Channels</h2>
        {!chn && (
          <Button onClick={() => setOpen(true)} className="flex items-center">
            {" "}
            <PlusIcon />
            <span>Create Channel</span>
          </Button>
        )}
      </div>

      <MultiUseDialog
        open={open}
        onOpenChange={setOpen}
        children={<ChannelCreationForm userId={userId as string} />}
        title="Channel Creation Form"
        description="Create a channel to pulbish your content in more secure platform"
      />

      {chn ? (
        <ChannelCard channel={chn} studio={true} />
      ) : (
        <div className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">No Channels are Listed</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-10">
        <h2 className="text-xl font-semibold">Recent Videos</h2>
        <div className="space-x-2 flex items-center">
          {videos.length > 5 && <Button variant={"outline"}>View all</Button>}
          <Button
            onClick={() => setVideOpen(true)}
            className="flex items-center"
          >
            {" "}
            <PlusIcon />
            <span>Create Video</span>
          </Button>
        </div>
      </div>
      <MultiUseDialog
        open={videoOpen}
        onOpenChange={setVideOpen}
        children={
          <VideoCreationForm
            closeForm={handleVideoDialog}
            channelId={chn.id}
            onRefresh={refetch}
          />
        }
        title="Channel Creation Form"
        description="Create a channel to pulbish your content in more secure platform"
      />

      {videos.map((vid: StudioVideoProps) => (
        <StudioVideos key={vid.id} video={vid} />
      ))}
    </div>
    // </div>
  );
};

export default CreatorStudio;
