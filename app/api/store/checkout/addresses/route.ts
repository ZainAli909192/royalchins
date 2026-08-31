import { NextResponse } from "next/server";
import { z } from "zod";

import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

const schema = z.object({ label: z.string().trim().min(1).max(30), recipientName: z.string().trim().min(2), phone: z.string().trim().min(5), emirate: z.string().trim().min(2), area: z.string().trim().min(2), street: z.string().trim().min(2), building: z.string().trim().min(1), unit: z.string().trim().optional(), landmark: z.string().trim().optional(), notes: z.string().trim().optional(), isDefault: z.boolean().optional() });

export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  const customerId = session.sub;
  if (!customerId) return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  return NextResponse.json(await prisma.customerAddress.findMany({ where: { customerId: session.sub }, orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] }));
}

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  const customerId = session.sub;
  if (!customerId) return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please complete the delivery address." }, { status: 400 });
  const input = parsed.data;
  const count = await prisma.customerAddress.count({ where: { customerId } });
  const address = await prisma.$transaction(async (tx) => {
    if (input.isDefault || count === 0) await tx.customerAddress.updateMany({ where: { customerId }, data: { isDefault: false } });
    return tx.customerAddress.create({ data: { ...input, isDefault: input.isDefault || count === 0, customerId } });
  });
  return NextResponse.json(address, { status: 201 });
}
