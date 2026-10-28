"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HomeIcon, SearchIcon, TvMinimalIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import UserDropDown from "./userDropdown";

const menuItems = [
  {
    title: "Entertainment",
    items: [
      {
        title: "Home",
        icon: HomeIcon,
        url: "/home",
      },
      {
        title: "Channels",
        icon: TvMinimalIcon,
        url: "/channel",
      },
      {
        title: "Search",
        icon: SearchIcon,
        url: "/search",
      },
    ],
  },
];

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href="/" prefetch>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src="/vercel.svg"
                    alt="VST Logo"
                    width={24}
                    height={24}
                    className="invert dark:invert-0"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VST</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Media Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Main Content */}
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                      tooltip={item.title}
                      asChild
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {/* Footer / User Dropdown */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserDropDown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
