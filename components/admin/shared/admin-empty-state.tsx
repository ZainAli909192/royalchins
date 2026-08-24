import {
  PackageOpen,
  SearchX,
  Users,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

type AdminEmptyStateType =
  | "default"
  | "search"
  | "orders"
  | "customers";

type AdminEmptyStateProps = {
  type?: AdminEmptyStateType;

  title?: string;
  description?: string;

  actionLabel?: string;
  onAction?: () => void;

  className?: string;
};

type EmptyStateConfig = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const stateConfig: Record<
  AdminEmptyStateType,
  EmptyStateConfig
> = {
  default: {
    icon: PackageOpen,
    title: "No data available",
    description:
      "There is currently no information to display.",
  },

  search: {
    icon: SearchX,
    title: "No results found",
    description:
      "Try changing your search or filters.",
  },

  orders: {
    icon: ClipboardList,
    title: "No orders yet",
    description:
      "New customer orders will appear here.",
  },

  customers: {
    icon: Users,
    title: "No customers yet",
    description:
      "Customer accounts will appear here once registered.",
  },
};

export function AdminEmptyState({
  type = "default",

  title,
  description,

  actionLabel,
  onAction,

  className = "",
}: AdminEmptyStateProps) {
  const config = stateConfig[type];
  const Icon = config.icon;

  return (
    <EmptyState
      icon={
        <Icon
          className="h-7 w-7 sm:h-8 sm:w-8"
          aria-hidden="true"
        />
      }
      title={title ?? config.title}
      description={
        description ?? config.description
      }
      action={
        actionLabel && onAction ? (
          <Button
            variant="primary"
            onClick={onAction}
            className="w-full sm:w-auto"
          >
            {actionLabel}
          </Button>
        ) : undefined
      }
      className={[
        "min-h-[260px]",
        "rounded-xl",
        "border border-border",
        "bg-surface",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}