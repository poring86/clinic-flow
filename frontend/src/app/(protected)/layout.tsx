import { redirect } from "next/navigation";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "@/lib/auth/server-session";

import { AppSidebar } from "./_components/app-sidebar";

const ProtectedLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/authentication");
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full">
        <SidebarTrigger />

        {children}
      </main>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
