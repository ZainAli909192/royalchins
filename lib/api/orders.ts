import { apiRequest } from "@/lib/api/client";
export const getOrders = () => apiRequest<unknown[]>("/admin/orders");
export const getOrder = (id: string | number) => apiRequest<unknown>(`/admin/orders/${id}`);
export const updateOrderStatus = (id: string | number, status: string) => apiRequest<unknown>(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
