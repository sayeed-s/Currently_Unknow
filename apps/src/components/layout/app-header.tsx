// src/components/layout/AppHeader.tsx
"use client";

import React from "react";
import Image from "next/image";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import WalletBalanceCard from "@/features/wallet/components/WalletbalanceCard";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export const AppHeader = () => {
  const pathname = usePathname();
  const { state, isMobile, toggleSidebar } = useSidebar();

  // Extract and format route title cleanly (e.g., "studio-dashboard" -> "Studio Dashboard")
  const rawRouteName = pathname.split("/")[1] || "overview";
  const formattedTitle = rawRouteName.replace(/-/g, " ");

  const isWalletPage = pathname.includes("wallet");

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between h-16 px-4 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all">
      {/* Left Section: Sidebar Trigger & Dynamic Page Title */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle Trigger or Custom Brand Trigger */}
        {state === "collapsed" ||
          (isMobile && (
            <Button
              variant={"link"}
              onClick={toggleSidebar}
              className="relative size-7 overflow-hidden rounded-lg focus:outline-none cursor-pointer"
            >
              <Image
                src="/vercel.svg"
                alt="Platform Logo"
                fill
                className="object-contain"
              />
            </Button>
          ))}

        <div className="flex items-center gap-2">
          <span className="h-4 w-px bg-border/60 hidden sm:inline-block" />
          <h1 className="font-semibold capitalize text-base sm:text-lg tracking-tight text-foreground">
            {formattedTitle === "channel"
              ? "Discover Channels"
              : formattedTitle}
          </h1>
        </div>
      </div>

      {/* Right Section: Wallet Balance & Quick Actions */}
      <div className="flex items-center gap-3">
        {!isWalletPage && (
          <div className="transition-transform duration-200 hover:scale-[1.02]">
            <WalletBalanceCard type="Badge" />
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
