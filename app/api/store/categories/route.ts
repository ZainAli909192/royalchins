import { NextResponse } from "next/server";
import { listStoreCategories } from "@/lib/categories/category-store";

export const revalidate = 120;

export async function GET() {
  return NextResponse.json(await listStoreCategories());
}
