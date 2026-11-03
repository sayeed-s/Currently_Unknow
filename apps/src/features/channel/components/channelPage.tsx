import React from "react";
import ChannelCard from "./channelCard";

const ChannelsPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <h2 className="font-bold">Discover Channels</h2>
      <ChannelCard />
    </div>
  );
};

export default ChannelsPage;
