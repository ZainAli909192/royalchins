"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  CircleDollarSign,
  ClipboardList,
  Ellipsis,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  PawPrint,
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
    label: "Animals",
    href: "/admin/animals",
    icon: PawPrint,
  },
  {
    label: "Accessories",
    href: "/admin/accessories",
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
    label: "Animals",
    href: "/admin/animals",
    icon: PawPrint,
  },
];

export function AdminMobileNav({
  open,
  onOpen,
  onClose,
}: AdminMobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    clearAdminSession();
    onClose();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          open ? "visible" : "invisible"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close menu"
        />

        <aside
          className={`absolute bottom-0 left-0 top-0 flex w-[290px] max-w-[85vw] flex-col bg-secondary text-secondary-foreground transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-4">
            <Image
              src="/logo.png"
              alt="Royal Chins"
              width={140}
              height={80}
              className="h-auto w-[120px] object-contain"
            />

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                    />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="shrink-0 border-t border-white/10 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-12 w-full items-center gap-3 rounded-lg px-4 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid h-[74px] grid-cols-4 border-t border-border bg-white px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-xs ${
                active
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={open ? onClose : onOpen}
          className={`flex flex-col items-center justify-center gap-1 text-xs ${
            open
              ? "font-semibold text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Ellipsis className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}