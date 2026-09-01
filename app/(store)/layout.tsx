import type { ReactNode } from "react";

import { StoreFooter } from "@/components/store/layout/store-footer";
import { StoreHeader } from "@/components/store/layout/store-header";
import { StoreSettingsProvider } from "@/components/store/layout/store-settings-provider";

type StoreLayoutProps = {
  children: ReactNode;
};

export default function StoreLayout({
  children,
}: StoreLayoutProps) {
  return (
    <StoreSettingsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <StoreHeader />

        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>

        <StoreFooter />
      </div>
    </StoreSettingsProvider>
  );
}
