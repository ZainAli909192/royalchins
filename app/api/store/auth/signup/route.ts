import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createCustomerSession, CUSTOMER_SESSION_COOKIE } from "@/lib/auth/customer-auth-server";
import { prisma } from "@/lib/prisma";

const schema = z.object({ name: z.string().trim().min(2), email: z.string().trim().email(), password: z.string().min(8), phone: z.string().trim().min(5).optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please enter a name, valid email, and password of at least 8 characters." }, { status: 400 });
  const input = parsed.data;
  const email = input.email.toLowerCase();
  if (await prisma.customer.findUnique({ where: { email } })) return NextResponse.json({ message: "An account with this email already exists. Please sign in." }, { status: 409 });
  const customer = await prisma.customer.create({ data: { name: input.name, email, phone: input.phone ?? "", passwordHash: await hash(input.password, 12) } });
  const session = await createCustomerSession(customer);
  const response = NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } }, { status: 201 });
  response.cookies.set(CUSTOMER_SESSION_COOKIE, session.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: session.maxAge });
  return response;
}
