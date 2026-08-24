import { apiRequest } from "@/lib/api/client";
export const getInventory = () => apiRequest<unknown[]>("/admin/inventory");
export const updateInventory = (id: string | number, quantity: number) => apiRequest<unknown>(`/admin/inventory/${id}`, { method: "PATCH", body: JSON.stringify({ quantity }) });
