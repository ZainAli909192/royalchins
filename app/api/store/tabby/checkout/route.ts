import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { getDeliveryQuote } from "@/lib/delivery/delivery-store";
import { createTabbyCheckout, TabbyError } from "@/lib/payments/tabby";
import { prisma } from "@/lib/prisma";

const schema = z.object({ addressId: z.string().min(1), items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() })).min(1) });
const orderNumber = () => `RC-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

export async function POST(request: Request) {
  const session = await getCustomerSession();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!session?.sub) return NextResponse.json({ message: "Please sign in to place your order." }, { status: 401 });
  if (!parsed.success) return NextResponse.json({ message: "Your order is incomplete. Please review your items and delivery address." }, { status: 400 });
  let createdId: string | null = null;
  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const customer = await tx.customer.findUnique({ where: { id: session.sub } });
      const address = await tx.customerAddress.findFirst({ where: { id: parsed.data.addressId, customerId: session.sub } });
      const ids = parsed.data.items.map((item) => item.productId);
      if (!customer || !address) throw new Error("ADDRESS_NOT_FOUND");
      if (new Set(ids).size !== ids.length) throw new Error("DUPLICATE_PRODUCT");
      const products = await tx.product.findMany({ where: { id: { in: ids }, status: "Active" }, include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, category: true } });
      if (products.length !== ids.length) throw new Error("PRODUCT_UNAVAILABLE");
      const lines = parsed.data.items.map((item) => { const product = products.find((candidate) => candidate.id === item.productId); if (!product) throw new Error("PRODUCT_UNAVAILABLE"); const quantity = product.type === "Animal" ? 1 : item.quantity; if ((product.type === "Animal" && (item.quantity !== 1 || product.isSold)) || (product.type === "Accessory" && product.quantity < quantity)) throw new Error(product.type === "Animal" ? "PET_SOLD" : "OUT_OF_STOCK"); return { product, quantity, unitPrice: Number(product.salePrice ?? product.regularPrice) }; });
      const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
      const quote = await getDeliveryQuote(tx, { emirate: address.emirate, area: address.area, subtotal });
      if (!quote) throw new Error("DELIVERY_UNAVAILABLE");
      const total = subtotal + quote.fee;
      const order = await tx.order.create({ data: { orderNumber: orderNumber(), customerId: customer.id, customerName: customer.name, email: customer.email, phone: address.phone || customer.phone, shippingAddressId: address.id, subtotal, deliveryFee: quote.fee, total, paymentMethod: "Tabby", paymentStatus: "Pending", orderStatus: "Pending", items: { create: lines.map((line) => ({ productId: line.product.id, productName: line.product.name, quantity: line.quantity, unitPrice: line.unitPrice })) }, payment: { create: { provider: "Tabby", method: "Tabby", status: "Pending", amount: total, currency: "AED" } } }, include: { items: { include: { product: { include: { images: { take: 1 }, category: true } } } }, shippingAddress: true } });
      return { order, address, lines };
    });
    createdId = result.order.id;
    const root = appUrl();
    const tabby = await createTabbyCheckout({ amount: Number(result.order.total), buyer: { name: result.order.customerName, email: result.order.email, phone: result.order.phone.replace(/[^\d+]/g, "") }, address: { city: result.address.emirate, address: [result.address.building, result.address.street, result.address.area].filter(Boolean).join(", ") }, orderNumber: result.order.orderNumber, items: result.lines.map(({ product, quantity, unitPrice }) => ({ title: product.name, quantity, unit_price: unitPrice.toFixed(2), category: product.category.name, reference_id: product.sku, description: product.shortDescription, image_url: product.images[0]?.url.startsWith("http") ? product.images[0].url : undefined })), success: `${root}/checkout/confirmation?order=${encodeURIComponent(result.order.orderNumber)}&tabby=1`, cancel: `${root}/checkout/payment?tabby=cancelled`, failure: `${root}/checkout/payment?tabby=failed` });
    const checkoutUrl = tabby.configuration?.available_products?.installments?.[0]?.web_url;
    if (!checkoutUrl || tabby.configuration?.products?.installments?.is_available === false) throw new Error(tabby.configuration?.products?.installments?.rejection_reason || "Tabby is unable to approve this purchase. Please choose another payment method.");
    await prisma.payment.update({ where: { orderId: result.order.id }, data: { providerPaymentId: tabby.payment.id } });
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    if (createdId) await prisma.order.delete({ where: { id: createdId } }).catch(() => undefined);
    const reason = error instanceof Error ? error.message : "";
    console.error("Tabby checkout creation failed", error);
    const message = reason === "TABBY_NOT_CONFIGURED" ? "Tabby is not configured yet. Please contact Royal Chins support." : reason === "ADDRESS_NOT_FOUND" ? "Choose a saved delivery address before continuing." : reason === "PET_SOLD" ? "This pet has already found a home. Please choose another pet." : reason === "OUT_OF_STOCK" ? "One or more accessories are no longer in stock." : reason === "DELIVERY_UNAVAILABLE" ? "Delivery is not available for this address yet." : error instanceof TabbyError ? `Tabby could not start this payment: ${reason}` : reason || "Tabby could not start this payment. Please choose another payment method.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
