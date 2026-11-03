import React, { useState } from "react";
import StudioAnalytics from "./studioAnalytics";
import StudioVideos from "./studioVideos";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ChannelCard from "@/features/channel/components/channelCard";
import MultiUseDialog from "@/features/components/MultiUseDialog";
import ChannelCreationForm from "@/features/form/channel/channelCreateForm";
import { useAuth } from "@clerk/nextjs";

const CreatorStudio = () => {
  const [open, setOpen] = useState(false);
  const { userId } = useAuth();
  return (
    // <div className="space-y-4">
    <div className="w-full max-w-4xl mx-auto space-y-4 pb-4 scrollbar-none">
      <h2 className="text-lg font-semibold">Analytics</h2>
      <StudioAnalytics />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Channels</h2>
        <div className="space-x-2 flex items-center">
          <Button variant={"outline"}>View all</Button>
          <Button onClick={() => setOpen(true)} className="flex items-center">
            {" "}
            <PlusIcon />
            <span>Create Channel</span>
          </Button>
        </div>
      </div>

      <MultiUseDialog
        open={open}
        onOpenChange={setOpen}
        children={<ChannelCreationForm userId={userId as string} />}
        title="Channel Creation Form"
        description="Create a channel to pulbish your content in more secure platform"
      />

      <ChannelCard />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Videos</h2>
        <div className="space-x-2 flex items-center">
          <Button variant={"outline"}>View all</Button>
          <Button className="flex items-center">
            {" "}
            <PlusIcon />
            <span>Publish new</span>
          </Button>
        </div>
      </div>

      <StudioVideos />
    </div>
    // </div>
  );
};

export default CreatorStudio;
