import { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthenticationPage as AuthenticationScreen } from "@/features/authentication";
import { getServerSession } from "@/lib/auth/server-session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Authentication | Clic Flow",
};

const AuthenticationPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return <AuthenticationScreen />;
};

export default AuthenticationPage;
