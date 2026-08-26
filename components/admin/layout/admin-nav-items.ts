import {
  Boxes,
  CircleDollarSign,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  RotateCcw,
  Settings,
  Star,
  Tags,
  Truck,
  UserRound,
  Users,
} from "lucide-react";

export const adminNavItems = [
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
  {
    label: "Profile",
    href: "/admin/profile",
    icon: UserRound,
  },
];

export const adminMobileBottomItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  
];