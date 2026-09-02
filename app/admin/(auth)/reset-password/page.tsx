import { Suspense } from "react";

import { PasswordResetFlow } from "@/components/auth/password-reset-flow";

export default function AdminResetPasswordPage() {
  return <Suspense><PasswordResetFlow accountType="admin" initialStep="reset" /></Suspense>;
}
