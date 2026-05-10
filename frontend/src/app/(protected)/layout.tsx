import { redirect } from "next/navigation";

import { NavigationShell } from "@/features/navigation";
import { getServerSession } from "@/lib/auth/server-session";

export const dynamic = "force-dynamic";

const ProtectedLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/authentication");
  }

  return <NavigationShell session={session}>{children}</NavigationShell>;
};

export default ProtectedLayout;
