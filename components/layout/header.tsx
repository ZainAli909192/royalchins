"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";

export function StoreHeader() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const cartCount = 2;

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value =
      search.trim();

    if (!value) {
      router.push("/");
      return;
    }

    router.push(
      `/?search=${encodeURIComponent(value)}`
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center gap-4 lg:h-20">
          <Link
            href="/"
            aria-label="Royal Chins home"
            className="shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Royal Chins"
              width={150}
              height={70}
              priority
              className="h-[52px] w-[105px] object-contain sm:w-[115px] lg:h-[60px] lg:w-[135px]"
            />
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 flex-1 lg:block"
          >
            <div className="relative mx-auto max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search animals & accessories..."
                className="h-12 w-full rounded-xl border border-border bg-surface-subtle pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/contact"
              className="hidden h-10 items-center rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-subtle xl:flex"
            >
              Contact
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-surface-subtle lg:h-11 lg:w-auto lg:gap-2 lg:px-3"
            >
              <ShoppingBag className="h-5 w-5" />

              <span className="hidden text-sm font-medium lg:inline">
                Cart
              </span>

              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground lg:-right-1 lg:-top-1">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-label="My account"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-surface-subtle lg:h-11 lg:w-auto lg:gap-2 lg:px-3"
            >
              <UserRound className="h-5 w-5" />

              <span className="hidden text-sm font-medium lg:inline">
                Account
              </span>
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="pb-3 lg:hidden"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search animals & accessories..."
              className="h-11 w-full rounded-xl border border-border bg-surface-subtle pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </form>
      </div>
    </header>
  );
}