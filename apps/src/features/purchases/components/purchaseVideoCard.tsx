import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatDate,
  formatTimeAgo,
  formatVideoExpiry,
} from "@/lib/dateFormated";
import { cn } from "cn";
import { CoinsIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { PurchaseVideosCardProps } from "../types/purchaseVIdeoProps";
import { useRouter } from "next/navigation";

interface PVCprops {
  pvc: PurchaseVideosCardProps;
}

const PurchaseVideoCard = ({ pvc }: PVCprops) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/watch/${pvc.video.id}`)}
      className={cn(
        "group min-[360px]:flex-row  sm:flex-col  w-full overflow-hidden px-2 py-2 sm:p-2 border-none bg-transparent shadow-none hover:bg-muted-foreground/10 cursor-pointer rounded-xl ring-0 gap-2.5 transition-all",
      )}
    >
      {/* 16:9 Thumbnail Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={pvc.video.thumbnailUrl || "/placeholder-thumbnail.png"}
          alt={pvc.video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
          draggable={false}
          className="object-cover"
        />

        <div className="absolute top-2 left-2 z-10">
          <Badge
            className={`${pvc.accessType === "RENT" ? "bg-indigo-600/90 hover:bg-indigo-600 text-white" : "bg-green-500/80 hover:bg-green-500 text-white"} border-none text-[10px] px-2 py-0.5 backdrop-blur-md flex items-center gap-1 shadow-sm`}
          >
            {pvc.accessType}
          </Badge>
        </div>

        {/* Duration Chip (YouTube Style) */}
        {pvc.video.duration && (
          <div className="absolute bottom-2 right-2 z-10 bg-black/80 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs tracking-wide">
            {Math.floor(pvc.video.duration / 60)}:
            {Math.floor(pvc.video.duration % 60)
              .toString()
              .padStart(2, "0")}
          </div>
        )}
      </div>

      {/* Metadata Section */}
      <CardContent className="px-2 pb-2 sm:py-2 space-y-1 w-full">
        <h3 className="font-semibold text-sm sm:text-base tracking-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
          {pvc.video.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-1 leading-normal">
          {pvc.video.description || "No description provided."}
        </p>

        {/* Details & Monetization Badges */}
        <div
          className={cn(
            "flex flex-col space-y-2 text-xs text-muted-foreground pt-1",
          )}
        >
          {pvc.createdAt && (
            <span className="text-[12px]">
              {" "}
              {pvc.accessType} On : {formatTimeAgo(pvc.createdAt)}
            </span>
          )}
          {pvc.expiresAt && (
            <span className="text-[12px]">
              {" "}
              {formatVideoExpiry(pvc.expiresAt)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseVideoCard;
