import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function LegacyAnimalsLayout({ children }: { children: ReactNode }) {
  return children;
}
