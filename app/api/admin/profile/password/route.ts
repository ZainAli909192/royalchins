import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminAccount } from "@/lib/auth/admin-auth-server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((input) => input.newPassword === input.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export async function PUT(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Enter a valid new password." }, { status: 400 });

  const admin = await getAdminAccount();
  if (!(await compare(parsed.data.currentPassword, admin.passwordHash))) {
    return NextResponse.json({ message: "Your current password is incorrect." }, { status: 400 });
  }
  if (parsed.data.currentPassword === parsed.data.newPassword) {
    return NextResponse.json({ message: "Your new password must be different from the current password." }, { status: 400 });
  }

  await prisma.adminAccount.update({ where: { id: admin.id }, data: { passwordHash: await hash(parsed.data.newPassword, 12) } });
  return NextResponse.json({ message: "Password updated successfully." });
}
