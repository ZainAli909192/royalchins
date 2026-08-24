import { apiRequest } from "@/lib/api/client";
export const getRefunds = () => apiRequest<unknown[]>("/admin/refunds");
export const getRefund = (id: string | number) => apiRequest<unknown>(`/admin/refunds/${id}`);
export const updateRefundStatus = (id: string | number, status: string) => apiRequest<unknown>(`/admin/refunds/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
