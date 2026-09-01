import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { listDeliveryZones } from "@/lib/delivery/delivery-store";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  area: z.string().trim().min(1).max(100),
  emirate: z.string().trim().min(1).max(100),
  fee: z.coerce.number().min(0),
  eta: z.string().trim().min(1).max(100),
  freeDeliveryThreshold: z.coerce.number().min(0).nullable().optional(),
  isFreeDelivery: z.boolean().optional().default(false),
  status: z.enum(["Active", "Inactive"]),
});

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  return NextResponse.json(await listDeliveryZones());
}

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please provide valid delivery details." }, { status: 400 });
  const input = parsed.data;
  try {
    const zone = await prisma.deliveryZone.create({
      data: {
        area: input.area,
        emirate: input.emirate,
        fee: input.fee,
        eta: input.eta,
        freeDeliveryThreshold: input.freeDeliveryThreshold ?? null,
        isFreeDelivery: input.isFreeDelivery,
        isActive: input.status === "Active",
      },
    });
    return NextResponse.json(zone, { status: 201 });
  } catch {
    return NextResponse.json({ message: "A delivery zone for this area already exists." }, { status: 409 });
  }
}
