"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  HomeIcon,
  KeyboardMusicIcon,
  PlusIcon,
  SearchIcon,
  TvMinimalIcon,
  WalletMinimalIcon,
} from "lucide-react";

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
  const { user, isLoaded } = useUser();

  const isCreator = user?.publicMetadata?.role === "CREATOR";

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
              <Link href="/home" prefetch>
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
        <SidebarMenu className="space-y-4">
          {/* Show Studio ONLY if data is loaded AND user is a creator */}
          {isLoaded && isCreator && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={"Studio"}
                isActive={pathname.includes("/studio")}
                asChild
              >
                <Link href={"/studio"} prefetch>
                  <KeyboardMusicIcon className="size-4" />
                  <span className="font-medium">Studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Wallet"}
              isActive={pathname.includes("/wallet")}
              asChild
            >
              <Link href={"/wallet"} prefetch>
                <WalletMinimalIcon className="size-4" />
                <span className="font-medium">Wallet</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Show "Be a Creator" ONLY if data is loaded AND user is NOT a creator */}
          {isLoaded && !isCreator && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={"Become a Creator"}
                isActive={pathname.includes("/creator")}
                asChild
              >
                <Link href={"/creator"} prefetch>
                  <PlusIcon className="size-4" />
                  <span className="font-medium">Launch Studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <UserDropDown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
