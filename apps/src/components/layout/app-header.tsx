"use client";

import React from "react";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import WalletBalanceCard from "@/features/wallet/components/WalletbalanceCard";
import { usePathname } from "next/navigation";

const AppHeader = () => {
  const pathname = usePathname();
  const { state, isMobile, toggleSidebar } = useSidebar();
  return (
    <header className="w-full flex items-center mb-2 justify-between md:justify-end h-18 py-2 px-4 shadow-lg shadow-white">
      <div className="flex items-center gap-4">
        {state == "collapsed" && isMobile && (
          <img
            src={"/vercel.svg"}
            alt="platform image"
            onClick={toggleSidebar}
            className="size-6"
            width={"auto"}
            height={"auto"}
          />
        )}
        <p className="font-bold capitalize text-xl">
          {pathname.split("/")[1]}{" "}
        </p>
      </div>
      {pathname.includes("wallet") ? "" : <WalletBalanceCard type="Badge" />}
    </header>
  );
};

export default AppHeader;
