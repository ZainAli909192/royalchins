import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { getCustomerSession } from "@/lib/auth/customer-session";
import { getAdminNotificationEmail } from "@/lib/auth/admin-auth-server";
import { sendOrderConfirmationEmails } from "@/lib/email/order-confirmation";
import { getStripe } from "@/lib/payments/stripe";
import { prisma } from "@/lib/prisma";

const schema = z.object({ paymentIntentId: z.string().min(1) });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const session = await getCustomerSession();
  if (!session?.sub) {
    return NextResponse.json({ message: "Please sign in to confirm this payment." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Payment confirmation is incomplete." }, { status: 400 });
  }

  const { orderNumber } = await params;

  try {
    const intent = await getStripe().paymentIntents.retrieve(parsed.data.paymentIntentId);
    if (
      intent.status !== "succeeded" ||
      intent.metadata.orderNumber !== orderNumber ||
      intent.metadata.customerId !== session.sub
    ) {
      return NextResponse.json({ message: "Stripe has not confirmed this payment." }, { status: 400 });
    }

    const paymentMethodId = typeof intent.payment_method === "string" ? intent.payment_method : intent.payment_method?.id;
    const stripeMethod = paymentMethodId ? await getStripe().paymentMethods.retrieve(paymentMethodId) : null;
    const card = stripeMethod?.card;
    const charge = intent.latest_charge && typeof intent.latest_charge !== "string" ? intent.latest_charge : null;

    const completed = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.order.findFirst({
        where: { id: intent.metadata.orderId, orderNumber, customerId: session.sub },
        include: { items: { include: { product: true } }, shippingAddress: true },
      });
      if (!order) throw new Error("ORDER_NOT_FOUND");

      if (order.paymentStatus === "Paid") return { order, newlyPaid: false };

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
      await tx.payment.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          amount: Number(order.total),
          currency: intent.currency.toUpperCase(),
          provider: "Stripe",
          method: "Card",
          status: "Paid",
          providerPaymentId: intent.id,
          providerChargeId: charge?.id ?? null,
          cardBrand: card?.brand ?? null,
          cardLast4: card?.last4 ?? null,
          receiptUrl: charge?.receipt_url ?? null,
          paidAt: new Date(),
        },
        update: {
          status: "Paid",
          providerPaymentId: intent.id,
          providerChargeId: charge?.id ?? null,
          cardBrand: card?.brand ?? null,
          cardLast4: card?.last4 ?? null,
          receiptUrl: intent.latest_charge && typeof intent.latest_charge !== "string" ? intent.latest_charge.receipt_url : null,
          paidAt: new Date(),
          failureCode: null,
          failureMessage: null,
          failedAt: null,
        },
      });
      return { order: paidOrder, newlyPaid: true };
    });

    if (completed.newlyPaid) {
      void sendOrderConfirmationEmails(completed.order, await getAdminNotificationEmail()).catch((error: unknown) => {
        console.error("Order confirmation email failed:", error);
      });
    }

    return NextResponse.json({ orderNumber, paymentStatus: "Paid", orderStatus: "Confirmed" });
  } catch (error) {
    console.error("Stripe payment confirmation failed:", error);
    const message = error instanceof Error && error.message === "OUT_OF_STOCK"
      ? "One of the selected accessories is no longer in stock."
      : "We could not confirm your payment. Please contact support if the charge was completed.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
