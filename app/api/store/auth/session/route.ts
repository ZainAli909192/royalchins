import { NextResponse } from "next/server";

import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ customer: null }, { status: 401 });
  const customer = await prisma.customer.findUnique({ where: { id: session.sub }, include: { addresses: { orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] } } });
  if (!customer || !customer.isActive) return NextResponse.json({ customer: null }, { status: 401 });
  return NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone, addresses: customer.addresses } });
}
