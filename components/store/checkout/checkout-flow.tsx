"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CheckoutStep = "delivery" | "payment" | "review" | "confirmation";

const steps = [
  { id: "delivery", label: "Delivery" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
] as const;

const cartItems = [
  { name: "White Chinchilla", meta: "Male • 8 months", price: 1400, image: "/animals/1.png", quantity: 1 },
  { name: "Premium Chinchilla Cage", meta: "Large premium habitat", price: 650, image: "/animals/3.png", quantity: 1 },
  { name: "Wooden Hideout", meta: "Natural wood shelter", price: 75, image: "/animals/5.png", quantity: 2 },
];

const subtotal = 2200;
const deliveryFee = 50;
const total = subtotal + deliveryFee;

export function CheckoutFlow({ step }: { step: CheckoutStep }) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [placingOrder, setPlacingOrder] = useState(false);

  const currentStep = steps.findIndex((item) => item.id === step);
  const submitDelivery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/checkout/payment");
  };
  const submitPayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/checkout/review");
  };
  const placeOrder = () => {
    setPlacingOrder(true);
    window.setTimeout(() => router.push("/checkout/confirmation"), 450);
  };

  if (step === "confirmation") {
    return <Confirmation />;
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-col gap-5 border-b border-border pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
        <div>
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to cart
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">Secure checkout</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Complete your order</h1>
        </div>
        <CheckoutStepper currentStep={currentStep} />
      </div>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
        <section className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7">
          {step === "delivery" && <DeliveryForm onSubmit={submitDelivery} />}
          {step === "payment" && <PaymentForm method={paymentMethod} onMethodChange={setPaymentMethod} onSubmit={submitPayment} />}
          {step === "review" && <ReviewOrder paymentMethod={paymentMethod} placingOrder={placingOrder} onPlaceOrder={placeOrder} />}
        </section>
        <OrderSummary compact={step !== "review"} />
      </div>
    </main>
  );
}

function CheckoutStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol aria-label="Checkout progress" className="flex w-full max-w-md items-start justify-between gap-2 sm:w-auto sm:min-w-[340px]">
      {steps.map((item, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;
        return <li key={item.id} className="flex min-w-0 flex-1 items-center gap-2 last:flex-none">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isComplete || isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`} aria-current={isCurrent ? "step" : undefined}>
            {isComplete ? <Check aria-hidden="true" className="h-4 w-4" /> : index + 1}
          </span>
          <span className={`hidden text-xs font-semibold sm:inline ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</span>
          {index < steps.length - 1 && <span aria-hidden="true" className={`h-px min-w-3 flex-1 ${index < currentStep ? "bg-primary" : "bg-border"}`} />}
        </li>;
      })}
    </ol>
  );
}

