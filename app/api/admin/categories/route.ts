import { NextResponse } from "next/server";

import { createCategory, listCategories } from "@/lib/categories/category-store";
import { requireAdmin } from "@/lib/auth/require-admin";
import { categorySchema } from "@/lib/validations/category";

export async function GET(request: Request) { if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 }); return NextResponse.json(await listCategories()); }
export async function POST(request: Request) { if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 }); const parsed = categorySchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ message: "Please correct the category details.", errors: parsed.error.flatten().fieldErrors }, { status: 400 }); try { return NextResponse.json(await createCategory(parsed.data), { status: 201 }); } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create category." }, { status: (error as { status?: number }).status ?? 500 }); } }
