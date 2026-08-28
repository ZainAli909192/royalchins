import {
  BadgeCheck,
  CircleDot,
  MapPin,
  Palette,
  PawPrint,
  Ruler,
  UserRound,
} from "lucide-react";

type AnimalDetailsProps = {
  category: string;
  gender: string;
  age: string;
  color: string;
  weight: string;
  temperament: string;
  availability: string;
  origin: string;
};

export function AnimalDetails({
  category,
  gender,
  age,
  color,
  weight,
  temperament,
  availability,
  origin,
}: AnimalDetailsProps) {
  const details = [
    {
      label: "Category",
      value: category,
      icon: PawPrint,
    },
    {
      label: "Gender",
      value: gender,
      icon: UserRound,
    },
    {
      label: "Age",
      value: age,
      icon: CircleDot,
    },
    {
      label: "Color / Mutation",
      value: color,
      icon: Palette,
    },
    {
      label: "Weight",
      value: weight,
      icon: Ruler,
    },
    {
      label: "Temperament",
      value: temperament,
      icon: BadgeCheck,
    },
    {
      label: "Availability",
      value: availability,
      icon: CircleDot,
    },
    {
      label: "Origin",
      value: origin,
      icon: MapPin,
    },
  ];

  return (
    <div className="h-full rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Profile
          </p>
          <h2 className="mt-1 text-lg font-bold text-foreground">
            Animal details
          </h2>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PawPrint aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
        </span>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {details.map((item) => {
          const Icon = item.icon;

          const isAvailability =
            item.label === "Availability";

          return (
            <div
              key={item.label}
              className="flex min-h-[82px] items-center gap-3 rounded-xl border border-transparent bg-surface-subtle p-3.5 transition-colors hover:border-primary/15"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-primary ring-1 ring-primary/10">
                <Icon
                  className="h-4.5 w-4.5"
                  strokeWidth={2}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {item.label}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  {isAvailability && (
                    <span
                      className={`h-2 w-2 rounded-full ${
                        availability
                          .toLowerCase()
                          .includes("stock")
                          ? "bg-success"
                          : "bg-error"
                      }`}
                    />
                  )}

                  <p className="text-sm font-bold text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
