import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/api-base-url";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${getApiBaseUrl()}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: payload?.message ?? "Failed to register" },
        { status: response.status || 400 },
      );
    }

    return NextResponse.json(payload, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach authentication server" },
      { status: 500 },
    );
  }
}
