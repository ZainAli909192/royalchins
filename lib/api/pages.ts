import { apiRequest } from "@/lib/api/client";
export const getPages = () => apiRequest<unknown[]>("/admin/pages");
export const updatePage = (id: string | number, payload: Record<string, unknown>) => apiRequest<unknown>(`/admin/pages/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
