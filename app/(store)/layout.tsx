import type { ReactNode } from "react";

import { StoreFooter } from "@/components/store/layout/store-footer";
import { StoreHeader } from "@/components/store/layout/store-header";
import { StoreMobileNav } from "@/components/store/layout/store-mobile-nav";

type StoreLayoutProps = {
  children: ReactNode;
};

export default function StoreLayout({
  children,
}: StoreLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="min-h-[calc(100vh-80px)] pb-28 lg:pb-0">
        {children}
      </main>

      <StoreFooter />

      <StoreMobileNav />
    </div>
  );
}