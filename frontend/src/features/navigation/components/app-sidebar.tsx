"use client";

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import { useAppSidebarViewModel } from "@/features/navigation/hooks";

interface AppSidebarProps {
  userName?: string | null;
  userEmail?: string | null;
  hasClinic?: boolean;
}

export const AppSidebar = ({ userName, userEmail, hasClinic }: AppSidebarProps) => {
  const appSidebarViewModel = useAppSidebarViewModel({
    userName,
    userEmail,
    hasClinic,
  });

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Image
          src="/clic-flow-logo.svg"
          alt="Clic Flow Logo"
          width={136.52}
          height={27.79}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appSidebarViewModel.primaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={appSidebarViewModel.isActive(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appSidebarViewModel.secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={appSidebarViewModel.isActive(item.url)}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar>
                    <AvatarFallback>{appSidebarViewModel.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{appSidebarViewModel.clinicStatusLabel}</p>
                    <p className="text-muted-foreground text-sm">
                      {appSidebarViewModel.userEmail}
                    </p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={appSidebarViewModel.handleSignOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
