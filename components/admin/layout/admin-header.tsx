"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  KeyRound,
  LogOut,
  User,
} from "lucide-react";

import { clearAdminSession } from "@/lib/auth/admin-auth";


export function AdminHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => undefined);
    clearAdminSession();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 h-[76px] border-b border-border bg-white lg:h-16">
      <div className="relative flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="w-10 lg:hidden" />

        <div className="absolute  top-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0">
          <Image
            src="/logo.png"
            alt="Royal Chins"
            width={120}
            height={60}
            priority
            className="h-[54px] w-[105px] object-contain lg:hidden"
          />

          <div className="hidden lg:block">
            <p className="text-base font-semibold text-foreground">
              Royal Chins Admin
            </p>

            <p className="text-xs text-muted-foreground">
              Manage your marketplace
            </p>
          </div>
        </div>

        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-surface-subtle"
            aria-expanded={open}
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface-subtle text-primary">
              <User className="h-5 w-5" />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-success" />
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold text-foreground">
                Admin
              </p>

              <p className="text-xs text-muted-foreground">
                Administrator
              </p>
            </div>

            <ChevronDown
              className={`hidden h-4 w-4 text-muted-foreground transition-transform lg:block ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setOpen(false)}
                aria-label="Close profile menu"
              />

              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                <div className="border-b border-border px-4 py-3 lg:hidden">
                  <p className="text-sm font-semibold text-foreground">
                    Admin
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Administrator
                  </p>
                </div>

                <div className="p-2">
                  <Link
                    href="/admin/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-surface-subtle"
                  >
                    <User className="h-4 w-4 text-primary" />
                    Profile
                  </Link>

               

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-error hover:bg-[var(--error-background)]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
