"use client";

import {
  CalendarDays,
  Gem,
  LayoutDashboard,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseAppSidebarViewModelParams {
  userName?: string | null;
  userEmail?: string | null;
  hasClinic?: boolean;
}

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const primaryItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: CalendarDays,
  },
  {
    title: "Doctors",
    url: "/doctors",
    icon: Stethoscope,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: UsersRound,
  },
];

const secondaryItems: SidebarItem[] = [
  {
    title: "Subscription",
    url: "/subscription",
    icon: Gem,
  },
];

const getInitials = (value?: string | null) => {
  if (!value) {
    return "U";
  }

  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const useAppSidebarViewModel = ({
  userName,
  userEmail,
  hasClinic = false,
}: UseAppSidebarViewModelParams) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.refresh();
      router.replace("/authentication");
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  return {
    primaryItems,
    secondaryItems,
    isActive: (url: string) => pathname === url,
    handleSignOut,
    initials: getInitials(userName),
    userEmail: userEmail || "email@example.com",
    clinicStatusLabel: hasClinic ? "Clinic configured" : "No clinic assigned",
  };
};
