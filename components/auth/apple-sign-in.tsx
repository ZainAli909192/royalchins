"use client";

import { Apple } from "lucide-react";

export function AppleSignIn({
  returnTo,
}: {
  returnTo: string;
}) {
  const handleAppleLogin = () => {
    const params =
      new URLSearchParams({
        returnTo,
      });

    window.location.href =
      `/api/store/auth/apple?${params.toString()}`;
  };

  return (
    <button
      type="button"
      onClick={handleAppleLogin}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-black bg-black px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
    >
      <Apple
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
      />

      <span className="whitespace-nowrap">
        Continue with Apple
      </span>
    </button>
  );
}