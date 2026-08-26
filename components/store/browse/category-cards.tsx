import Link from "next/link";
import { ArrowRight, PackageOpen, PawPrint, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Animals",
    href: "/animals",
    description: "Meet healthy, well-cared-for companions ready for their new home.",
    action: "Meet the animals",
    eyebrow: "Live companions",
    icon: PawPrint,
    tone: "primary",
  },
  {
    name: "Accessories",
    href: "/accessories",
    description: "Shop habitats, nutrition and daily essentials selected with care.",
    action: "Shop essentials",
    eyebrow: "Curated supplies",
    icon: PackageOpen,
    tone: "secondary",
  },
] as const;

export function CategoryCards() {
  return (
    <section
      aria-labelledby="category-heading"
      className="hidden sm:block"
    >
      
    </section>
  );
}
