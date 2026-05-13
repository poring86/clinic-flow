"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleExpand = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }

    setCollapsed(false);
  };

  const handleCollapse = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }

    collapseTimeoutRef.current = setTimeout(() => {
      setCollapsed(true);
      collapseTimeoutRef.current = null;
    }, 180);
  };

  return (
    <Sidebar
      variant="floating"
      onMouseEnter={handleExpand}
      onMouseLeave={handleCollapse}
      className={`${collapsed ? "w-24" : "w-64"} text-white shadow-2xl transition-[width] duration-300 ease-out motion-reduce:transition-none [&_[data-slot=sidebar-inner]]:!bg-[linear-gradient(180deg,#3490ff_0%,#3b82f6_44%,#4f66ee_78%,#5d56df_100%)] [&_[data-slot=sidebar-inner]]:text-white [&_[data-slot=sidebar-inner]]:rounded-[22px] [&_[data-slot=sidebar-inner]]:border [&_[data-slot=sidebar-inner]]:border-[#7d92e5]`}
      style={{ boxShadow: "0 18px 42px -14px #142a6f8a" }}
    >
      <SidebarHeader className="flex items-center justify-center border-b border-white/20 bg-transparent py-6">
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
            className={`origin-left whitespace-nowrap pl-3 text-[18px] font-light tracking-[0.18em] text-white will-change-[max-width,opacity] transition-[max-width,opacity] duration-300 ease-out ${collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"}`}
          >
            CLIC FLOW
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-x-hidden px-2 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className={`mb-2 pl-3 text-left text-[10px] uppercase tracking-[0.34em] text-white/55 transition-[opacity] duration-300 ease-linear ${collapsed ? "opacity-0" : "opacity-100"}`}>
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
                      className={`h-11 justify-start rounded-xl px-2.5 py-2 text-[12px] font-medium tracking-[0.06em] transition-all duration-500 ease-linear ${active ? "border border-[#2a3c85]/85 bg-gradient-to-r from-[#213474] to-[#314a9f] text-[#f5f8ff] shadow-[0_10px_24px_rgba(11,20,56,0.5)]" : "text-[#ecf3ff] hover:bg-[#2f4fa8]/38 hover:text-white"}`}
                    >
                      <Link href={item.url} className="flex w-full min-w-0 items-center justify-start gap-3">
                        <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-[#dce8ff]"}`} />
                        <span
                          className={`block overflow-hidden whitespace-nowrap pt-px text-left leading-[1.1] will-change-[max-width,opacity] transition-[max-width,opacity] duration-300 ease-out ${collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"}`}
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
          <SidebarGroupLabel className={`mb-2 pl-3 text-left text-[10px] uppercase tracking-[0.34em] text-white/55 transition-[opacity] duration-300 ease-linear ${collapsed ? "opacity-0" : "opacity-100"}`}>
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
                      className={`h-11 justify-start rounded-xl px-2.5 py-2 text-[12px] font-medium tracking-[0.06em] transition-all duration-500 ease-linear ${active ? "border border-[#2a3c85]/85 bg-gradient-to-r from-[#213474] to-[#314a9f] text-[#f5f8ff] shadow-[0_10px_24px_rgba(11,20,56,0.5)]" : "text-[#ecf3ff] hover:bg-[#2f4fa8]/38 hover:text-white"}`}
                    >
                      <Link href={item.url} className="flex w-full min-w-0 items-center justify-start gap-3">
                        <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-[#dce8ff]"}`} />
                        <span
                          className={`block overflow-hidden whitespace-nowrap pt-px text-left leading-[1.1] will-change-[max-width,opacity] transition-[max-width,opacity] duration-300 ease-out ${collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"}`}
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

      <SidebarFooter className="border-t border-white/20 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="space-y-2 rounded-2xl border border-white/18 bg-white/8 p-2 transition-all duration-200 ease-linear hover:border-white/28 hover:bg-white/14">
              <div className="grid w-full grid-cols-[40px_minmax(0,1fr)] items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center">
                  <Avatar className="h-10 w-10 border border-white/30 shadow-[0_6px_14px_rgba(8,16,48,0.35)]">
                    <AvatarFallback className="bg-[#142b6a] text-xl text-white">
                      {appSidebarViewModel.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div
                  className={`min-w-0 overflow-hidden will-change-[max-width,opacity] transition-[max-width,opacity] duration-300 ease-out ${collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100"}`}
                >
                  <p className="truncate text-left text-[11px] font-medium tracking-[0.08em] text-white/90">
                    {appSidebarViewModel.clinicStatusLabel}
                  </p>
                  <p className="truncate text-left text-[11px] leading-tight text-[#dbe7ff]">
                    {appSidebarViewModel.userEmail}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={appSidebarViewModel.handleSignOut}
                aria-label="Sign out"
                className="flex h-10 w-full items-center rounded-xl border border-transparent px-2.5 text-sm font-medium text-[#ffd1d1] transition-colors hover:border-white/15 hover:bg-[#ff6b6b]/18 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  <LogOut className="h-4 w-4" />
                </span>
                <span
                  className={`overflow-hidden whitespace-nowrap pl-2 text-left will-change-[max-width,opacity] transition-[max-width,opacity] duration-300 ease-out ${collapsed ? "max-w-0 opacity-0" : "max-w-[120px] opacity-100"}`}
                >
                  Sign out
                </span>
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
