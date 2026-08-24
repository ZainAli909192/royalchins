import { apiRequest } from "@/lib/api/client";
export type CategoryPayload = {
  name: string;
  slug?: string;
  type: "Animal" | "Accessory";
  description?: string;
  isActive: boolean;
};
export const getCategories = () => apiRequest<unknown[]>("/admin/categories");
export const createCategory = (payload: CategoryPayload) => apiRequest<unknown>("/admin/categories", { method: "POST", body: JSON.stringify(payload) });
export const updateCategory = (id: string | number, payload: Partial<CategoryPayload>) => apiRequest<unknown>(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteCategory = (id: string | number) => apiRequest<{ message: string }>(`/admin/categories/${id}`, { method: "DELETE" });
export const getCategory = (id: string | number) =>
  apiRequest<any>(`/admin/categories/${id}`);
