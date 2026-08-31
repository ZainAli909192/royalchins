import { appConfig } from "@/lib/config";
import { getAuthToken } from "@/lib/auth/auth-storage";

export type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
  code?: string;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
  timeoutMs?: number;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    auth = true,
    timeoutMs = appConfig.requestTimeoutMs,
    headers,
    ...requestInit
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const token = auth ? getAuthToken() : null;

    const url = path.startsWith("/api/") ? path : `${appConfig.apiBaseUrl}${path}`;
    const response = await fetch(url, {
      ...requestInit,
      signal: controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers ?? {}),
      },
    });

    const contentType = response.headers.get("content-type");
    const data =
      contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      const payload =
        typeof data === "object" && data !== null
          ? (data as ApiErrorPayload)
          : undefined;

      throw new ApiError(
        payload?.message || response.statusText || "Request failed.",
        response.status,
        payload
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out. Please try again.", 408);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
