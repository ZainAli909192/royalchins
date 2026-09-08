"use client";

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
      className="inline-flex h-12 min-w-0 w-full items-center justify-center gap-2 rounded-xl border border-black bg-white px-3 text-xs font-bold text-black transition-opacity hover:opacity-90 sm:gap-3 sm:px-5 sm:text-sm"
    >
      <img
        src="/payments/apple.png"
        alt=""
        className="h-5 w-5 shrink-0 object-contain"
        aria-hidden="true"
      />

      <span className="min-w-0 whitespace-nowrap">
        Continue with Apple
      </span>
    </button>
  );
}