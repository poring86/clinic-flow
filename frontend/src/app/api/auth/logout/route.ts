import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/api-base-url";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await fetch(`${getApiBaseUrl()}/auth/session?token=${encodeURIComponent(token)}`, {
        method: "DELETE",
        cache: "no-store",
      });
    } catch {
      // Ignore backend logout failures and still clear local cookie.
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
