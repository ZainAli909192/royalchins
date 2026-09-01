import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const payments = await prisma.payment.findMany({
    include: { order: { include: { customer: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(payments);
}
