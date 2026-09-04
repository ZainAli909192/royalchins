import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Small Pets & Accessories UAE",
  description: "Explore pets and carefully selected small pet accessories from Royal Chins in the UAE.",
  alternates: { canonical: "/product" },
};

export default function ProductLayout({ children }: { children: ReactNode }) {
  return children;
}
