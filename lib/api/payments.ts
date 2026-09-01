import { apiRequest } from "@/lib/api/client";
export const getPayments = () => apiRequest<unknown[]>("/api/admin/payments");
export const getPayment = (id: string) => apiRequest<unknown>(`/api/admin/payments/${id}`);
