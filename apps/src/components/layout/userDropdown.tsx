"use client";

import React from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserDropDown = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isMobile } = useSidebar();

  const userActions = [
    {
      title: "Profile",
      icon: UserIcon,
      url: "/profile",
    },
    {
      title: "Settings",
      icon: SettingsIcon,
      url: "/settigns",
    },
  ];


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          tooltip={user?.fullName || "Account"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200"
        >
          <Avatar className={"transition-all duration-200 size-7"}>
            <AvatarImage
              src={user?.imageUrl}
              alt={user?.fullName || "User Avatar"}
            />
            <AvatarFallback className="text-xs">
              {user?.firstName ? user.firstName[0] : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {user?.fullName || user?.firstName || "User Profile"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </span>
          </div>
          <ChevronsUpDownIcon className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.fullName || "User Avatar"}
              />
              <AvatarFallback className="rounded-lg text-xs">
                {user?.firstName ? user.firstName[0] : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {user?.fullName || user?.firstName || "User Profile"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress || ""}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {userActions.map((act) => (
            <DropdownMenuItem key={act.title} asChild>
              <Link
                href={act.url}
                className="cursor-pointer flex items-center gap-2"
              >
                <act.icon className="size-4" />
                <span>{act.title}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2"
        >
          <LogOutIcon className="size-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
