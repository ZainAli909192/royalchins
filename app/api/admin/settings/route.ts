import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validations/settings";

const defaults = {
  brand: { storeName: "Royal Chins", logo: "/logo.png", primaryColor: "#6F3CC3", secondaryColor: "#000000" },
  contact: { email: "hello@royalchins.ae", phone: "+971 50 000 0000", whatsapp: "+971 50 000 0000", instagram: "@royalchins" },
  inventory: { lowStockThreshold: 2, hideOutOfStock: false },
  reviews: { autoApproveReviews: false },
};

function asObject(value: unknown) { return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const records = await prisma.storeSetting.findMany({ where: { key: { in: Object.keys(defaults) } } });
  const saved = Object.fromEntries(records.map((record) => [record.key, asObject(record.value)]));
  return NextResponse.json({ brand: { ...defaults.brand, ...saved.brand }, contact: { ...defaults.contact, ...saved.contact }, inventory: { ...defaults.inventory, ...saved.inventory }, reviews: { ...defaults.reviews, ...saved.reviews } });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const parsed = settingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please provide valid settings.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  await prisma.$transaction([
    ...Object.entries(parsed.data).map(([key, value]) => prisma.storeSetting.upsert({ where: { key }, create: { key, value }, update: { value } })),
    prisma.product.updateMany({ data: { lowStockThreshold: parsed.data.inventory.lowStockThreshold } }),
  ]);
  return NextResponse.json(parsed.data);
}
