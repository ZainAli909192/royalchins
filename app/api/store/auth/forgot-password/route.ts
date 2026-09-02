import { NextResponse } from "next/server";
import { z } from "zod";

import { requestPasswordReset } from "@/lib/auth/password-reset";

const schema = z.object({ email: z.string().trim().email() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  try {
    const sent = await requestPasswordReset(parsed.data.email, "customer");
    if (!sent) {
      return NextResponse.json({ message: "We could not find a customer account with that email address." }, { status: 404 });
    }
  } catch (error) {
    console.error("Customer password reset email failed:", error);
    return NextResponse.json({ message: "We could not send the reset code. Please try again." }, { status: 503 });
  }
  return NextResponse.json({ message: "A six-digit reset code has been sent to your email address." });
}
