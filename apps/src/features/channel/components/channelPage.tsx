import React from "react";
import ChannelCard from "./channelCard";
import { useQuery } from "@tanstack/react-query";
import { GetChannels } from "@/features/actions/channel.type";
import { channelProps, UserChannelViewProps } from "../types/types";

const ChannelsPage = () => {
  const { data: channels, isLoading } = useQuery<UserChannelViewProps[]>({
    queryKey: ["multiple-channels"],
    queryFn: () => GetChannels(),
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
      <h2 className="font-bold">Discover Channels</h2>
      {channels?.map((chn) => (
        <ChannelCard key={chn.id} channel={chn} />
      ))}
    </div>
  );
};

export default ChannelsPage;
