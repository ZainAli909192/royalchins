"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  Boxes,
  CircleDollarSign,
  ClipboardList,
  Ellipsis,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  RotateCcw,
  Settings,
  Star,
  Tags,
  Truck,
  Users,
  X,
} from "lucide-react";

import { clearAdminSession } from "@/lib/auth/admin-auth";

type AdminMobileNavProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CircleDollarSign,
  },
  {
    label: "Refunds",
    href: "/admin/refunds",
    icon: RotateCcw,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    label: "Pages / FAQ",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    label: "Delivery Fees",
    href: "/admin/delivery-fees",
    icon: Truck,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const bottomItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
];

export function AdminMobileNav({
  open,
  onOpen,
  onClose,
}: AdminMobileNavProps) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const isActive = (
    href: string
  ) => {
    if (
      href ===
      "/admin/dashboard"
    ) {
      return (
        pathname === href
      );
    }

    return pathname.startsWith(
      href
    );
  };

  const handleLogout =
    () => {
      clearAdminSession();

      onClose();

      router.push(
        "/admin/login"
      );

      router.refresh();
    };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          open
            ? "visible"
            : "invisible"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute inset-0 bg-black/55 backdrop-blur-[1px] transition-opacity duration-300 ${
            open
              ? "opacity-100"
              : "opacity-0"
          }`}
          aria-label="Close menu"
        />

        <aside
          className={`absolute bottom-0 left-0 top-0 flex w-[300px] max-w-[86vw] flex-col overflow-hidden bg-secondary text-secondary-foreground shadow-2xl transition-transform duration-300 ease-out ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
<div className="flex h-14 shrink-0 items-center justify-end border-b border-white/10 px-3">
  <button
    type="button"
    onClick={onClose}
    className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    aria-label="Close menu"
  >
    <X className="h-5 w-5" />
  </button>
</div>

<nav className="mobile-admin-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-2">
  <div className="space-y-1">
    {menuItems.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className={`group flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium transition-all ${
            active
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-white/75 hover:bg-white/10 hover:text-white"
          }`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
              active
                ? "bg-white/10"
                : "bg-transparent group-hover:bg-white/5"
            }`}
          >
            <Icon
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </div>

          <span className="truncate">
            {item.label}
          </span>
        </Link>
      );
    })}
  </div>
</nav>

          <div className="shrink-0 border-t border-white/10 bg-secondary p-3">
            <button
              type="button"
              onClick={
                handleLogout
              }
              className="flex h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                <LogOut className="h-5 w-5" />
              </div>

              <span>
                Logout
              </span>
            </button>
          </div>
        </aside>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid h-[74px] grid-cols-4 border-t border-border bg-white px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden">
        {bottomItems.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              isActive(
                item.href
              );

            return (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className={`flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
                  active
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />

                <span>
                  {
                    item.label
                  }
                </span>
              </Link>
            );
          }
        )}

        <button
          type="button"
          onClick={
            open
              ? onClose
              : onOpen
          }
          className={`flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
            open
              ? "font-semibold text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Ellipsis className="h-5 w-5" />

          <span>
            More
          </span>
        </button>
      </nav>

      <style jsx global>{`
        .mobile-admin-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2)
            transparent;
        }

        .mobile-admin-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .mobile-admin-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .mobile-admin-scroll::-webkit-scrollbar-thumb {
          background: rgba(
            255,
            255,
            255,
            0.18
          );
          border-radius: 999px;
        }

        .mobile-admin-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(
            255,
            255,
            255,
            0.3
          );
        }
      `}</style>
    </>
  );
}