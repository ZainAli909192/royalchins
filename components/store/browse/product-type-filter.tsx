"use client";

import { ChevronDown, PackageOpen, PawPrint } from "lucide-react";

export type ProductFilter = string;
export type StoreCategory = { id: string; name: string; slug: string; type: "Animal" | "Accessory"; imageUrl: string | null };

type ProductTypeFilterProps = {
  value: ProductFilter;
  onChange: (value: ProductFilter) => void;
  categories: StoreCategory[];
  openType: "Animal" | "Accessory" | null;
  onMenuToggle: (type: "Animal" | "Accessory") => void;
};

export function ProductTypeFilter({ value, onChange, categories, openType, onMenuToggle }: ProductTypeFilterProps) {
  const renderMenu = (type: "Animal" | "Accessory") => {
    const label = type === "Animal" ? "Pets" : "Accessories";
    const allValue = type === "Animal" ? "animals" : "accessories";
    const Icon = type === "Animal" ? PawPrint : PackageOpen;
    const items = categories.filter((category) => category.type === type);

    return <div className="relative">
      <button type="button" aria-expanded={openType === type} onClick={() => onMenuToggle(type)} className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${value === allValue || items.some((category) => category.slug === value) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:text-primary"}`}>
        <Icon className="h-4 w-4" strokeWidth={2} />{label}<ChevronDown className={`h-4 w-4 transition-transform ${openType === type ? "rotate-180" : ""}`} />
      </button>
      {openType === type && <div className="absolute left-0 top-[calc(100%+8px)] z-30 min-w-[250px] overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-xl">
        <button type="button" onClick={() => onChange(allValue)} className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${value === allValue ? "bg-primary/10 font-semibold text-primary" : "text-foreground hover:bg-surface-subtle"}`}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-subtle"><Icon className="h-5 w-5" /></span>All {label}
        </button>
        {items.map((category) => <button key={category.id} type="button" onClick={() => onChange(category.slug)} className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${value === category.slug ? "bg-primary/10 font-semibold text-primary" : "text-foreground hover:bg-surface-subtle"}`}>
          {category.imageUrl ? <img src={category.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" /> : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-subtle"><Icon className="h-5 w-5" /></span>}
          {category.name}
        </button>)}
      </div>}
    </div>;
  };

  return <div className="flex flex-wrap items-center gap-2">{renderMenu("Animal")}{renderMenu("Accessory")}{value !== "all" && <button type="button" onClick={() => onChange("all")} className="h-11 px-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">Clear</button>}</div>;
}
