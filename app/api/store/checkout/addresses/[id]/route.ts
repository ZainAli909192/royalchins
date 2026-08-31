import { NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

const schema = z.object({ label: z.string().trim().min(1), recipientName: z.string().trim().min(2), phone: z.string().trim().min(5), emirate: z.string().trim().min(2), area: z.string().trim().min(2), street: z.string().trim().min(2), building: z.string().trim().min(1), unit: z.string().trim().optional(), landmark: z.string().trim().optional(), notes: z.string().trim().optional(), isDefault: z.boolean().optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
 const session = await getCustomerSession(); if (!session?.sub) return NextResponse.json({ message: "Please sign in." }, { status: 401 });
 const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ message: "Please complete the address." }, { status: 400 });
 const { id } = await params; const exists = await prisma.customerAddress.findFirst({ where: { id, customerId: session.sub } }); if (!exists) return NextResponse.json({ message: "Address not found." }, { status: 404 });
 const address = await prisma.$transaction(async tx => { if (parsed.data.isDefault) await tx.customerAddress.updateMany({ where: { customerId: session.sub }, data: { isDefault: false } }); return tx.customerAddress.update({ where: { id }, data: parsed.data }); }); return NextResponse.json(address);
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
 const session = await getCustomerSession(); if (!session?.sub) return NextResponse.json({ message: "Please sign in." }, { status: 401 }); const { id } = await params;
 const address = await prisma.customerAddress.findFirst({ where: { id, customerId: session.sub } }); if (!address) return NextResponse.json({ message: "Address not found." }, { status: 404 });
 await prisma.$transaction(async tx => { await tx.customerAddress.delete({ where: { id } }); if (address.isDefault) { const next = await tx.customerAddress.findFirst({ where: { customerId: session.sub }, orderBy: { updatedAt: "desc" } }); if (next) await tx.customerAddress.update({ where: { id: next.id }, data: { isDefault: true } }); } }); return new NextResponse(null, { status: 204 });
}
