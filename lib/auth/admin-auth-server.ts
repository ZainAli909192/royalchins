import "server-only";

import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import { SignJWT, jwtVerify } from "jose";
import path from "path";

type AdminRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  resetTokenHash?: string;
  resetTokenExpiresAt?: string;
};

const storePath = path.join(process.cwd(), "data", "admin-auth.json");
export const ADMIN_SESSION_COOKIE = "royalchins_admin_session";

function secretKey() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET must be configured.");
  return new TextEncoder().encode(secret);
}

async function readAdmin(): Promise<AdminRecord> {
  try {
    return JSON.parse(await readFile(storePath, "utf8")) as AdminRecord;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured.");
    const admin: AdminRecord = { id: "admin", name: process.env.ADMIN_NAME ?? "Administrator", email: email.trim().toLowerCase(), passwordHash: await hash(password, 12) };
    await saveAdmin(admin);
    return admin;
  }
}

async function saveAdmin(admin: AdminRecord) {
  await mkdir(path.dirname(storePath), { recursive: true });
  const temporaryPath = `${storePath}.${randomBytes(6).toString("hex")}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(admin), { encoding: "utf8", mode: 0o600 });
  await rename(temporaryPath, storePath);
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
  admin.resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await saveAdmin(admin);
  return token;
}

export async function completePasswordReset(token: string, password: string) {
  const admin = await readAdmin();
  const hashOfToken = createHash("sha256").update(token).digest("hex");
  const isValid = admin.resetTokenHash === hashOfToken && admin.resetTokenExpiresAt && Date.parse(admin.resetTokenExpiresAt) > Date.now();
  if (!isValid) return false;
  admin.passwordHash = await hash(password, 12);
  delete admin.resetTokenHash;
  delete admin.resetTokenExpiresAt;
  await saveAdmin(admin);
  return true;
}
