import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  KeyRound,
  Mail,
  MapPin,
  MessageSquareText,
  PackageCheck,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const customer = {
  firstName: "Ahmed",
  fullName: "Ahmed Daniyal",
  email: "ahmed@example.com",
  phone: "+971 50 780 1110",
};

const stats = {
  orders: 3,
  pendingReviews: 1,
};

const recentOrder = {
  id: "RC-2026-00124",
  date: "31 Aug 2026",
  status: "Confirmed",
  total: 2160,
  items: [
    {
      id: "white-chinchilla",
      name: "White Chinchilla",
      image: "/animals/1.png",
    },
    {
      id: "premium-chinchilla-cage",
      name: "Premium Chinchilla Cage",
      image: "/animals/3.png",
    },
    {
      id: "wooden-hideout",
      name: "Wooden Hideout",
      image: "/animals/5.png",
    },
  ],
};

const accountLinks = [
  {
    title: "Profile Information",
    description: "Manage your name, email and mobile number.",
    href: "/account/profile",
    icon: UserRound,
  },
  {
    title: "Delivery Addresses",
    description: "Manage your saved delivery addresses.",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    title: "Change Password",
    description: "Update your account password securely.",
    href: "/account/change-password",
    icon: KeyRound,
  },
];

export function AccountOverview() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          My Account
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Hello, {customer.firstName}
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Manage your Royal Chins account, orders and delivery information.
        </p>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
        <OverviewCard
          title="Orders"
          value={stats.orders.toString()}
          description="Total orders"
          href="/account/orders"
          icon={ShoppingBag}
        />

        <OverviewCard
          title="Reviews"
          value={stats.pendingReviews.toString()}
          description={
            stats.pendingReviews === 1
              ? "Pending review"
              : "Pending reviews"
          }
          href="/account/reviews"
          icon={MessageSquareText}
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-base font-bold text-foreground sm:text-lg">
              Recent Order
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Your latest Royal Chins purchase
            </p>
          </div>

          <Link
            href="/account/orders"
            className="shrink-0 text-xs font-bold text-primary hover:underline sm:text-sm"
          >
            View All
          </Link>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Order Number
              </p>

              <Link
                href={`/account/orders/${recentOrder.id}`}
                className="mt-1 block text-base font-bold text-foreground transition-colors hover:text-primary"
              >
                #{recentOrder.id}
              </Link>

              <p className="mt-1 text-xs text-muted-foreground">
                {recentOrder.date}
              </p>
            </div>

            <OrderStatus status={recentOrder.status} />
          </div>

          <div className="my-5 border-t border-border" />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              {recentOrder.items.map((item, index) => (
                <div
                  key={item.id}
                  title={item.name}
                  className={`relative h-[66px] w-[66px] overflow-hidden rounded-xl border-2 border-background bg-surface-subtle sm:h-[76px] sm:w-[76px] ${
                    index > 0 ? "-ml-3" : ""
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="76px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between gap-5 sm:flex-col sm:items-end">
              <div className="sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Total
                </p>

                <p className="mt-1 text-xl font-bold text-primary">
                  AED {recentOrder.total.toLocaleString()}
                </p>
              </div>

              <Button
                asChild
                variant="primary"
                className="h-10 rounded-xl px-4 text-xs font-bold"
              >
                <Link href={`/account/orders/${recentOrder.id}`}>
                  View Order
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground">
            Account
          </h2>

          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage your personal and delivery information.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl">
          {accountLinks.map((item, index) => (
            <AccountLink
              key={item.href}
              {...item}
              bordered={index !== accountLinks.length - 1}
            />
          ))}
        </div>
      </section>

      <HelpSection />
    </div>
  );
}

function OverviewCard({
  title,
  value,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-background p-4 shadow-sm transition-all hover:border-primary/30 sm:rounded-3xl sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>

        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </div>

      <p className="mt-5 text-2xl font-bold text-foreground sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-sm font-bold text-foreground">
        {title}
      </p>

      <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
        {description}
      </p>
    </Link>
  );
}

function AccountLink({
  title,
  description,
  href,
  icon: Icon,
  bordered,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  bordered: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 p-4 transition-colors hover:bg-surface-subtle sm:gap-4 sm:px-5 sm:py-5 ${
        bordered ? "border-b border-border" : ""
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}

function OrderStatus({
  status,
}: {
  status: string;
}) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
      <CheckCircle2 className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

function HelpSection() {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl bg-secondary p-5 text-secondary-foreground sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
            Need Help?
          </p>

          <h2 className="mt-2 text-xl font-bold">
            We're here for you
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 opacity-70">
            Contact Royal Chins if you need help with an order, delivery or
            your account.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 md:min-w-[330px]">
          <a
            href="tel:+971507801110"
            className="flex min-h-[78px] flex-col items-center justify-center rounded-xl bg-background/10 px-2 text-center transition-colors hover:bg-background/15"
          >
            <Phone className="h-5 w-5" />

            <span className="mt-2 text-[11px] font-bold">
              Call
            </span>
          </a>

          <a
            href="https://wa.me/971507801110"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[78px] flex-col items-center justify-center rounded-xl bg-background/10 px-2 text-center transition-colors hover:bg-background/15"
          >
            <MessageSquareText className="h-5 w-5" />

            <span className="mt-2 text-[11px] font-bold">
              WhatsApp
            </span>
          </a>

          <a
            href="mailto:hello@royalchins.ae"
            className="flex min-h-[78px] flex-col items-center justify-center rounded-xl bg-background/10 px-2 text-center transition-colors hover:bg-background/15"
          >
            <Mail className="h-5 w-5" />

            <span className="mt-2 text-[11px] font-bold">
              Email
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}