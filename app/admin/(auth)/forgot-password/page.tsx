import { Suspense } from "react";

import { PasswordResetFlow } from "@/components/auth/password-reset-flow";

export default function AdminForgotPasswordPage() {
  return <Suspense><PasswordResetFlow accountType="admin" initialStep="request" /></Suspense>;
}
