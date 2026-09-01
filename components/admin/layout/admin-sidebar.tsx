"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  CircleDollarSign,
  ClipboardList,
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
} from "lucide-react";

import { clearAdminSession } from "@/lib/auth/admin-auth";

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

export function AdminSidebar() {
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
    router.push("/admin/login");
    router.refresh();
  };

  return (
<aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col bg-secondary text-secondary-foreground lg:flex">      <div className="flex h-[130px] items-center justify-center border-b border-white/10 px-6 border-rounded rounded-full">
        <Image
          src="/logo.png"
          alt="Royal Chins"
          width={180}
          height={100}
          priority
          className="h-auto max-h-[90px] w-[160px] object-contain "
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium transition-colors ${
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

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-12 w-full items-center gap-3 rounded-lg px-4 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut
            className="h-5 w-5"
            strokeWidth={1.8}
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}