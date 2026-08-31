import "server-only";

import { SignJWT, jwtVerify } from "jose";

export const CUSTOMER_SESSION_COOKIE = "royalchins_customer_session";

function secretKey() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET must be configured.");
  return new TextEncoder().encode(secret);
}

export async function createCustomerSession(customer: { id: string; name: string; email: string }) {
  const maxAge = 60 * 60 * 24 * 30;
  const token = await new SignJWT({ name: customer.name, email: customer.email, role: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(customer.id)
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(secretKey());
  return { token, maxAge };
}

export async function verifyCustomerSession(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "customer" && typeof payload.sub === "string" ? payload : null;
  } catch {
    return null;
  }
}
