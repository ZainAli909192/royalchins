import { NextResponse } from "next/server";
import { listCategories } from "@/lib/categories/category-store";

export async function GET() {
  const categories = await listCategories();
  return NextResponse.json(
    categories
      .filter((category) => category.isActive)
      .map(({ id, name, slug, type, imageUrl }) => ({ id, name, slug, type, imageUrl }))
  );
}
