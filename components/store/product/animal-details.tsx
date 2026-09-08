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
    <div className="h-full rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Profile
          </p>

          <h2 className="mt-1 text-lg font-bold text-foreground">
            Animal details
          </h2>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PawPrint
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={1.9}
          />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
        {details.map((item) => {
          const Icon = item.icon;

          const isAvailability =
            item.label === "Availability";

          const isUnavailable =
            availability
              .toLowerCase()
              .includes("sold") ||
            availability
              .toLowerCase()
              .includes("out");

          return (
            <div
              key={item.label}
              className="flex min-w-0 items-center gap-2 rounded-2xl border border-transparent bg-surface-subtle p-3 transition-colors hover:border-primary/15 sm:min-h-[82px] sm:gap-3 sm:p-3.5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-primary ring-1 ring-primary/10 sm:h-11 sm:w-11">
                <Icon
                  className="h-4 w-4 sm:h-4.5 sm:w-4.5"
                  strokeWidth={2}
                />
              </span>

              <div className="min-w-0 flex-1">
                <p className="break-words text-[9px] font-semibold uppercase leading-4 tracking-[0.06em] text-muted-foreground sm:text-[11px] sm:tracking-[0.08em]">
                  {item.label}
                </p>

                <div className="mt-1 flex min-w-0 items-start gap-1.5 sm:gap-2">
                  {isAvailability && (
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        isUnavailable
                          ? "bg-error"
                          : "bg-success"
                      }`}
                    />
                  )}

                  <p className="min-w-0 break-words text-sm font-bold leading-5 text-foreground sm:text-base">
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