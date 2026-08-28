import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/input";

export function CheckoutAuth() {
  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <ShieldCheck aria-hidden="true" className="h-5 w-5" />
      </span>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">Secure checkout</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Continue with your email</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Use your email to receive your delivery and order updates.</p>
      <form className="mt-6 space-y-5">
        <Input id="checkout-email" name="email" type="email" autoComplete="email" required label="Email address" placeholder="you@example.com" />
        <Link href="/checkout/delivery" className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          Continue to delivery <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </form>
    </section>
  );
}
