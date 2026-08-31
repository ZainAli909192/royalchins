import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createProduct, listProducts, ProductStoreError } from "@/lib/products/product-store";
import { productApiSchema } from "@/lib/validations/product";

export const dynamic = "force-dynamic";

export async function GET(request: Request) { if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 }); return NextResponse.json(await listProducts()); }
export async function POST(request: Request) { if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 }); const parsed = productApiSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ message: "Please correct the product details.", errors: parsed.error.flatten().fieldErrors }, { status: 400 }); try { return NextResponse.json(await createProduct(parsed.data), { status: 201 }); } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create product." }, { status: error instanceof ProductStoreError ? error.status : 500 }); } }
