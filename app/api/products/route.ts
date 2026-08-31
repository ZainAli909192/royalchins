import { NextResponse } from "next/server";

import { listStoreProducts } from "@/lib/products/product-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listStoreProducts();
  return NextResponse.json(products);
}
