import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
export async function GET(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  return NextResponse.json(await prisma.refund.findMany({ include: { order: { include: { customer: true, payment: true } } }, orderBy: { requestedAt: "desc" } }));
}
