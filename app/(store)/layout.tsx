import type { ReactNode } from "react";
import type { Metadata } from "next";

import { StoreFooter } from "@/components/store/layout/store-footer";
import { StoreHeader } from "@/components/store/layout/store-header";
import { StoreSettingsProvider } from "@/components/store/layout/store-settings-provider";
import CompanionStorySection from "@/components/store/layout/companion-story-section";

export const metadata: Metadata = {
  title: { absolute: "Royal Chins | Chinchillas, Guinea Pigs & Small Pets UAE" },
  description: "Discover Chinchillas, Guinea Pigs, Micro Squirrels and carefully selected small pet accessories from Royal Chins in the UAE.",
  alternates: { canonical: "/" },
};

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
