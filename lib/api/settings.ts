import { apiRequest } from "@/lib/api/client";

// Admin settings live in this Next.js application, not the legacy API host.
export const getSettings = () => apiRequest<unknown>("/api/admin/settings");
export const updateSettings = (payload: Record<string, unknown>) =>
  apiRequest<unknown>("/api/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
