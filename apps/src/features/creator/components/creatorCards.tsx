"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CreatorCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample creator/card items
  const items = [
    {
      id: 1,
      tag: "Exclusive Platform",
      title: "Share Your Craft",
      description:
        "Transform your exclusive video content into a high-end digital storefront built for dedicated audiences.",
      bg: "bg-gradient-to-br from-neutral-900 via-neutral-950 to-zinc-900 text-white",
      accent: "text-[#C6A15B]",
    },
    {
      id: 2,
      tag: "Instant Payouts",
      title: "Flexible Monetization",
      description:
        "Choose between pay-per-view rentals or lifetime purchases. Watch your creator earnings deposit instantly into your secure wallet.",
      bg: "bg-gradient-to-br from-zinc-900 via-stone-950 to-neutral-900 text-white",
      accent: "text-amber-500",
    },
    {
      id: 3,
      tag: "Ultra-Secure",
      title: "Premium Streaming",
      description:
        "Deliver crystal-clear video playback backed by state-of-the-art protection and lightning-fast delivery.",
      bg: "bg-gradient-to-br from-neutral-950 via-zinc-900 to-black text-white",
      accent: "text-yellow-500",
    },
    {
      id: 4,
      tag: "Join Today",
      title: "Become a Creator",
      description:
        "Launch your studio in minutes. Take full control of your brand, your pricing, and your audience.",
      bg: "bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-900 text-white",
      accent: "text-emerald-500",
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center space-y-8 py-6">
      {/* Custom Stack Container */}
      <div className="relative w-full h-100 flex items-center justify-center">
        {items.map((item, index) => {
          // Calculate relative distance from the current active index
          const offset = (index - currentIndex + items.length) % items.length;
          const isActive = offset === 0;

          return (
            <div
              key={item.id}
              onClick={isActive ? handleNext : undefined}
              className={cn(
                "absolute w-72 h-100 rounded-2xl p-6 shadow-2xl border border-neutral-800/80 flex flex-col justify-between transition-all duration-500 ease-out select-none",
                item.bg,
                isActive
                  ? "cursor-pointer hover:scale-[1.02]"
                  : "cursor-default",
              )}
              style={{
                // Stack cards on top of each other based on position
                zIndex: items.length - offset,
                transform: isActive
                  ? "translateY(0px) scale(1) rotate(0deg)"
                  : `translateY(${offset * 18}px) scale(${1 - offset * 0.05}) rotate(${offset * 2}deg)`,
                opacity: offset > 2 ? 0 : 1 - offset * 0.25,
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              {/* Card Top Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">
                  0{item.id} / 0{items.length}
                </span>
                <span className={`text-xs font-semibold ${item.accent}`}>
                  Featured
                </span>
              </div>

              {/* Card Body */}
              <div className="space-y-2 my-auto">
                <h3 className="text-2xl font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400 font-medium">{item.tag}</p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                <span>VST Media Platform</span>
                <span className="font-mono">Active Deck</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {/* <div className="flex items-center space-x-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="rounded-full h-10 w-10 border-neutral-800 hover:bg-zinc-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground font-mono">
          {currentIndex + 1} of {items.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="rounded-full h-10 w-10 border-neutral-800 hover:bg-zinc-800"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div> */}
    </div>
  );
};

export default CreatorCards;