function DeliveryForm({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <form onSubmit={onSubmit} noValidate>
    <SectionHeading icon={MapPin} eyebrow="Step 1 of 3" title="Delivery details" description="Where should we deliver your order? We’ll confirm the delivery window before dispatch." />
    <div className="mt-7 grid gap-5 sm:grid-cols-2">
      <Input required id="first-name" name="firstName" label="First name" autoComplete="given-name" placeholder="First name" />
      <Input required id="last-name" name="lastName" label="Last name" autoComplete="family-name" placeholder="Last name" />
      <Input required id="email" name="email" type="email" label="Email address" autoComplete="email" placeholder="you@example.com" containerClassName="sm:col-span-2" />
      <Input required id="phone" name="phone" type="tel" label="Mobile number" autoComplete="tel" placeholder="+971 50 000 0000" containerClassName="sm:col-span-2" />
      <Input required id="address" name="address" label="Street address" autoComplete="street-address" placeholder="Building, street and area" containerClassName="sm:col-span-2" />
      <Input required id="emirate" name="emirate" label="Emirate" autoComplete="address-level1" placeholder="Dubai" />
      <Input required id="city" name="city" label="City / district" autoComplete="address-level2" placeholder="Jumeirah" />
      <Textarea id="delivery-note" name="deliveryNote" label="Delivery note (optional)" placeholder="Building access, preferred delivery time or any helpful instructions." className="min-h-28" containerClassName="sm:col-span-2" />
    </div>
    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />Your details are used only to fulfil this order.</p>
      <Button type="submit" size="lg" className="rounded-xl px-6">Continue to payment <ArrowRight aria-hidden="true" className="h-4 w-4" /></Button>
    </div>
  </form>;
}

function PaymentForm({ method, onMethodChange, onSubmit }: { method: "card" | "cash"; onMethodChange: (method: "card" | "cash") => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <form onSubmit={onSubmit} noValidate>
    <SectionHeading icon={CreditCard} eyebrow="Step 2 of 3" title="Choose payment" description="Select a payment method. No payment is taken until you confirm your order." />
    <fieldset className="mt-7 space-y-3"><legend className="sr-only">Payment method</legend>
      <PaymentOption checked={method === "card"} id="payment-card" title="Card payment" description="Visa, Mastercard or Apple Pay" onChange={() => onMethodChange("card")} />
      <PaymentOption checked={method === "cash"} id="payment-cash" title="Cash on delivery" description="Pay securely when your order arrives" onChange={() => onMethodChange("cash")} />
    </fieldset>
    {method === "card" && <div className="mt-6 rounded-2xl border border-border bg-surface-subtle p-4 sm:p-5"><div className="grid gap-5 sm:grid-cols-2"><Input required id="card-name" name="cardName" label="Name on card" placeholder="Full name" containerClassName="sm:col-span-2" /><Input required id="card-number" name="cardNumber" inputMode="numeric" label="Card number" placeholder="0000 0000 0000 0000" containerClassName="sm:col-span-2" /><Input required id="expiry" name="expiry" inputMode="numeric" label="Expiry date" placeholder="MM / YY" /><Input required id="cvc" name="cvc" inputMode="numeric" label="Security code" placeholder="CVC" /></div></div>}
    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><Link href="/checkout/delivery" className="inline-flex h-11 items-center justify-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Back to delivery</Link><Button type="submit" size="lg" className="rounded-xl px-6">Review order <ArrowRight aria-hidden="true" className="h-4 w-4" /></Button></div>
  </form>;
}

function ReviewOrder({ paymentMethod, placingOrder, onPlaceOrder }: { paymentMethod: "card" | "cash"; placingOrder: boolean; onPlaceOrder: () => void }) {
  return <div>
    <SectionHeading icon={PackageCheck} eyebrow="Step 3 of 3" title="Review and place order" description="Check the essentials one final time. You can return to edit your delivery or payment details." />
    <div className="mt-7 grid gap-4 sm:grid-cols-2"><ReviewCard title="Delivery" actionHref="/checkout/delivery" action="Edit"><p>Dubai, United Arab Emirates</p><p className="mt-1">Standard delivery · AED 50</p></ReviewCard><ReviewCard title="Payment" actionHref="/checkout/payment" action="Edit"><p>{paymentMethod === "card" ? "Card payment" : "Cash on delivery"}</p><p className="mt-1">Securely processed at confirmation</p></ReviewCard></div>
    <div className="mt-6 rounded-2xl border border-border p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><p className="font-bold text-foreground">Your order</p><p className="mt-1 text-sm text-muted-foreground">{cartItems.length + 1} items</p></div><Link href="/cart" className="text-sm font-semibold text-primary hover:text-primary-hover">Edit cart</Link></div><div className="mt-4 divide-y divide-border border-t border-border">{cartItems.map((item) => <div key={item.name} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="min-w-0"><span className="block truncate font-semibold text-foreground">{item.name}</span><span className="text-muted-foreground">Qty {item.quantity}</span></span><span className="shrink-0 font-semibold text-foreground">AED {(item.price * item.quantity).toLocaleString()}</span></div>)}</div></div>
    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><Link href="/checkout/payment" className="inline-flex h-11 items-center justify-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Back to payment</Link><Button onClick={onPlaceOrder} loading={placingOrder} size="lg" className="rounded-xl px-6">Place order · AED {total.toLocaleString()} <LockKeyhole aria-hidden="true" className="h-4 w-4" /></Button></div>
  </div>;
}

function OrderSummary({ compact }: { compact: boolean }) {
  return <aside className="h-fit rounded-3xl border border-border bg-background p-5 shadow-md lg:sticky lg:top-24 lg:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Order summary</p><h2 className="mt-1 text-xl font-bold text-foreground">{cartItems.length + 1} items selected</h2></div><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><ShoppingBag aria-hidden="true" className="h-5 w-5" /></span></div>{!compact && <div className="mt-5 space-y-3">{cartItems.map((item) => <div key={item.name} className="flex items-center gap-3"><div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface-subtle"><Image src={item.image} alt="" fill sizes="44px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">Qty {item.quantity}</p></div><p className="text-sm font-semibold text-foreground">AED {(item.price * item.quantity).toLocaleString()}</p></div>)}</div>}<div className="my-5 border-t border-border" /><div className="space-y-3 text-sm"><SummaryLine label="Subtotal" value={`AED ${subtotal.toLocaleString()}`} /><SummaryLine label="UAE delivery" value={`AED ${deliveryFee}`} /><div className="border-t border-border pt-3"><SummaryLine label="Total" value={`AED ${total.toLocaleString()}`} total /></div></div><div className="mt-5 flex gap-3 rounded-2xl bg-surface-subtle p-3.5"><ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><p className="text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">Protected checkout.</span> Your payment and delivery details are handled securely.</p></div></aside>;
}

