import { NextResponse } from "next/server";
import { z } from "zod";

import { resetPasswordWithOtp } from "@/lib/auth/password-reset";

const schema = z.object({ email: z.string().trim().email(), otp: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit code."), password: z.string().min(8), passwordConfirmation: z.string() }).refine((data) => data.password === data.passwordConfirmation, { path: ["passwordConfirmation"], message: "Passwords do not match." });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please enter a valid email, code, and password." }, { status: 400 });
  const changed = await resetPasswordWithOtp({ ...parsed.data, accountType: "customer" });
  return changed ? NextResponse.json({ message: "Password reset successfully. You can now sign in." }) : NextResponse.json({ message: "This code is invalid or has expired. Request a new code and try again." }, { status: 400 });
}
