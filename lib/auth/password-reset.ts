import "server-only";

import { hash } from "bcryptjs";
import { createHash, randomInt } from "crypto";
import { Resend } from "resend";

import { getAdminAccount } from "@/lib/auth/admin-auth-server";
import { prisma } from "@/lib/prisma";

export type PasswordResetAccountType = "customer" | "admin";

const OTP_LIFETIME_MS = 15 * 60 * 1000;

function hashOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}

async function sendPasswordResetOtp(email: string, otp: string, accountType: PasswordResetAccountType) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email delivery is not configured. Please contact support.");
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Royal Chins <onboarding@resend.dev>";
  const audience = accountType === "admin" ? "admin account" : "customer account";
  const result = await new Resend(apiKey).emails.send({
    from,
    to: email,
    subject: "Your Royal Chins password reset code",
    html: `<p>Use this one-time code to reset your Royal Chins ${audience} password:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>This code expires in 15 minutes. Do not share it with anyone.</p>`,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
}

export async function requestPasswordReset(emailInput: string, accountType: PasswordResetAccountType) {
  const email = emailInput.trim().toLowerCase();
  const account = accountType === "admin"
    ? await getAdminAccount().then((admin) => admin.email === email ? admin : null)
    : await prisma.customer.findUnique({ where: { email } });

  if (!account) return false;

  const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const data = { resetTokenHash: hashOtp(otp), resetTokenExpiresAt: new Date(Date.now() + OTP_LIFETIME_MS) };

  if (accountType === "admin") {
    await prisma.adminAccount.update({ where: { id: account.id }, data });
  } else {
    await prisma.customer.update({ where: { id: account.id }, data });
  }

  await sendPasswordResetOtp(email, otp, accountType);
  return true;
}

export async function verifyPasswordResetOtp(input: { email: string; otp: string; accountType: PasswordResetAccountType }) {
  const email = input.email.trim().toLowerCase();
  const account = input.accountType === "admin"
    ? await getAdminAccount().then((admin) => admin.email === email ? admin : null)
    : await prisma.customer.findUnique({ where: { email } });

  return Boolean(
    account
    && account.resetTokenHash
    && account.resetTokenExpiresAt
    && account.resetTokenExpiresAt.getTime() > Date.now()
    && account.resetTokenHash === hashOtp(input.otp.trim()),
  );
}

export async function resetPasswordWithOtp(input: { email: string; otp: string; password: string; accountType: PasswordResetAccountType }) {
  const email = input.email.trim().toLowerCase();
  const account = input.accountType === "admin"
    ? await getAdminAccount().then((admin) => admin.email === email ? admin : null)
    : await prisma.customer.findUnique({ where: { email } });

  if (!account || !(await verifyPasswordResetOtp(input))) {
    return false;
  }

  const data = { passwordHash: await hash(input.password, 12), resetTokenHash: null, resetTokenExpiresAt: null };
  if (input.accountType === "admin") {
    await prisma.adminAccount.update({ where: { id: account.id }, data });
  } else {
    await prisma.customer.update({ where: { id: account.id }, data });
  }
  return true;
}
