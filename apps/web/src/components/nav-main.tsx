"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface NavMainProps {
  sidebarGroupLabel: string;
  items: NavItem[];
}

export function NavMain({ sidebarGroupLabel, items }: NavMainProps) {
  const pathname = usePathname();

  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const isSectionActive = (item: NavItem) =>
    item.items?.some(
      (subItem) =>
        pathname === subItem.url || pathname.startsWith(`${subItem.url}/`),
    ) ?? false;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="rounded-none border-b text-sm tracking-wide">
        {sidebarGroupLabel}
      </SidebarGroupLabel>
      <SidebarMenu className="mt-2">
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={isSectionActive(item)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon}
                  <span>{item.title}</span>
                  <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem
                      key={subItem.title}
                      onClick={isMobile ? toggleSidebar : undefined}
                    >
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
