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
  type FormEvent,
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
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(
        value
      )}`
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-black">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[82px] items-center gap-3 lg:h-20">
          <Link
            href="/"
            aria-label="Royal Chins home"
            className="shrink-0"
          >
            <div className="flex h-[56px] w-[120px] items-center justify-center rounded-[22px] bg-white px-3 sm:w-[135px] lg:h-auto lg:w-auto lg:rounded-none lg:bg-transparent lg:p-0">
              <Image
                src="/logo.png"
                alt="Royal Chins"
                width={150}
                height={70}
                priority
                className="h-[42px] w-[95px] object-contain lg:h-[60px] lg:w-[135px]"
              />
            </div>
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
                placeholder="Search pets & accessories..."
                className="h-12 w-full rounded-xl border border-border bg-surface-subtle pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href="/contact"
              className="hidden h-10 items-center rounded-lg px-3 text-sm font-medium text-white transition-colors hover:bg-white/10 xl:flex"
            >
              Contact
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15 lg:w-auto lg:gap-2 lg:rounded-xl lg:px-3"
            >
              <ShoppingBag className="h-5 w-5" />

              <span className="hidden text-sm font-medium lg:inline">
                Cart
              </span>

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-label="My account"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15 lg:w-auto lg:gap-2 lg:rounded-xl lg:px-3"
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
          className="pb-4 lg:hidden"
        >
          <div className="flex overflow-hidden rounded-full border-2 border-primary bg-white">
            <div className="relative min-w-0 flex-1">
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search pets & accessories..."
                className="h-12 w-full bg-white px-5 pr-11 text-base text-black outline-none placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="submit"
              aria-label="Search"
              className="flex h-12 w-16 shrink-0 items-center justify-center bg-primary text-white transition-opacity hover:opacity-90"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
