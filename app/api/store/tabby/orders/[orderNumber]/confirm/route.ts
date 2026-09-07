import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { getAdminNotificationEmail } from "@/lib/auth/admin-auth-server";
import { sendOrderConfirmationEmails } from "@/lib/email/order-confirmation";
import { captureTabbyPayment, getTabbyPayment } from "@/lib/payments/tabby";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await getCustomerSession();
  if (!session?.sub) return NextResponse.json({ message: "Please sign in to confirm this payment." }, { status: 401 });
  const { orderNumber } = await params;
  try {
    const order = await prisma.order.findFirst({ where: { orderNumber, customerId: session.sub }, include: { payment: true, items: { include: { product: { include: { category: true, images: { take: 1 } } } }, }, shippingAddress: true } });
    if (!order?.payment || order.payment.provider !== "Tabby" || !order.payment.providerPaymentId) throw new Error("ORDER_NOT_FOUND");
    let remote = await getTabbyPayment(order.payment.providerPaymentId);
    if (remote.order?.reference_id && remote.order.reference_id !== orderNumber) throw new Error("PAYMENT_MISMATCH");
    if (remote.status === "AUTHORIZED") remote = await captureTabbyPayment(remote.id, Number(order.total), `capture-${orderNumber}`, order.items.map((item) => ({ title: item.productName, quantity: item.quantity, unit_price: Number(item.unitPrice).toFixed(2), category: item.product?.category.name ?? "Products", reference_id: item.product?.sku ?? item.id, description: item.product?.shortDescription ?? item.productName, image_url: item.product?.images[0]?.url.startsWith("http") ? item.product.images[0].url : undefined })));
    if (remote.status !== "CLOSED") {
      if (remote.status === "REJECTED" || remote.status === "EXPIRED") await prisma.$transaction([prisma.payment.update({ where: { orderId: order.id }, data: { status: "Failed", failureMessage: "Tabby did not approve this payment.", failedAt: new Date() } }), prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "Failed" } })]);
      return NextResponse.json({ message: "Tabby has not confirmed this payment yet." }, { status: 400 });
    }
    const completed = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const current = await tx.order.findUnique({ where: { id: order.id }, include: { items: { include: { product: true } }, shippingAddress: true } });
      if (!current) throw new Error("ORDER_NOT_FOUND");
      if (current.paymentStatus === "Paid") return { order: current, newlyPaid: false };
      for (const item of current.items) { if (!item.product) continue; if (item.product.type === "Animal") { const updated = await tx.product.updateMany({ where: { id: item.productId ?? "", isSold: false }, data: { isSold: true } }); if (updated.count !== 1) throw new Error("PET_SOLD"); } else { const updated = await tx.product.updateMany({ where: { id: item.productId ?? "", quantity: { gte: item.quantity } }, data: { quantity: { decrement: item.quantity } } }); if (updated.count !== 1) throw new Error("OUT_OF_STOCK"); } }
      const paid = await tx.order.update({ where: { id: current.id }, data: { paymentStatus: "Paid", orderStatus: "Confirmed" }, include: { items: true, shippingAddress: true } });
      await tx.payment.update({ where: { orderId: current.id }, data: { status: "Paid", provider: "Tabby", method: "Tabby", paidAt: new Date(), failureCode: null, failureMessage: null, failedAt: null } });
      return { order: paid, newlyPaid: true };
    });
    if (completed.newlyPaid) void sendOrderConfirmationEmails(completed.order, await getAdminNotificationEmail()).catch(console.error);
    return NextResponse.json({ orderNumber, paymentStatus: "Paid", orderStatus: "Confirmed" });
  } catch (error) {
    console.error("Tabby payment confirmation failed:", error);
    return NextResponse.json({ message: "We could not confirm your Tabby payment. Please contact support if you completed the payment." }, { status: 400 });
  }
}
