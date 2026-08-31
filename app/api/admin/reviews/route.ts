import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
const schema = z.object({ customerId: z.string().min(1), productId: z.string().min(1), orderId: z.string().optional(), rating: z.number().int().min(1).max(5), title: z.string().trim().max(160).optional(), comment: z.string().trim().min(3).max(5000), status: z.enum(["Pending", "Approved", "Rejected"]).optional() });
const include = { customer: true, product: { include: { images: { orderBy: { sortOrder: "asc" as const }, take: 1 } } }, order: true };
export async function GET(request: Request) { if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 }); return NextResponse.json(await prisma.review.findMany({ include, orderBy: { createdAt: "desc" } })); }
export async function POST(request: Request) { if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 }); const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ message: "Please correct the review details." }, { status: 400 }); try { return NextResponse.json(await prisma.review.create({ data: parsed.data, include }), { status: 201 }); } catch { return NextResponse.json({ message: "The selected customer, product, or order is unavailable." }, { status: 400 }); } }
