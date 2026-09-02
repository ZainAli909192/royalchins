import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyPasswordResetOtp } from "@/lib/auth/password-reset";

const schema = z.object({
  email: z.string().trim().email(),
  otp: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit code."),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ message: "Enter the email address and six-digit code." }, { status: 400 });
  }

  const verified = await verifyPasswordResetOtp({ ...parsed.data, accountType: "admin" });
  return verified
    ? NextResponse.json({ message: "Code verified. Choose your new password." })
    : NextResponse.json({ message: "This code is invalid or has expired. Request a new code and try again." }, { status: 400 });
}
