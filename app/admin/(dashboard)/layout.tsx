"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminMobileNav } from "@/components/admin/layout/admin-mobile-nav";
import { getSettings } from "@/lib/api/settings";
import { applyBrandColors } from "@/lib/settings/brand-settings";

type AdminDashboardLayoutProps = {
  children: ReactNode;
};

export default function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const applyAdminTheme = () => {
      getSettings()
        .then((data: unknown) => {
          if (!active) return;
          const adminBrand = (data as { adminBrand?: { primaryColor?: string; secondaryColor?: string; textColor?: string } }).adminBrand;
          if (!adminBrand) return;
          applyBrandColors(
            adminBrand.primaryColor ?? "#6F3CC3",
            adminBrand.secondaryColor ?? "#000000",
            adminBrand.textColor ?? "#000000"
          );
        })
        .catch(() => undefined);
    };

    applyAdminTheme();
    window.addEventListener("royalchins-settings-updated", applyAdminTheme);
    return () => {
      active = false;
      window.removeEventListener("royalchins-settings-updated", applyAdminTheme);
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-subtle">
      <AdminSidebar />

      <div className="min-h-screen lg:ml-[260px]">
        <div className="flex min-h-screen flex-col">
          <AdminHeader />

          <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>

      <AdminMobileNav
        open={mobileMenuOpen}
        onOpen={() => setMobileMenuOpen(true)}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}