function Confirmation() {
  return <main className="mx-auto flex min-h-[70dvh] max-w-[760px] items-center px-4 py-10 sm:px-6"><section className="w-full rounded-3xl border border-border bg-background p-6 text-center shadow-md sm:p-10"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-primary"><Check aria-hidden="true" className="h-8 w-8" strokeWidth={2.4} /></span><p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-primary">Order confirmed</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Thank you for your order.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">We’ve received your order and will email your delivery confirmation shortly.</p><div className="mx-auto mt-7 max-w-md rounded-2xl bg-surface-subtle p-5 text-left"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Order number</span><span className="font-bold text-foreground">RC-2026-0827</span></div><div className="my-4 border-t border-border" /><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Order total</span><span className="text-xl font-bold text-primary">AED {total.toLocaleString()}</span></div></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><Link href="/" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Continue shopping <ChevronRight aria-hidden="true" className="h-4 w-4" /></Link><Link href="/cart" className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-5 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">View cart</Link></div><p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Truck aria-hidden="true" className="h-4 w-4 text-primary" />We’ll contact you to arrange your UAE delivery.</p></section></main>;
}

function SectionHeading({ icon: Icon, eyebrow, title, description }: { icon: typeof MapPin; eyebrow: string; title: string; description: string }) { return <div><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="h-5 w-5" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p></div>; }
function PaymentOption({ checked, id, title, description, onChange }: { checked: boolean; id: string; title: string; description: string; onChange: () => void }) { return <label htmlFor={id} className={`flex min-h-20 cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors ${checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}><input id={id} name="payment-method" type="radio" checked={checked} onChange={onChange} className="h-4 w-4 accent-primary" /><span className="flex min-w-0 flex-1 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary"><CreditCard aria-hidden="true" className="h-5 w-5" /></span><span><span className="block text-sm font-bold text-foreground">{title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{description}</span></span></span></label>; }
function ReviewCard({ title, actionHref, action, children }: { title: string; actionHref: string; action: string; children: React.ReactNode }) { return <div className="rounded-2xl bg-surface-subtle p-4"><div className="flex items-center justify-between gap-3"><p className="font-bold text-foreground">{title}</p><Link href={actionHref} className="text-xs font-bold text-primary hover:text-primary-hover">{action}</Link></div><div className="mt-3 text-sm leading-6 text-muted-foreground">{children}</div></div>; }
function SummaryLine({ label, value, total = false }: { label: string; value: string; total?: boolean }) { return <div className="flex items-center justify-between gap-4"><span className={total ? "font-bold text-foreground" : "text-muted-foreground"}>{label}</span><span className={total ? "text-lg font-bold text-primary" : "font-semibold text-foreground"}>{value}</span></div>; }
