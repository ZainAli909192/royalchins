import { NextResponse } from "next/server";

import { beginPasswordReset } from "@/lib/auth/admin-auth-server";
import { adminForgotPasswordSchema } from "@/lib/validations/admin-forgot-password";

export async function POST(request: Request) {
  const parsed = adminForgotPasswordSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  const token = await beginPasswordReset(parsed.data.email);
  const response: { message: string; resetUrl?: string } = { message: "If an account exists for that email, a password reset link has been prepared." };
  if (token && process.env.NODE_ENV !== "production") response.resetUrl = `/admin/reset-password?token=${encodeURIComponent(token)}`;
  return NextResponse.json(response);
}
