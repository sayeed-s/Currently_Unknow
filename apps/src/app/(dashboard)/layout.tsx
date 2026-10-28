import AppSidebar from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset className="bg-primary/10">{children}</SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default layout;
