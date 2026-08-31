import { cookies } from "next/headers";

import { CUSTOMER_SESSION_COOKIE, verifyCustomerSession } from "@/lib/auth/customer-auth-server";

export async function getCustomerSession() {
  const token = (await cookies()).get(CUSTOMER_SESSION_COOKIE)?.value;
  return verifyCustomerSession(token);
}
