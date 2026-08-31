import { apiRequest } from "@/lib/api/client";
export type CustomerResponse = { id: string; name: string; email: string; phone: string; isActive: boolean; adminNotes: string; createdAt: string; orders: { total: string | number; createdAt: string }[]; _count: { orders: number; reviews: number } };
export type CustomerDetailResponse = { id: string; name: string; email: string; phone: string; isActive: boolean; adminNotes: string; createdAt: string; updatedAt: string; orders: { id: string; orderNumber: string; total: string | number; paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded"; orderStatus: "Pending" | "Confirmed" | "Processing" | "Delivered" | "Cancelled"; createdAt: string }[]; reviews: { id: string; rating: number; status: "Pending" | "Approved" | "Rejected"; createdAt: string; product: { name: string } }[] };
export const getCustomers = () => apiRequest<CustomerResponse[]>("/api/admin/customers");
export const getCustomer = (id: string) => apiRequest<CustomerDetailResponse>(`/api/admin/customers/${id}`);
export const updateCustomer = (id: string, payload: { name?: string; phone?: string; isActive?: boolean; adminNotes?: string }) => apiRequest(`/api/admin/customers/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteCustomer = (id: string) => apiRequest<{ message: string }>(`/api/admin/customers/${id}`, { method: "DELETE" });
