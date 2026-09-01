"use client";

import {
  ChevronDown,
  PackageOpen,
  PawPrint,
} from "lucide-react";

export type ProductFilter =
  | "all"
  | "animals"
  | "accessories"
  | "chinchillas"
  | "guinea-pigs"
  | "micro-squirrels";

type ProductTypeFilterProps = {
  value: ProductFilter;
  onChange: (value: ProductFilter) => void;
  animalMenuOpen: boolean;
  onAnimalMenuToggle: () => void;
};

const animalOptions = [
  {
    label: "All Pets",
    value: "animals" as const,
  },
  {
    label: "Chinchillas",
    value: "chinchillas" as const,
  },
  {
    label: "Guinea Pigs",
    value: "guinea-pigs" as const,
  },
  {
    label: "Micro Squirrels",
    value: "micro-squirrels" as const,
  },
];

export function ProductTypeFilter({
  value,
  onChange,
  animalMenuOpen,
  onAnimalMenuToggle,
}: ProductTypeFilterProps) {
  const animalActive = [
    "animals",
    "chinchillas",
    "guinea-pigs",
    "micro-squirrels",
  ].includes(value);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={onAnimalMenuToggle}
          className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${
            animalActive
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
          }`}
        >
          <PawPrint
            className="h-4 w-4"
            strokeWidth={2}
          />

          Pets

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              animalMenuOpen
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {animalMenuOpen && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-30 min-w-[210px] overflow-hidden rounded-xl border border-border bg-background p-2 shadow-xl">
            {animalOptions.map((item) => {
              const active =
                value === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onChange(item.value)
                  }
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground hover:bg-surface-subtle"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          onChange("accessories")
        }
        className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${
          value === "accessories"
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
        }`}
      >
        <PackageOpen
          className="h-4 w-4"
          strokeWidth={2}
        />

        Accessories
      </button>

      {value !== "all" && (
        <button
          type="button"
          onClick={() =>
            onChange("all")
          }
          className="h-11 px-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          Clear
        </button>
      )}
    </div>
  );
}
