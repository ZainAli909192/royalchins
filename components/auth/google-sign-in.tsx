"use client";

type GoogleSignInProps = {
  returnTo: string;
};

export function GoogleSignIn({
  returnTo,
}: GoogleSignInProps) {
  const handleGoogleSignIn = () => {
    window.location.href =
      `/api/store/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors hover:bg-surface-subtle"
    >
      <GoogleIcon />

      <span className="whitespace-nowrap">
        Continue with Google
      </span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 2.99-4.3 2.99-7.37Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.4l-3.22-2.51c-.9.6-2.04.95-3.39.95-2.61 0-4.82-1.76-5.61-4.13H3.06v2.59A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.39 13.91A6 6 0 0 1 6.08 12c0-.66.11-1.31.31-1.91V7.5H3.06A10 10 0 0 0 2 12c0 1.61.39 3.13 1.06 4.5l3.33-2.59Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.51 3.83 1.5l2.86-2.87C16.96 2.98 14.7 2 12 2a10 10 0 0 0-8.94 5.5l3.33 2.59C7.18 7.72 9.39 5.96 12 5.96Z"
      />
    </svg>
  );
}