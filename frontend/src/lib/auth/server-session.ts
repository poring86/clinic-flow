import "server-only";

import { cookies } from "next/headers";

import { getApiBaseUrl } from "@/lib/api-base-url";

import { SESSION_COOKIE_NAME } from "./constants";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  clinicId: string | null;
}

const getTokenFromCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
};

export const getServerSession = async (): Promise<SessionUser | null> => {
  const token = await getTokenFromCookies();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/auth/session?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as SessionUser;
    return user;
  } catch {
    return null;
  }
};
