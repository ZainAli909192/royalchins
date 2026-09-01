import { NextResponse } from "next/server";

import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

export async function PATCH(_request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await getCustomerSession();
  if (!session?.sub) return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  const { orderNumber } = await params;
  const order = await prisma.order.findFirst({ where: { orderNumber, customerId: session.sub } });
  if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 });
  if (!["Pending", "Confirmed"].includes(order.orderStatus)) return NextResponse.json({ message: "This order can no longer be cancelled." }, { status: 400 });
  const cancelled = await prisma.order.update({ where: { id: order.id }, data: { orderStatus: "Cancelled" } });
  return NextResponse.json(cancelled);
}
