import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createCustomerSession, CUSTOMER_SESSION_COOKIE } from "@/lib/auth/customer-auth-server";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please enter your email and password." }, { status: 400 });
  const customer = await prisma.customer.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!customer || !customer.passwordHash || !customer.isActive || !(await compare(parsed.data.password, customer.passwordHash))) return NextResponse.json({ message: "Incorrect email or password." }, { status: 401 });
  const session = await createCustomerSession(customer);
  const response = NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
  response.cookies.set(CUSTOMER_SESSION_COOKIE, session.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: session.maxAge });
  return response;
}
