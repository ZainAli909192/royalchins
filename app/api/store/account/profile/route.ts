import { NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

const schema = z.object({ name: z.string().trim().min(2), email: z.string().trim().email(), phone: z.string().trim().min(5) });
export async function PATCH(request: Request) {
  const session = await getCustomerSession();
  if (!session?.sub) return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please provide valid profile details." }, { status: 400 });
  try { const customer = await prisma.customer.update({ where: { id: session.sub }, data: parsed.data }); return NextResponse.json({ customer }); }
  catch { return NextResponse.json({ message: "This email is already in use." }, { status: 409 }); }
}
