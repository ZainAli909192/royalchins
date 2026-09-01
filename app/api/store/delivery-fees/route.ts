import { NextResponse } from "next/server";

import { getDeliveryQuote } from "@/lib/delivery/delivery-store";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subtotal = Number(searchParams.get("subtotal") ?? "0");
  const quote = await getDeliveryQuote(prisma, {
    emirate: searchParams.get("emirate") ?? "",
    area: searchParams.get("area") ?? "",
    subtotal: Number.isFinite(subtotal) ? Math.max(0, subtotal) : 0,
  });
  return quote
    ? NextResponse.json(quote)
    : NextResponse.json({ message: "Delivery is not available for this area yet." }, { status: 404 });
}
