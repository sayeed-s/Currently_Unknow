"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Edit3,
  MoreVertical,
  Globe,
  EyeOff,
  Sparkles,
  ShoppingBag,
  CoinsIcon,
  HandCoinsIcon,
} from "lucide-react";
import { formatDate } from "@/lib/dateFormated";
import { StudioVideoProps } from "../studio.type";

interface StudioVideosProps {
  video: StudioVideoProps;
  onAnalyticsClick?: (videoId: string) => void;
  onEditClick?: (videoId: string) => void;
}

export const StudioVideos: React.FC<StudioVideosProps> = ({
  video,
  onAnalyticsClick,
  onEditClick,
}) => {
  const formattedRent = Number(video.rentPrice || 0).toFixed(2);
  const formattedBuy = video.buyPrice
    ? Number(video.buyPrice).toFixed(2)
    : null;
  const totalEarnings = Number(video.totalEarnings || 0).toFixed(2);

  return (
    <Card className="overflow-hidden pb-0 pt-3 border border-border/60 hover:border-border bg-card/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md group rounded-2xl">
      <CardContent className="px-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Thumbnail Container with Badges */}
          <div className="relative w-full sm:w-52 md:w-60 aspect-video rounded-xl overflow-hidden shrink-0 bg-muted/40 border border-border/40">
            <Image
              src={video.thumbnailUrl || "/placeholder-thumbnail.png"}
              alt={video.title}
              fill
              sizes="(max-width: 640px) 100vw, 240px"
              draggable={false}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Status Badges Overlay */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
              {video.isPublished ? (
                <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-none text-[10px] px-2 py-0.5 backdrop-blur-md flex items-center gap-1 shadow-sm">
                  <Globe className="w-3 h-3" /> Published
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-amber-500/90 text-white border-none text-[10px] px-2 py-0.5 backdrop-blur-md flex items-center gap-1 shadow-sm"
                >
                  <EyeOff className="w-3 h-3" /> Draft
                </Badge>
              )}

              {video.isIntro && (
                <Badge className="bg-indigo-600/90 hover:bg-indigo-600 text-white border-none text-[10px] px-2 py-0.5 backdrop-blur-md flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" /> Intro
                </Badge>
              )}
            </div>
          </div>

          {/* Details & Info Section */}
          <div className="flex-1 min-w-0 space-y-2.5 w-full">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-base sm:text-lg tracking-tight line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                {video.title}
              </h3>

              {/* Action Options Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-lg"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                  <DropdownMenuItem
                    onClick={() => onEditClick?.(video.id)}
                    className="cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onAnalyticsClick?.(video.id)}
                    className="cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" /> View Analytics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {video.description || "No description provided."}
            </p>

            {/* Pricing Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <HandCoinsIcon className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1">
                  Rent: <CoinsIcon className="size-4 text-[#C6A15B]" />{" "}
                  {formattedRent}
                </span>
              </div>

              {formattedBuy && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="flex items-center gap-1">
                    Buy: <CoinsIcon className="size-4 text-[#C6A15B]" />
                    {formattedBuy}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer Stats Strip */}
      <div className="border-t border-border/40 bg-muted/20 px-4 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        {/* Date & Performance Metrics */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span>
              Hosted:{" "}
              <strong className="font-medium text-foreground">
                {formatDate(video.createdAt)}
              </strong>
            </span>
          </div>

          {video.totalPurchases !== undefined && (
            <div className="hidden sm:flex items-center gap-1.5">
              <span>
                Sales:{" "}
                <strong className="font-medium text-foreground">
                  {video.totalPurchases}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Total Video Revenue & Action Button */}
        <div className="flex items-center gap-3 ml-auto">
          {video.totalEarnings !== undefined && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              ${totalEarnings} Total Revenue
            </span>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAnalyticsClick?.(video.id)}
            className="h-7 text-xs px-3 rounded-lg flex items-center gap-1.5 font-medium shadow-none"
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StudioVideos;
