"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageCircleMore,
  PackageOpen,
  PawPrint,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { getCartCount } from "@/lib/store/cart-storage";
import { useStoreSettings } from "@/components/store/layout/store-settings-provider";

export  function StoreHeader() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const { brand } = useStoreSettings();
  const accountHref = customerName ? "/account" : "/auth/login";

  useEffect(() => {
    const refreshCart = () => setCartCount(getCartCount());
    refreshCart();
    window.addEventListener("storage", refreshCart);
    window.addEventListener("royalchins-cart-updated", refreshCart);
    const refreshAccount = () => fetch("/api/store/auth/session").then(async (response) => ({ response, data: await response.json().catch(() => null) })).then(({ response, data }) => setCustomerName(response.ok ? data.customer.name : null)).catch(() => setCustomerName(null));
    refreshAccount();
    window.addEventListener("royalchins-auth-changed", refreshAccount);
    return () => { window.removeEventListener("storage", refreshCart); window.removeEventListener("royalchins-cart-updated", refreshCart); window.removeEventListener("royalchins-auth-changed", refreshAccount); };
  }, []);

  useEffect(() => {
    const value = search.trim();
    if (!value) return;
    const timer = window.setTimeout(() => router.push(`/search?q=${encodeURIComponent(value)}`), 280);
    return () => window.clearTimeout(timer);
  }, [router, search]);

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = search.trim();

    router.push(
      value
        ? `/search?q=${encodeURIComponent(value)}`
        : "/search"
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-secondary text-secondary-foreground shadow-lg">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-3 lg:h-[82px] lg:gap-5">
          <Link
            href="/"
            aria-label={`${brand.storeName} home`}
            className="flex h-14 shrink-0 items-center justify-center rounded-xl bg-background px-2 shadow-sm transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary motion-reduce:transition-none lg:h-16 lg:px-3"
          >
            <img
              src={brand.logo || "/logo.png"}
              alt={brand.storeName}
              className="h-[50px] w-[105px] object-contain lg:h-[58px] lg:w-[132px]"
            />
          </Link>

          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden min-w-0 flex-1 lg:block"
          >
            <div className="mx-auto flex h-[52px] max-w-3xl overflow-hidden rounded-xl bg-background shadow-md ring-2 ring-transparent transition duration-200 focus-within:ring-primary motion-reduce:transition-none">
              <span className="flex shrink-0 items-center border-r border-border bg-surface-subtle px-4 text-sm font-semibold text-foreground">
                All
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              placeholder={`Search ${brand.storeName}`}
              aria-label={`Search ${brand.storeName}`}
                className="min-w-0 flex-1 bg-background px-4 text-base text-foreground outline-none placeholder:text-muted-foreground"
              />

              <SearchButton />
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
           

            <Link href={accountHref} aria-label="My account" className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/10 text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground lg:hidden">
              <UserRound className="h-5 w-5" strokeWidth={2} />
            </Link>

            <Link href="/cart" aria-label={`Cart with ${cartCount} items`} className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-background/10 text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground lg:hidden">
              <ShoppingCart className="h-5 w-5" strokeWidth={2} />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-secondary">{cartCount > 99 ? "99+" : cartCount}</span>}
            </Link>

            <HeaderAction
              href={accountHref}
              ariaLabel="My account"
              icon={UserRound}
              eyebrow={customerName ? `Hello, ${customerName.split(" ")[0]}` : "Hello, sign in"}
              label="Account"
              className="hidden lg:flex"
            />

            <Link
              href="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className="group relative hidden h-12 items-center gap-2 rounded-xl px-2 text-secondary-foreground transition-colors duration-200 hover:bg-background/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none md:flex sm:px-2.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                <ShoppingCart
                  className="h-6 w-6"
                  strokeWidth={2}
                />
              </span>

              <span className="hidden text-sm font-bold xl:block">
                Cart
              </span>

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-secondary">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          role="search"
          className="pb-3 lg:hidden"
        >
          <div className="flex h-12 overflow-hidden rounded-xl bg-background shadow-md ring-2 ring-transparent focus-within:ring-primary">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={`Search ${brand.storeName}`}
              aria-label={`Search ${brand.storeName}`}
              className="min-w-0 flex-1 bg-background px-4 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />

            <SearchButton compact />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link href="/search?type=Animal" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-background/15 bg-background/10 px-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <PawPrint className="h-4 w-4" /> Pets
            </Link>
            <Link href="/search?type=Accessory" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-background/15 bg-background/10 px-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <PackageOpen className="h-4 w-4" /> Accessories
            </Link>
          </div>
        </form>
      </div>
    </header>
  );
}

type HeaderActionProps = {
  href: string;
  ariaLabel: string;
  icon: React.ElementType;
  eyebrow: string;
  label: string;
  className?: string;
};

function HeaderAction({
  href,
  ariaLabel,
  icon: Icon,
  eyebrow,
  label,
  className = "flex",
}: HeaderActionProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`group h-12 items-center gap-2 rounded-xl px-2 text-secondary-foreground transition-colors duration-200 hover:bg-background/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none sm:px-2.5 ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon
          className="h-[22px] w-[22px]"
          strokeWidth={2}
        />
      </span>

      <span className="hidden text-left xl:block">
        <span className="block text-[11px] leading-tight text-secondary-foreground/70">
          {eyebrow}
        </span>

        <span className="block text-sm font-bold leading-tight">
          {label}
        </span>
      </span>
    </Link>
  );
}

function SearchButton({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <button
      type="submit"
      aria-label="Search store"
      className={`${
        compact ? "w-13" : "w-[58px]"
      } flex shrink-0 items-center justify-center bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-foreground motion-reduce:transition-none`}
    >
      <Search
        className={
          compact
            ? "h-5 w-5"
            : "h-6 w-6"
        }
        strokeWidth={2.2}
      />
    </button>
  );
}
