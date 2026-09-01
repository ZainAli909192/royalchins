import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

import { getCustomerSession } from "@/lib/auth/customer-session";
import { getAdminNotificationEmail } from "@/lib/auth/admin-auth-server";
import { prisma } from "@/lib/prisma";

const schema = z.object({ reason: z.string().trim().min(2).max(200), customerNote: z.string().trim().max(1000).optional() });

export async function POST(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await getCustomerSession();
  if (!session?.sub) return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please provide a refund reason." }, { status: 400 });
  const { orderNumber } = await params;
  const order = await prisma.order.findFirst({ where: { orderNumber, customerId: session.sub }, include: { payment: true } });
  if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 });
  if (order.orderStatus !== "Cancelled" || order.paymentStatus !== "Paid" || !order.payment) return NextResponse.json({ message: "Only cancelled, paid orders can have a refund request." }, { status: 400 });
  const refund = await prisma.refund.create({ data: { orderId: order.id, paymentId: order.payment.id, amount: order.total, reason: parsed.data.reason, customerNote: parsed.data.customerNote ?? "" } }).catch(() => null);
  if (!refund) return NextResponse.json({ message: "A refund request already exists for this order." }, { status: 409 });

  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = await getAdminNotificationEmail();
  if (apiKey && ownerEmail) {
    void new Resend(apiKey).emails.send({ from: process.env.RESEND_FROM_EMAIL ?? "Royal Chins <onboarding@resend.dev>", to: ownerEmail, subject: `Refund request: ${order.orderNumber}`, html: `<p>A customer requested a refund.</p><p><strong>Order:</strong> ${order.orderNumber}<br/><strong>Amount:</strong> AED ${Number(order.total).toFixed(2)}<br/><strong>Reason:</strong> ${refund.reason}</p>` }).catch((error: unknown) => console.error("Refund request email failed:", error));
  }
  return NextResponse.json(refund, { status: 201 });
}
