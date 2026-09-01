import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import Stripe from "stripe";

import { getAdminNotificationEmail } from "@/lib/auth/admin-auth-server";
import { sendOrderConfirmationEmails } from "@/lib/email/order-confirmation";
import { getStripe } from "@/lib/payments/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!webhookSecret || !signature) {
    return NextResponse.json({ message: "Stripe webhook is not configured." }, { status: 400 });
  }

  try {
    const event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret
    );
    const intent = event.data.object as Stripe.PaymentIntent;
    const { orderId, orderNumber, customerId } = intent.metadata;
    if (!orderId || !orderNumber || !customerId) return NextResponse.json({ received: true });

    if (event.type === "payment_intent.payment_failed") {
      await prisma.payment.updateMany({
        where: { orderId },
        data: {
          status: "Failed",
          providerPaymentId: intent.id,
          failureCode: intent.last_payment_error?.code ?? null,
          failureMessage: intent.last_payment_error?.message ?? "Stripe declined this payment.",
          failedAt: new Date(),
        },
      });
      await prisma.order.updateMany({ where: { id: orderId, customerId }, data: { paymentStatus: "Failed" } });
      return NextResponse.json({ received: true });
    }

    if (event.type !== "payment_intent.succeeded") return NextResponse.json({ received: true });

    const completed = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, orderNumber, customerId },
        include: { items: { include: { product: true } }, shippingAddress: true },
      });
      if (!order || order.paymentStatus === "Paid") return null;

      for (const item of order.items) {
        if (!item.product || item.product.type === "Animal") continue;
        const updated = await tx.product.updateMany({
          where: { id: item.productId ?? "", quantity: { gte: item.quantity } },
          data: { quantity: { decrement: item.quantity } },
        });
        if (updated.count !== 1) throw new Error("OUT_OF_STOCK");
      }

      const paidOrder = await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: "Paid", orderStatus: "Confirmed" },
        include: { items: true, shippingAddress: true },
      });
      await tx.payment.updateMany({
        where: { orderId: order.id },
        data: {
          provider: "Stripe",
          method: "Card",
          status: "Paid",
          providerPaymentId: intent.id,
          providerChargeId: typeof intent.latest_charge === "string" ? intent.latest_charge : intent.latest_charge?.id ?? null,
          paidAt: new Date(),
          failureCode: null,
          failureMessage: null,
          failedAt: null,
        },
      });
      return paidOrder;
    });

    if (completed) {
      await sendOrderConfirmationEmails(completed, await getAdminNotificationEmail());
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook failed:", error);
    return NextResponse.json({ message: "Webhook processing failed." }, { status: 400 });
  }
}
