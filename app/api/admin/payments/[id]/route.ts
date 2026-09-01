import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { order: { include: { customer: true, items: true, shippingAddress: true } } },
  });
  return payment ? NextResponse.json(payment) : NextResponse.json({ message: "Payment not found." }, { status: 404 });
}
