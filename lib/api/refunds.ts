import { apiRequest } from "@/lib/api/client";
export const getRefunds = () => apiRequest<unknown[]>("/api/admin/refunds");
export const getRefund = (id: string | number) => apiRequest<unknown>(`/api/admin/refunds/${id}`);
export const updateRefundStatus = (id: string | number, payload: Record<string, unknown>) => apiRequest<unknown>(`/api/admin/refunds/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
