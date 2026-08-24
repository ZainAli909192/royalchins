import { apiRequest } from "@/lib/api/client";
export const getDeliveryFees = () => apiRequest<unknown>("/admin/delivery-fees");
export const updateDeliveryFees = (payload: Record<string, unknown>) => apiRequest<unknown>("/admin/delivery-fees", { method: "PATCH", body: JSON.stringify(payload) });
