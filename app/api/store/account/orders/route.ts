import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const session = await getCustomerSession();
  if (!session?.sub) return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  return NextResponse.json(await prisma.order.findMany({ where: { customerId: session.sub }, include: { items: { include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } } } }, orderBy: { createdAt: "desc" } }));
}
