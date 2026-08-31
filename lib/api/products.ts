import { apiRequest } from "@/lib/api/client";
import type { ProductApiValues } from "@/lib/validations/product";

export type ProductResponse = Omit<ProductApiValues, "mainCategory" | "subCategory" | "images"> & { id: string; categoryId: string; category: { id: string; name: string; type: "Animal" | "Accessory" }; images: { id: string; url: string; sortOrder: number }[]; createdAt: string; updatedAt: string };
export const getProducts = () => apiRequest<ProductResponse[]>("/api/admin/products");
export const getProduct = (id: string) => apiRequest<ProductResponse>(`/api/admin/products/${id}`);
export const createProduct = (payload: ProductApiValues) => apiRequest<ProductResponse>("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
export const updateProduct = (id: string, payload: ProductApiValues) => apiRequest<ProductResponse>(`/api/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteProduct = (id: string) => apiRequest<{ message: string }>(`/api/admin/products/${id}`, { method: "DELETE" });
