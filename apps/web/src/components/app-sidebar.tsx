"use client";

import * as React from "react";
import { NavItem, NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/lib/redux/hooks";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navMainItems: NavItem[];
}

export function AppSidebar({ navMainItems, ...props }: AppSidebarProps) {
  const { user } = useAppSelector((state) => state.user);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain sidebarGroupLabel="Tezoo Admin Panel" items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
