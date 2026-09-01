import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };
const schema = z.object({
  area: z.string().trim().min(1).max(100).optional(),
  emirate: z.string().trim().min(1).max(100).optional(),
  fee: z.coerce.number().min(0).optional(),
  eta: z.string().trim().min(1).max(100).optional(),
  freeDeliveryThreshold: z.coerce.number().min(0).nullable().optional(),
  isFreeDelivery: z.boolean().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export async function PATCH(request: Request, { params }: Context) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please provide valid delivery details." }, { status: 400 });
  const input = parsed.data;
  const zone = await prisma.deliveryZone.update({
    where: { id: (await params).id },
    data: { ...input, ...(input.status ? { isActive: input.status === "Active" } : {}) },
  }).catch(() => null);
  return zone ? NextResponse.json(zone) : NextResponse.json({ message: "Delivery area not found." }, { status: 404 });
}

export async function DELETE(request: Request, { params }: Context) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const zone = await prisma.deliveryZone.delete({ where: { id: (await params).id } }).catch(() => null);
  return zone ? NextResponse.json({ message: "Delivery area deleted successfully." }) : NextResponse.json({ message: "Delivery area not found." }, { status: 404 });
}
