"use client";
import { Button } from "@/components/ui/button";
import MediaPlayer from "@/components/video-ui/video-player";
import { UserIcon } from "lucide-react";
import React from "react";

const VideoPage = () => {
  return (
    <div className="space-y-4 max-w-6xl">
      {/* video component */}
      <MediaPlayer className="md:rounded-lg" src="https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/highest.mp4" />
      {/* creator channel */}
      <div className="flex items-center justify-between px-2">
        <Button
          variant={"ghost"}
          className="group dark:hover:bg-transparent hover:bg-transparent gap-4 p-0"
        >
          <UserIcon className="p-2 size-10 bg-primary rounded-full" />
          <p className="flex flex-col">
            <span className="group-hover:underline">Acme Channel</span>
            <span className="text-sm text-muted-foreground">
              2.3k subcribers
            </span>
          </p>
        </Button>
        <Button
          onClick={() => alert("Subscribe channel")}
          className="bg-primary-foreground text-accent hover:bg-accent hover:text-primary-foreground cursor-pointer"
        >
          {" "}
          Subscribe
        </Button>
      </div>
      {/* video views, comments  */}
      {/* video suggestion's */}
    </div>
  );
};

export default VideoPage;
