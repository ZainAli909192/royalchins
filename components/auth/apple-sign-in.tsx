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
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-black bg-white px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
    >
      <img
        src="/payments/apple.png"
        alt=""
        className="h-5 w-5 shrink-0 object-contain"
        aria-hidden="true"
      />

      <span className="whitespace-nowrap text-black">
        Continue with Apple
      </span>
    </button>
  );
}