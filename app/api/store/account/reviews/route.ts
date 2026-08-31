import { NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

const schema = z.object({ productId: z.string().min(1), orderNumber: z.string().min(1), rating: z.number().int().min(1).max(5), title: z.string().trim().max(120).optional(), comment: z.string().trim().min(10).max(2000) });
export async function GET() {
 const session = await getCustomerSession(); if (!session?.sub) return NextResponse.json({ message: "Please sign in." }, { status: 401 });
 const [reviews, orders] = await Promise.all([prisma.review.findMany({ where: { customerId: session.sub }, include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } }, order: true }, orderBy: { createdAt: "desc" } }), prisma.order.findMany({ where: { customerId: session.sub, orderStatus: "Delivered" }, include: { items: { include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } } } } })]);
 const reviewed = new Set(reviews.map((review: { orderId: string | null; productId: string }) => `${review.orderId}-${review.productId}`));
 const reviewable = orders.flatMap((order: { id: string; orderNumber: string; updatedAt: Date; items: { productId: string | null; product: unknown }[] }) => order.items.filter((item: { productId: string | null }) => item.productId && !reviewed.has(`${order.id}-${item.productId}`)).map((item: { product: unknown }) => ({ orderNumber: order.orderNumber, deliveredAt: order.updatedAt, product: item.product })));
 return NextResponse.json({ reviews, reviewable });
}
export async function POST(request: Request) {
 const session = await getCustomerSession(); if (!session?.sub) return NextResponse.json({ message: "Please sign in." }, { status: 401 }); const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ message: "Please complete your review." }, { status: 400 });
 const input = parsed.data; const order = await prisma.order.findFirst({ where: { orderNumber: input.orderNumber, customerId: session.sub, orderStatus: "Delivered" } }); if (!order) return NextResponse.json({ message: "Reviews are available after delivery." }, { status: 400 });
 const item = await prisma.orderItem.findFirst({ where: { orderId: order.id, productId: input.productId } }); if (!item) return NextResponse.json({ message: "This product was not part of the selected order." }, { status: 400 });
 try { return NextResponse.json(await prisma.review.create({ data: { customerId: session.sub, productId: input.productId, orderId: order.id, rating: input.rating, title: input.title, comment: input.comment, status: "Pending" } }), { status: 201 }); } catch { return NextResponse.json({ message: "You have already reviewed this product for this order." }, { status: 409 }); }
}
