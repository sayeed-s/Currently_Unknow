import React from "react";
import ChannelCard from "./channelCard";
import { useQuery } from "@tanstack/react-query";
import { GetChannels } from "@/features/actions/channel.action";
import { channelProps, UserChannelViewProps } from "../types/types";
import { useAuth } from "@clerk/nextjs";

const ChannelsPage = () => {
  const { userId, isLoaded } = useAuth();

  const { data: channels, isLoading } = useQuery<UserChannelViewProps[]>({
    queryKey: ["multiple-channels"],
    queryFn: () => GetChannels(userId as string),
    enabled: isLoaded && !!userId,
  });

  if (isLoading) {
    return (
      <div>
        <p>Loading channels</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {channels?.map((chn) => (
        <ChannelCard key={chn.id} channel={chn} userId={userId as string} />
      ))}
    </div>
  );
};

export default ChannelsPage;
