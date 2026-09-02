import { NextResponse } from "next/server";

import { requestPasswordReset } from "@/lib/auth/password-reset";
import { adminForgotPasswordSchema } from "@/lib/validations/admin-forgot-password";

export async function POST(request: Request) {
  const parsed = adminForgotPasswordSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  try {
    const sent = await requestPasswordReset(parsed.data.email, "admin");
    if (!sent) {
      return NextResponse.json({ message: "Please enter the registered admin email address." }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin password reset email failed:", error);
    return NextResponse.json({ message: "We could not send the reset code. Please try again." }, { status: 503 });
  }
  return NextResponse.json({ message: "A six-digit reset code has been sent to the admin email address." });
}
