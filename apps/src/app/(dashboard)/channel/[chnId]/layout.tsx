import React from "react";
import Channel from "@/features/channel/components/channel";

const ChannelLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-2">
      <Channel>{children}</Channel>
    </div>
  );
};

export default ChannelLayout;
