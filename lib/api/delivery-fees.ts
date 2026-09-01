import { apiRequest } from "@/lib/api/client";
export const getDeliveryFees = () => apiRequest<unknown>("/api/admin/delivery-fees");
export const updateDeliveryFees = (payload: Record<string, unknown>) => apiRequest<unknown>("/api/admin/delivery-fees", { method: "POST", body: JSON.stringify(payload) });
