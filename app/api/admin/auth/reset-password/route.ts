import { NextResponse } from "next/server";

import { completePasswordReset } from "@/lib/auth/admin-auth-server";
import { adminResetPasswordSchema } from "@/lib/validations/admin-reset-password";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = adminResetPasswordSchema.safeParse(body);
  if (!parsed.success || typeof body?.token !== "string" || !body.token) return NextResponse.json({ message: "The reset link is invalid or incomplete." }, { status: 400 });
  if (!(await completePasswordReset(body.token, parsed.data.password))) return NextResponse.json({ message: "This reset link is invalid or has expired. Please request a new one." }, { status: 400 });
  return NextResponse.json({ message: "Password reset successfully. You can now sign in." });
}
