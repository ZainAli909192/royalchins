import "server-only";

import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { SignJWT, jwtVerify } from "jose";

import { prisma } from "@/lib/prisma";

type AdminRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  adminEmail: string;
  resetTokenHash?: string | null;
  resetTokenExpiresAt?: Date | null;
};

export const ADMIN_SESSION_COOKIE = "royalchins_admin_session";

function secretKey() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET must be configured.");
  return new TextEncoder().encode(secret);
}

async function readAdmin(): Promise<AdminRecord> {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured.");

  const existing = await prisma.adminAccount.findUnique({ where: { email: configuredEmail } });
  if (existing) return existing;

  return prisma.adminAccount.create({
    data: {
      name: process.env.ADMIN_NAME?.trim() || "Administrator",
      email: configuredEmail,
      passwordHash: await hash(configuredPassword, 12),
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL?.trim().toLowerCase() || configuredEmail,
    },
  });
}

export async function getAdminNotificationEmail() {
  return (await readAdmin()).adminEmail;
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await readAdmin();
  if (admin.email !== email.trim().toLowerCase() || !(await compare(password, admin.passwordHash))) return null;
  return admin;
}

export async function createAdminSession(admin: AdminRecord, rememberMe: boolean) {
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
  const token = await new SignJWT({ name: admin.name, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(secretKey());
  return { token, maxAge };
}

export async function verifyAdminSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin" && typeof payload.sub === "string" ? payload : null;
  } catch { return null; }
}

export async function beginPasswordReset(email: string) {
  const admin = await readAdmin();
  if (admin.email !== email.trim().toLowerCase()) return null;
  const token = randomBytes(32).toString("base64url");
  admin.resetTokenHash = createHash("sha256").update(token).digest("hex");
  admin.resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.adminAccount.update({ where: { id: admin.id }, data: { resetTokenHash: admin.resetTokenHash, resetTokenExpiresAt: admin.resetTokenExpiresAt } });
  return token;
}

export async function completePasswordReset(token: string, password: string) {
  const admin = await readAdmin();
  const hashOfToken = createHash("sha256").update(token).digest("hex");
  const isValid = admin.resetTokenHash === hashOfToken && admin.resetTokenExpiresAt && admin.resetTokenExpiresAt.getTime() > Date.now();
  if (!isValid) return false;
  await prisma.adminAccount.update({ where: { id: admin.id }, data: { passwordHash: await hash(password, 12), resetTokenHash: null, resetTokenExpiresAt: null } });
  return true;
}
