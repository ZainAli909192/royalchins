import { ApiError } from "@/lib/api/client";

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export function getFieldErrors(error: unknown): Record<string, string[]> {
  if (!(error instanceof ApiError) || !error.payload?.errors) return {};

  return Object.fromEntries(
    Object.entries(error.payload.errors).map(([key, value]) => [
      key,
      Array.isArray(value) ? value : [value],
    ])
  );
}
