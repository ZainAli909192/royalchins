import { NextResponse } from "next/server";

import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ message: "Please sign in to view this order." }, { status: 401 });
  const { orderNumber } = await params;
  const order = await prisma.order.findFirst({ where: { orderNumber, customerId: session.sub }, include: { shippingAddress: true, items: { include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } } } } });
  if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 });
  return NextResponse.json(order);
}
