import { apiRequest } from "@/lib/api/client";
export type CategoryPayload = {
  name: string;
  slug?: string;
  type: "Animal" | "Accessory";
  description?: string;
  isActive: boolean;
};
export type CategoryResponse = CategoryPayload & { id: string; slug: string; items: number; createdAt: string; updatedAt: string };
export const getCategories = () => apiRequest<CategoryResponse[]>("/api/admin/categories");
export const createCategory = (payload: CategoryPayload) => apiRequest<CategoryResponse>("/api/admin/categories", { method: "POST", body: JSON.stringify(payload) });
export const updateCategory = (id: string | number, payload: Partial<CategoryPayload>) => apiRequest<CategoryResponse>(`/api/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteCategory = (id: string | number) => apiRequest<{ message: string }>(`/api/admin/categories/${id}`, { method: "DELETE" });
export const getCategory = (id: string | number) =>
  apiRequest<CategoryResponse>(`/api/admin/categories/${id}`);
