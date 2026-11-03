"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ChannelCard = () => {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <Card
        onClick={() => router.push("/channel/234f435")}
        className="py-2 hover:bg-muted cursor-pointer px-2 rounded-xl flex-row items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Image
            src={
              "https://t4.ftcdn.net/jpg/21/60/45/55/240_F_2160455551_K7sBKVfXLBnd4xvCRTh8ODd5ZpAJNZDN.jpg"
            }
            alt="video thumbnail"
            width={400}
            height={400}
            className="max-w-14 h-14 rounded-full object-cover"
            draggable={false}
          />

          <div>
            <span className="font-bold text-lg">Acme Channel</span>
            <p className="text-xs text-muted-foreground max-w-60 truncate">
              Acme channel bio of the channel were the created put there channel
              niche or anything
            </p>
          </div>
        </div>
        <Button className="bg-green-600 text-white">member $5</Button>
      </Card>

      <Card
        onClick={() => router.push("/channel/234f435")}
        className="py-2 hover:bg-muted cursor-pointer px-2 rounded-xl flex-row items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Image
            src={
              "https://t4.ftcdn.net/jpg/21/60/45/55/240_F_2160455551_K7sBKVfXLBnd4xvCRTh8ODd5ZpAJNZDN.jpg"
            }
            alt="video thumbnail"
            width={400}
            height={400}
            className="max-w-14 h-14 rounded-full object-cover"
            draggable={false}
          />

          <div>
            <span className="font-bold text-lg">Acme Channel</span>
            <p className="text-xs text-muted-foreground max-w-60 truncate">
              Acme channel bio of the channel were the created put there channel
              niche or anything
            </p>
          </div>
        </div>
        <Button title="become a member" className="bg-blue-500 text-white">Join Free</Button>
      </Card>
    </div>
  );
};

export default ChannelCard;
