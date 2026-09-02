import { NextResponse } from "next/server";

import { CUSTOMER_SESSION_COOKIE } from "@/lib/auth/customer-auth-server";

export async function POST(request: Request) {
  const response = NextResponse.json({ message: "You have been logged out." });
  response.cookies.set(CUSTOMER_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: 0,
  });
  return response;
}
