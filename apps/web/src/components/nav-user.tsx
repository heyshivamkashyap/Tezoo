"use client";

import { LogOutConfirm } from "@/app/(auth)/_components/log-out-confirm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/features/user/user.types";
import {
  IconSelector,
  IconHome,
  IconBell,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="size-7">
                  {user.profileImage?.url ? (
                    <AvatarImage
                      src={user.profileImage.url}
                      alt="Profile image"
                    />
                  ) : (
                    <AvatarFallback className="capitalize">
                      {user.fullName[0] || user.email[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <IconSelector className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-fit"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-7">
                    {user.profileImage?.url ? (
                      <AvatarImage
                        src={user.profileImage.url}
                        alt="Profile image"
                      />
                    ) : (
                      <AvatarFallback className="capitalize">
                        {user.fullName[0] || user.email[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.fullName}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <IconHome />
                    Tezoo Home Page
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconBell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsOpen(!isOpen)}>
                <IconLogout />
                <span className="text-destructive hover:text-destructive">
                  Log out
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <LogOutConfirm open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
