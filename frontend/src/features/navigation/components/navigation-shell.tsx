import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";

interface NavigationShellProps {
  children: React.ReactNode;
  session: {
    name?: string | null;
    email?: string | null;
    clinicId?: string | null;
  };
}

export const NavigationShell = ({ children, session }: NavigationShellProps) => {
  return (
    <SidebarProvider>
      <AppSidebar
        userName={session.name}
        userEmail={session.email}
        hasClinic={Boolean(session.clinicId)}
      />

      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};
