import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const schema = z.object({ orderStatus: z.enum(["Pending", "Confirmed", "Processing", "Delivered", "Cancelled"]).optional(), paymentStatus: z.enum(["Paid", "Pending", "Failed", "Refunded"]).optional(), notes: z.string().trim().optional() });
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, { params }: Context) { if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 }); const order = await prisma.order.findUnique({ where: { id: (await params).id }, include: { items: { include: { product: true } } } }); return order ? NextResponse.json(order) : NextResponse.json({ message: "Order not found." }, { status: 404 }); }
export async function PATCH(request: Request, { params }: Context) { if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 }); const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ message: "Please provide valid order changes." }, { status: 400 }); const id = (await params).id; const order = await prisma.order.update({ where: { id }, data: parsed.data, include: { items: true } }).catch(() => null); return order ? NextResponse.json(order) : NextResponse.json({ message: "Order not found." }, { status: 404 }); }
