import { NextResponse } from "next/server";

import { listStoreProducts } from "@/lib/products/product-store";

export const revalidate = 60;

export async function GET() {
  const products = await listStoreProducts();
  return NextResponse.json(products);
}
