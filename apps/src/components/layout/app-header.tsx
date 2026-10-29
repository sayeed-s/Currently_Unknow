"use client";

import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import WalletBalanceCard from "@/features/wallet/components/WalletbalanceCard";
import { usePathname } from "next/navigation";

const AppHeader = () => {
  const pathname = usePathname();
  return (
    <header className="w-full flex items-center mb-2 justify-between h-18 py-2 px-4 shadow-lg shadow-white">
      <SidebarTrigger />
      {pathname.includes("wallet") ? "" : <WalletBalanceCard type="Badge" />}
    </header>
  );
};

export default AppHeader;
