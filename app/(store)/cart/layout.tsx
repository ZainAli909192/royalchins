import type { Metadata } from "next";
import type { ReactNode } from "react";

import CompanionStorySection from "@/components/store/layout/companion-story-section";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}

      <div className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
        <CompanionStorySection />
      </div>
    </>
  );
}