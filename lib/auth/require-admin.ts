import "server-only";

import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/auth/admin-auth-server";

export async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(`${ADMIN_SESSION_COOKIE}=`))?.slice(ADMIN_SESSION_COOKIE.length + 1);
  return token ? verifyAdminSession(token) : null;
}
