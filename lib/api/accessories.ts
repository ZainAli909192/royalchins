import { apiRequest } from "@/lib/api/client";
export type AccessoryPayload = Record<string, unknown>;
export const getAccessories = () => apiRequest<unknown[]>("/admin/accessories");
export const getAccessory = (id: string | number) => apiRequest<unknown>(`/admin/accessories/${id}`);
export const createAccessory = (payload: AccessoryPayload) => apiRequest<unknown>("/admin/accessories", { method: "POST", body: JSON.stringify(payload) });
export const updateAccessory = (id: string | number, payload: AccessoryPayload) => apiRequest<unknown>(`/admin/accessories/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteAccessory = (id: string | number) => apiRequest<{ message: string }>(`/admin/accessories/${id}`, { method: "DELETE" });
