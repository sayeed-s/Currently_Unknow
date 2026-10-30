import AppHeader from "@/components/layout/app-header";
import AppSidebar from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          {children}
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default layout;
