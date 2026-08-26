"use client";

import Link from "next/link";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import {
  House,
  LayoutGrid,
  PawPrint,
  ShoppingCart,
  UserRound,
} from "lucide-react";

type NavItemType = {
  id: string;
  label: string;
  href: string;
  icon?: React.ElementType;
  logo?: boolean;
  badge?: number;
};

const navItems: NavItemType[] = [
  {
    id: "browse",
    label: "Browse",
    href: "/?browse=all",
    icon: PawPrint,
  },
  {
    id: "categories",
    label: "Categories",
    href: "/?browse=categories",
    icon: LayoutGrid,
  },
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: House,
  },
  {
    id: "cart",
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
    badge: 2,
  },
  {
    id: "account",
    label: "Account",
    href: "/account",
    icon: UserRound,
  },
];

export function StoreMobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const browseMode = searchParams.get("browse");

  const isActive = (item: NavItemType) => {
    if (item.id === "home") {
      return pathname === "/" && !browseMode;
    }

    if (item.id === "browse") {
      return (
        pathname === "/" &&
        browseMode === "all"
      );
    }

    if (item.id === "categories") {
      return (
        pathname === "/" &&
        browseMode === "categories"
      );
    }

    if (item.id === "cart") {
      return pathname.startsWith("/cart");
    }

    if (item.id === "account") {
      return pathname.startsWith("/account");
    }

    return false;
  };

  return (
    <nav
      aria-label="Store navigation"
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[calc(8px+env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="relative mx-auto h-[76px] max-w-[520px] overflow-hidden rounded-[24px] border border-border bg-background/95 shadow-lg backdrop-blur-xl">
        <div className="relative z-10 grid h-full grid-cols-5 px-1.5">
          {navItems.map((item) => (
            <MobileNavItem
              key={item.id}
              item={item}
              active={isActive(item)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

type MobileNavItemProps = {
  item: NavItemType;
  active: boolean;
};

function MobileNavItem({
  item,
  active,
}: MobileNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex min-w-0 touch-manipulation flex-col items-center justify-center rounded-[18px] px-1 py-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset motion-reduce:transition-none ${
        active
          ? "text-primary"
          : "text-muted-foreground hover:bg-surface-subtle hover:text-foreground"
      }`}
    >
      <span
        className={`relative flex h-10 w-12 items-center justify-center rounded-2xl transition-all duration-200 motion-reduce:transition-none ${
          active
            ? "bg-primary text-primary-foreground shadow-primary"
            : "bg-transparent text-current group-active:bg-surface-subtle"
        }`}
      >
        {Icon ? (
          <Icon
            className="h-[23px] w-[23px]"
            strokeWidth={active ? 2.3 : 1.9}
          />
        ) : null}

        {item.badge !== undefined && item.badge > 0 && (
          <CartBadge value={item.badge} />
        )}
      </span>

      <span
        className={`mt-0.5 max-w-full truncate text-center text-[11px] leading-none ${
          active ? "font-bold" : "font-medium"
        }`}
      >
        {item.label}
      </span>

      <span
        aria-hidden="true"
        className={`absolute bottom-1 h-1 w-1 rounded-full bg-primary transition-opacity duration-200 motion-reduce:transition-none ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </Link>
  );
}

function CartBadge({
  value,
}: {
  value: number;
}) {
  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-background">
      {value > 99 ? "99+" : value}
    </span>
  );
}