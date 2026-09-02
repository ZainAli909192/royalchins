import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminAccount } from "@/lib/auth/admin-auth-server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40),
  avatar: z.string().max(3_000_000).nullable().optional(),
});

function serialize(admin: { id: string; name: string; email: string; phone: string; avatar?: string | null }) {
  return { id: admin.id, fullName: admin.name, email: admin.email, phone: admin.phone, avatar: admin.avatar ?? "", role: "Owner / Admin" };
}

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  return NextResponse.json(serialize(await getAdminAccount()));
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please enter valid profile details." }, { status: 400 });

  const admin = await getAdminAccount();
  const input = parsed.data;

  try {
    const updated = await prisma.adminAccount.update({
      where: { id: admin.id },
      data: {
        name: input.fullName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        avatar: input.avatar ?? null,
      },
    });
    return NextResponse.json(serialize(updated));
  } catch {
    return NextResponse.json({ message: "This email address is already in use." }, { status: 409 });
  }
}
