import { Suspense } from "react";
import { PasswordResetFlow } from "@/components/auth/password-reset-flow";
export default function Page() { return <Suspense><PasswordResetFlow accountType="customer" initialStep="reset" /></Suspense>; }
