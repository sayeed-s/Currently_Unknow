import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const StudioVideos = () => {
  return (
    <div className="space-y-4">
      <Card className="py-2 rounded-xl gap-3 px-2">
        <CardContent className="px-1">
          <div className="flex gap-2 flex-col min-[330px]:flex-row">
            <Image
              src={
                "https://t4.ftcdn.net/jpg/21/60/45/55/240_F_2160455551_K7sBKVfXLBnd4xvCRTh8ODd5ZpAJNZDN.jpg"
              }
              alt="video thumbnail"
              width={400}
              height={400}
              draggable={false}
              className="max-w-80 h-40 sm:max-w-50 sm:max-h-30 rounded-xl w-full object-cover"
            />
            <div className="max-w-1/3 sm:max-w-2/3 md:max-w-5/7">
              <h3 className="font-semibold text-lg line-clamp-2">
                Video title are give from the creator for the video
              </h3>
              <p className="text-muted-foreground line-clamp-2">
                Video description or caption comes there
              </p>
            </div>
          </div>
        </CardContent>
        <CardContent className="border-t border-muted-foreground/40 grid grid-cols-1 min-[460px]:grid-cols-2 sm:grid-cols-3 pt-2 place-items-center">
          <p className="text-xs leading-loose tracking-wide text-muted-foreground">
            Total Earnings :{" "}
            <span className="font-bold dark:text-white ">20K</span>
          </p>
          <p className="text-xs leading-loose tracking-wide text-muted-foreground md:col-span-2">
            Live on :{" "}
            <span className="font-bold dark:text-white ">09 / 2026</span>
          </p>
        </CardContent>
      </Card>
      <Card className="py-2 rounded-xl gap-3 px-2">
        <CardContent className="px-1">
          <div className="flex gap-2 flex-col min-[330px]:flex-row">
            <Image
              src={
                "https://t4.ftcdn.net/jpg/21/60/45/55/240_F_2160455551_K7sBKVfXLBnd4xvCRTh8ODd5ZpAJNZDN.jpg"
              }
              alt="video thumbnail"
              width={400}
              height={400}
              draggable={false}
              className="max-w-80 h-40 sm:max-w-50 sm:max-h-30 rounded-xl w-full object-cover"
            />
            <div className="max-w-1/3 sm:max-w-2/3 md:max-w-5/7">
              <h3 className="font-semibold text-lg line-clamp-2">
                Video title are give from the creator for the video
              </h3>
              <p className="text-muted-foreground line-clamp-2">
                Video description or caption comes there
              </p>
            </div>
          </div>
        </CardContent>
        <CardContent className="border-t border-muted-foreground/40 grid grid-cols-1 min-[460px]:grid-cols-2 sm:grid-cols-3 pt-2 place-items-center">
          <p className="text-xs leading-loose tracking-wide text-muted-foreground">
            Total Earnings :{" "}
            <span className="font-bold dark:text-white ">20K</span>
          </p>
          <p className="text-xs leading-loose tracking-wide text-muted-foreground md:col-span-2">
            Live on :{" "}
            <span className="font-bold dark:text-white ">09 / 2026</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudioVideos;
