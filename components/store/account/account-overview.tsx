"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/store/shared/reveal";
import { Button } from "@/components/ui/button";
import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import { useStoreSettings } from "@/components/store/layout/store-settings-provider";

type CustomerData = {
  firstName: string;
  fullName: string;
  email: string;
  phone: string;
};

type AccountStats = {
  orders: number;
  pendingReviews: number;
};

type RecentOrder = {
  id: string;
  date: string;
  status: string;
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
  }[];
};

const accountLinks = [
  {
    title: "Profile Information",
    description:
      "Manage your name, email and mobile number.",
    href: "/account/profile",
    icon: UserRound,
  },
  {
    title: "Delivery Addresses",
    description:
      "Manage your saved delivery addresses.",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    title: "Change Password",
    description:
      "Update your account password securely.",
    href: "/account/change-password",
    icon: KeyRound,
  },
];

export function AccountOverview() {
  const router = useRouter();
  const { contact } = useStoreSettings();

  const [customerData, setCustomerData] =
    useState<CustomerData | null>(null);

  const [statsData, setStatsData] =
    useState<AccountStats | null>(null);

  const [recentOrderData, setRecentOrderData] =
    useState<RecentOrder | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [showLogout, setShowLogout] =
    useState(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const [logoutError, setLogoutError] =
    useState("");

  useEffect(() => {
    Promise.all([
      fetch(
        "/api/store/auth/session"
      ),

      fetch(
        "/api/store/account/orders"
      ),

      fetch(
        "/api/store/account/reviews"
      ),
    ])
      .then(
        async ([
          sessionResponse,
          ordersResponse,
          reviewsResponse,
        ]) => {
          const session =
            await sessionResponse.json();

          const orders =
            await ordersResponse.json();

          const reviews =
            await reviewsResponse.json();

          if (
            sessionResponse.ok
          ) {
            const parts =
              session.customer.name.split(
                /\s+/
              );

            setCustomerData({
              firstName:
                parts[0] ??
                "Customer",

              fullName:
                session.customer.name,

              email:
                session.customer.email,

              phone:
                session.customer.phone,
            });
          } else {
            router.replace("/auth/login");
            return;
          }

          if (
            ordersResponse.ok
          ) {
            setStatsData({
              orders:
                orders.length,

              pendingReviews:
                reviewsResponse.ok
                  ? reviews.reviewable
                      ?.length ??
                    0
                  : 0,
            });

            const order =
              orders[0];

            if (order) {
              setRecentOrderData({
                id:
                  order.orderNumber,

                date:
                  new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-AE",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  ),

                status:
                  order.orderStatus,

                total:
                  Number(
                    order.total
                  ),

                items:
                  order.items.map(
                    (item: {
                      id: string;
                      productName: string;
                      product: {
                        images: {
                          url: string;
                        }[];
                      } | null;
                    }) => ({
                      id:
                        item.id,

                      name:
                        item.productName,

                      image:
                        item.product
                          ?.images[0]
                          ?.url ??
                        "/placeholder.png",
                    })
                  ),
              });
            }
          }
        }
      )
      .catch(
        () => undefined
      )
      .finally(() =>
        setIsLoading(false)
      );
  }, [router]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setLogoutError("");
    setIsLoggingOut(true);

    try {
      const response =
        await fetch(
          "/api/store/auth/logout",
          {
            method: "POST",
          }
        );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ??
            "Unable to log out."
        );
      }

      setShowLogout(false);

      window.dispatchEvent(
        new Event("royalchins-auth-changed")
      );

      router.replace("/");

      router.refresh();
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Unable to log out."
      );
    } finally {
      setIsLoggingOut(
        false
      );
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <AdminPageLoader label="Loading your account" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Reveal
          direction="left"
          distance={40}
        >
          <header>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              My Account
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hello,{" "}
              {customerData?.firstName ??
                "Customer"}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Manage your Royal
              Chins account,
              orders and delivery
              information.
            </p>
          </header>
        </Reveal>

        <RevealGroup
          stagger={0.08}
          delay={0.05}
          className="mt-6 grid grid-cols-2 gap-3 sm:gap-4"
        >
          <RevealItem
            direction="scale"
            scaleFrom={0.94}
          >
            <OverviewCard
              title="Orders"
              value={(
                statsData?.orders ??
                0
              ).toString()}
              description="Total orders"
              href="/account/orders"
              icon={ShoppingBag}
            />
          </RevealItem>

          <RevealItem
            direction="scale"
            scaleFrom={0.94}
          >
            <OverviewCard
              title="Reviews"
              value={(
                statsData?.pendingReviews ??
                0
              ).toString()}
              description={
                statsData?.pendingReviews ===
                1
                  ? "Pending review"
                  : "Pending reviews"
              }
              href="/account/reviews"
              icon={
                MessageSquareText
              }
            />
          </RevealItem>
        </RevealGroup>

        <Reveal
          direction="up"
          distance={35}
          className="mt-6"
        >
          <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl">
            <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
              <div>
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  Recent Order
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Your latest
                  Royal Chins
                  purchase
                </p>
              </div>

              <Link
                href="/account/orders"
                className="shrink-0 text-xs font-bold text-primary hover:underline sm:text-sm"
              >
                View All
              </Link>
            </div>

            {recentOrderData ? (
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Order Number
                    </p>

                    <Link
                      href={`/account/orders/${recentOrderData.id}`}
                      className="mt-1 block text-base font-bold text-foreground transition-colors hover:text-primary"
                    >
                      #
                      {
                        recentOrderData.id
                      }
                    </Link>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {
                        recentOrderData.date
                      }
                    </p>
                  </div>

                  <Reveal
                    direction="scale"
                    scaleFrom={0.9}
                    delay={0.05}
                  >
                    <OrderStatus
                      status={
                        recentOrderData.status
                      }
                    />
                  </Reveal>
                </div>

                <div className="my-5 border-t border-border" />

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <RevealGroup
                    stagger={0.06}
                    className="flex items-center"
                  >
                    {recentOrderData.items.map(
                      (
                        item,
                        index
                      ) => (
                        <RevealItem
                          key={
                            item.id
                          }
                          direction="scale"
                          scaleFrom={
                            0.88
                          }
                        >
                          <div
                            title={
                              item.name
                            }
                            className={`relative h-[66px] w-[66px] overflow-hidden rounded-xl border-2 border-background bg-surface-subtle sm:h-[76px] sm:w-[76px] ${
                              index >
                              0
                                ? "-ml-3"
                                : ""
                            }`}
                          >
                            <Image
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              fill
                              unoptimized
                              sizes="76px"
                              className="object-cover"
                            />
                          </div>
                        </RevealItem>
                      )
                    )}
                  </RevealGroup>

                  <Reveal
                    direction="right"
                    distance={30}
                  >
                    <div className="flex items-end justify-between gap-5 sm:flex-col sm:items-end">
                      <div className="sm:text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                          Total
                        </p>

                        <p className="mt-1 text-xl font-bold text-primary">
                          AED{" "}
                          {recentOrderData.total.toLocaleString()}
                        </p>
                      </div>

                      <Button
                        asChild
                        variant="primary"
                        className="h-10 rounded-xl px-4 text-xs font-bold"
                      >
                        <Link
                          href={`/account/orders/${recentOrderData.id}`}
                          className="whitespace-nowrap"
                        >
                          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                            <span>
                              View
                              Order
                            </span>

                            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </Reveal>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="font-semibold text-foreground">
                  No orders yet
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your completed
                  purchases will
                  appear here.
                </p>

                <Button
                  asChild
                  variant="primary"
                  className="mt-5 rounded-xl px-4 text-sm font-bold"
                >
                  <Link href="/">
                    Browse pets
                    and
                    accessories
                  </Link>
                </Button>
              </div>
            )}
          </section>
        </Reveal>

        <Reveal
          direction="left"
          distance={30}
          className="mt-6"
        >
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground">
                Account
              </h2>

              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Manage your
                personal and
                delivery
                information.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl">
              <RevealGroup
                stagger={0.07}
              >
                {accountLinks.map(
                  (item) => (
                    <RevealItem
                      key={
                        item.href
                      }
                      direction="right"
                      distance={20}
                    >
                      <AccountLink
                        {...item}
                        bordered
                      />
                    </RevealItem>
                  )
                )}

                <RevealItem
                  direction="right"
                  distance={20}
                >
                  <LogoutLink
                    onClick={() => {
                      setLogoutError(
                        ""
                      );

                      setShowLogout(
                        true
                      );
                    }}
                  />
                </RevealItem>
              </RevealGroup>
            </div>
          </section>
        </Reveal>

        <Reveal
          direction="up"
          distance={35}
          className="mt-6"
        >
          <HelpSection contact={contact} />
        </Reveal>
      </div>

      {showLogout && (
        <LogoutModal
          isLoggingOut={
            isLoggingOut
          }
          error={logoutError}
          onClose={() => {
            if (
              isLoggingOut
            ) {
              return;
            }

            setLogoutError(
              ""
            );

            setShowLogout(
              false
            );
          }}
          onConfirm={
            handleLogout
          }
        />
      )}
    </>
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
      className="group block h-full rounded-2xl border border-border bg-background p-4 shadow-sm transition-all hover:border-primary/30 sm:rounded-3xl sm:p-5"
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
        bordered
          ? "border-b border-border"
          : ""
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

function LogoutLink({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-error/5 sm:gap-4 sm:px-5 sm:py-5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
        <LogOut className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-error">
          Logout
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Sign out of your
          Royal Chins account.
        </p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-error" />
    </button>
  );
}

function LogoutModal({
  isLoggingOut,
  error,
  onClose,
  onConfirm,
}: {
  isLoggingOut: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={
        onClose
      }
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        onMouseDown={(
          event
        ) =>
          event.stopPropagation()
        }
        className="relative w-full max-w-md rounded-3xl border border-border bg-background p-5 shadow-xl sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={
            isLoggingOut
          }
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
          <LogOut className="h-5 w-5" />
        </span>

        <h2
          id="logout-title"
          className="mt-5 text-xl font-bold text-foreground"
        >
          Logout?
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Are you sure you want
          to sign out of your
          Royal Chins account?
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={
              isLoggingOut
            }
            onClick={onClose}
            className="h-11 rounded-xl px-5"
          >
            Stay Logged In
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={
              isLoggingOut
            }
            onClick={
              onConfirm
            }
            className="h-11 rounded-xl px-5"
          >
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <LogOut className="h-4 w-4 shrink-0" />

              <span>
                {isLoggingOut
                  ? "Logging out..."
                  : "Logout"}
              </span>
            </span>
          </Button>
        </div>
      </div>
    </div>
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

function HelpSection({
  contact,
}: {
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
  };
}) {
  const callNumber = contact.phone.replace(/[^\d+]/g, "");
  const whatsappNumber = contact.whatsapp.replace(/\D/g, "");

  return (
    <section className="overflow-hidden rounded-2xl bg-secondary p-5 text-secondary-foreground sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
            Need Help?
          </p>

          <h2 className="mt-2 text-xl font-bold">
            We&apos;re here for you
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 opacity-70">
            Contact Royal Chins
            if you need help
            with an order,
            delivery or your
            account.
          </p>
        </div>

        <RevealGroup
          stagger={0.08}
          className="grid grid-cols-3 gap-2 md:min-w-[330px]"
        >
          <RevealItem
            direction="scale"
            scaleFrom={0.92}
          >
            <a
              href={`tel:${callNumber}`}
              className="flex min-h-[78px] flex-col items-center justify-center rounded-xl bg-background/10 px-2 text-center transition-colors hover:bg-background/15"
            >
              <Phone className="h-5 w-5" />

              <span className="mt-2 text-[11px] font-bold">
                Call
              </span>
            </a>
          </RevealItem>

          <RevealItem
            direction="scale"
            scaleFrom={0.92}
          >
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[78px] flex-col items-center justify-center rounded-xl bg-background/10 px-2 text-center transition-colors hover:bg-background/15"
            >
              <MessageSquareText className="h-5 w-5" />

              <span className="mt-2 text-[11px] font-bold">
                WhatsApp
              </span>
            </a>
          </RevealItem>

          <RevealItem
            direction="scale"
            scaleFrom={0.92}
          >
            <a
              href={`mailto:${contact.email}`}
              className="flex min-h-[78px] flex-col items-center justify-center rounded-xl bg-background/10 px-2 text-center transition-colors hover:bg-background/15"
            >
              <Mail className="h-5 w-5" />

              <span className="mt-2 text-[11px] font-bold">
                Email
              </span>
            </a>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
