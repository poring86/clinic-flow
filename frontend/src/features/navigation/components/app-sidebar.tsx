"use client";

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Sidebar
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`min-h-screen ${collapsed ? "w-20" : "w-64"} border-r border-[#27336f] text-white shadow-2xl transition-[width] duration-500 ease-linear [&_[data-slot=sidebar-inner]]:!bg-[linear-gradient(180deg,#0f172a_0%,#172554_52%,#4f46e5_100%)] [&_[data-slot=sidebar-inner]]:text-white [&_[data-slot=sidebar-inner]]:border-r [&_[data-slot=sidebar-inner]]:border-[#27336f]`}
      style={{ boxShadow: "0 0 24px 0 #25306f66" }}
    >
      <SidebarHeader className="flex items-center justify-center border-b border-white/10 bg-transparent py-6">
        <Link
          href="/dashboard"
          className="flex w-full items-center justify-start overflow-hidden px-4 transition-all duration-500 ease-linear"
        >
          <Image
            src="/clic-flow-mark.svg"
            alt="Clic Flow"
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
            style={{ objectFit: "contain" }}
          />
          <span
            className={`origin-left whitespace-nowrap pl-3 text-[18px] font-light tracking-[0.18em] text-white will-change-[max-width,opacity] transition-[max-width,opacity] duration-500 ease-linear ${collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"}`}
          >
            CLIC FLOW
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 px-2 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className={`mb-2 text-[10px] uppercase tracking-[0.34em] text-white/55 transition-all duration-500 ease-linear ${collapsed ? "pl-0 text-center" : "pl-2"}`}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appSidebarViewModel.primaryItems.map((item) => {
                const active = appSidebarViewModel.isActive(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`rounded-xl px-3 py-3 text-[12px] font-light tracking-[0.08em] transition-all duration-500 ease-linear ${active ? "bg-[#1c2758] shadow-[inset_3px_0_0_0_#38bdf8,0_8px_24px_rgba(0,0,0,0.2)]" : "hover:bg-white/10"}`}
                    >
                      <Link href={item.url} className="grid w-full grid-cols-[24px_minmax(0,1fr)] items-center gap-3">
                        <item.icon className={`h-6 w-6 shrink-0 ${active ? "text-[#38bdf8]" : "text-white/80"}`} />
                        <span
                          className={`overflow-hidden whitespace-nowrap will-change-[max-width,opacity] transition-[max-width,opacity] duration-500 ease-linear ${collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"}`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className={`mb-2 text-[10px] uppercase tracking-[0.34em] text-white/55 transition-all duration-500 ease-linear ${collapsed ? "pl-0 text-center" : "pl-2"}`}>
            Outros
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appSidebarViewModel.secondaryItems.map((item) => {
                const active = appSidebarViewModel.isActive(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`rounded-xl px-3 py-3 text-[12px] font-light tracking-[0.08em] transition-all duration-500 ease-linear ${active ? "bg-[#1c2758] shadow-[inset_3px_0_0_0_#38bdf8,0_8px_24px_rgba(0,0,0,0.2)]" : "hover:bg-white/10"}`}
                    >
                      <Link href={item.url} className="grid w-full grid-cols-[24px_minmax(0,1fr)] items-center gap-3">
                        <item.icon className={`h-6 w-6 shrink-0 ${active ? "text-[#38bdf8]" : "text-white/80"}`} />
                        <span
                          className={`overflow-hidden whitespace-nowrap will-change-[max-width,opacity] transition-[max-width,opacity] duration-500 ease-linear ${collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"}`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-all duration-500 ease-linear hover:bg-white/10 ${collapsed ? "justify-center" : ""}`}
                >
                  <Avatar className="h-12 w-12 border border-white/10">
                    <AvatarFallback className="bg-[#1c2758] text-xl text-white">
                      {appSidebarViewModel.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex min-w-0 flex-col overflow-hidden will-change-[max-width,opacity] transition-[max-width,opacity] duration-500 ease-linear ${collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100"}`}
                  >
                    <p className="truncate text-[12px] font-light tracking-[0.08em]">{appSidebarViewModel.clinicStatusLabel}</p>
                    <p className="truncate text-[11px] text-white/75">{appSidebarViewModel.userEmail}</p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border border-white/10 bg-[#20243a] text-white shadow-lg">
                <DropdownMenuItem
                  onClick={appSidebarViewModel.handleSignOut}
                  className="flex cursor-pointer items-center gap-2 text-[#ff7b7b] focus:bg-white/10 focus:text-white"
                >
                  <LogOut />
                  {!collapsed && "Sair"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
