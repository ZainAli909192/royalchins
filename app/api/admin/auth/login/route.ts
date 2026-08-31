import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, authenticateAdmin, createAdminSession } from "@/lib/auth/admin-auth-server";
import { adminLoginSchema } from "@/lib/validations/admin-login";

export async function POST(request: Request) {
  const parsed = adminLoginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please enter a valid email address and password." }, { status: 400 });
  const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);
  if (!admin) return NextResponse.json({ message: "Invalid email address or password." }, { status: 401 });
  const { token, maxAge } = await createAdminSession(admin, parsed.data.rememberMe);
  const response = NextResponse.json({ user: { id: admin.id, name: admin.name, email: admin.email, role: "admin" } });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
  return response;
}
