import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

const schema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8) });
export async function PATCH(request: Request) {
  const session = await getCustomerSession();
  if (!session?.sub) return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Your new password must be at least 8 characters." }, { status: 400 });
  const customer = await prisma.customer.findUnique({ where: { id: session.sub } });
  if (!customer?.passwordHash || !(await compare(parsed.data.currentPassword, customer.passwordHash))) return NextResponse.json({ message: "Your current password is incorrect." }, { status: 400 });
  await prisma.customer.update({ where: { id: customer.id }, data: { passwordHash: await hash(parsed.data.newPassword, 12) } });
  return NextResponse.json({ success: true });
}
