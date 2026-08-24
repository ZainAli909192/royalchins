import { apiRequest } from "@/lib/api/client";
export const getPayments = () => apiRequest<unknown[]>("/admin/payments");
export const getPayment = (id: string | number) => apiRequest<unknown>(`/admin/payments/${id}`);
