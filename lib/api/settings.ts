import { apiRequest } from "@/lib/api/client";
export const getSettings = () => apiRequest<unknown>("/admin/settings");
export const updateSettings = (payload: Record<string, unknown>) => apiRequest<unknown>("/admin/settings", { method: "PATCH", body: JSON.stringify(payload) });
