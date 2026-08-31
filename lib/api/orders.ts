import { apiRequest } from "@/lib/api/client";
export type OrderResponse = { id: string; orderNumber: string; customerName: string; email: string; phone: string; total: string | number; paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded"; paymentMethod: "Card" | "Tamara" | "Tabby" | "Cash"; orderStatus: "Pending" | "Confirmed" | "Processing" | "Delivered" | "Cancelled"; createdAt: string; items: { id: string }[] };
export const getOrders = () => apiRequest<OrderResponse[]>("/api/admin/orders");
export const updateOrder = (id: string, payload: Partial<Pick<OrderResponse, "orderStatus" | "paymentStatus">> & { notes?: string }) => apiRequest<OrderResponse>(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
