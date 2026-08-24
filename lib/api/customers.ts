import { apiRequest } from "@/lib/api/client";
export const getCustomers = () => apiRequest<unknown[]>("/admin/customers");
export const getCustomer = (id: string | number) => apiRequest<unknown>(`/admin/customers/${id}`);
