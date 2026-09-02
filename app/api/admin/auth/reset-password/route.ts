import { NextResponse } from "next/server";

import { z } from "zod";
import { resetPasswordWithOtp } from "@/lib/auth/password-reset";

const schema = z.object({ email: z.string().trim().email(), otp: z.string().trim().regex(/^\d{6}$/), password: z.string().min(8), passwordConfirmation: z.string() }).refine((data) => data.password === data.passwordConfirmation, { path: ["passwordConfirmation"], message: "Passwords do not match." });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Please enter a valid email, code, and password." }, { status: 400 });
  if (!(await resetPasswordWithOtp({ ...parsed.data, accountType: "admin" }))) return NextResponse.json({ message: "This code is invalid or has expired. Please request a new code and try again." }, { status: 400 });
  return NextResponse.json({ message: "Password reset successfully. You can now sign in." });
}
