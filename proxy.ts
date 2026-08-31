import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const cookieName = "royalchins_admin_session";
const protectedAdminPath = /^\/admin\/(?!login(?:\/|$)|forgot-password(?:\/|$)|reset-password(?:\/|$))/;

export async function proxy(request: NextRequest) {
  if (!protectedAdminPath.test(request.nextUrl.pathname)) return NextResponse.next();
  const token = request.cookies.get(cookieName)?.value;
  const secret = process.env.NEXTAUTH_SECRET;
  if (!token || !secret) return redirectToLogin(request);
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.role === "admin") return NextResponse.next();
  } catch {}
  return redirectToLogin(request);
}

function redirectToLogin(request: NextRequest) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
