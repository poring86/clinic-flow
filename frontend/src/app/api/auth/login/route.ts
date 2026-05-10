import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/api-base-url";
import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "@/lib/auth/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload?.token) {
      return NextResponse.json(
        { message: payload?.message ?? "Invalid credentials" },
        { status: response.status || 401 },
      );
    }

    const nextResponse = NextResponse.json({ user: payload.user });
    nextResponse.cookies.set(SESSION_COOKIE_NAME, payload.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: "Unable to reach authentication server" },
      { status: 500 },
    );
  }
}
