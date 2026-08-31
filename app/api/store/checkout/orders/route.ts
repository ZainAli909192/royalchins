import { NextResponse } from "next/server";
import { z } from "zod";

import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

const schema = z.object({ addressId: z.string().min(1), paymentMethod: z.enum(["Card", "Tamara", "Tabby", "Cash"]), items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() })).min(1) });
const deliveryFees: Record<string, number> = { Dubai: 35, "Abu Dhabi": 50, Sharjah: 40, Ajman: 45, "Umm Al Quwain": 55, "Ras Al Khaimah": 60, Fujairah: 60 };

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ message: "Please sign in to place your order." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Your order is incomplete. Please review your items and delivery address." }, { status: 400 });
  const input = parsed.data;
  try {
    const order = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({ where: { id: session.sub } });
      const address = await tx.customerAddress.findFirst({ where: { id: input.addressId, customerId: session.sub } });
      if (!customer || !address) throw new Error("ADDRESS_NOT_FOUND");
      const ids = input.items.map((item) => item.productId);
      if (new Set(ids).size !== ids.length) throw new Error("DUPLICATE_PRODUCT");
      const products = await tx.product.findMany({ where: { id: { in: ids }, status: "Active" } });
      if (products.length !== ids.length) throw new Error("PRODUCT_UNAVAILABLE");
      const lines = input.items.map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId)!;
        if (product.type === "Animal" && item.quantity !== 1) throw new Error("ANIMAL_LIMIT");
        if (product.quantity < item.quantity) throw new Error(`OUT_OF_STOCK:${product.name}`);
        return { product, quantity: item.quantity, unitPrice: Number(product.salePrice ?? product.regularPrice) };
      });
      const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
      const deliveryFee = deliveryFees[address.emirate] ?? 60;
      const orderNumber = `RC-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
      const created = await tx.order.create({ data: { orderNumber, customerId: customer.id, customerName: customer.name, email: customer.email, phone: address.phone || customer.phone, shippingAddressId: address.id, subtotal, deliveryFee, total: subtotal + deliveryFee, paymentMethod: input.paymentMethod, paymentStatus: "Pending", orderStatus: "Confirmed", items: { create: lines.map((line) => ({ productId: line.product.id, productName: line.product.name, quantity: line.quantity, unitPrice: line.unitPrice })) } }, include: { items: { include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } } }, shippingAddress: true } });
      for (const line of lines) {
        await tx.product.update({ where: { id: line.product.id }, data: { quantity: { decrement: line.quantity } } });
        await tx.inventoryAdjustment.create({ data: { productId: line.product.id, previous: line.product.quantity, quantity: line.product.quantity - line.quantity, action: "Remove", reason: `Order ${orderNumber}`, notes: "Customer checkout reservation" } });
      }
      return created;
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "ORDER_FAILED";
    const message = reason.startsWith("OUT_OF_STOCK:") ? `${reason.slice(13)} no longer has enough stock.` : reason === "ADDRESS_NOT_FOUND" ? "Choose a saved delivery address before placing the order." : "We could not place this order. Please review your cart and try again.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
