import {
  Box,
  Layers3,
  PackageOpen,
  Ruler,
  Tag,
  Weight,
} from "lucide-react";

type AccessoryDetailsProps = {
  category: string;
  suitableFor: string;
  material?: string;
  size?: string;
  weight?: string;
  brand?: string;
};

export function AccessoryDetails({
  category,
  suitableFor,
  material,
  size,
  weight,
  brand,
}: AccessoryDetailsProps) {
  const details = [
    {
      label: "Category",
      value: category,
      icon: PackageOpen,
    },
    {
      label: "Suitable For",
      value: suitableFor,
      icon: Box,
    },
    {
      label: "Material",
      value: material ?? "—",
      icon: Layers3,
    },
    {
      label: "Size",
      value: size ?? "—",
      icon: Ruler,
    },
    {
      label: "Weight",
      value: weight ?? "—",
      icon: Weight,
    },
    {
      label: "Brand",
      value: brand ?? "—",
      icon: Tag,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-bold text-foreground sm:text-lg">
        Product Details
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {details.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-xl bg-surface-subtle p-3.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon
                  className="h-4.5 w-4.5"
                  strokeWidth={2}
                />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}