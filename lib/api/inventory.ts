import { apiRequest } from "@/lib/api/client";

export type InventoryResponse = { id: string; name: string; sku: string; type: "Animal" | "Accessory"; quantity: number; lowStockThreshold: number; updatedAt: string; category: { name: string } };
export const getInventory = () => apiRequest<InventoryResponse[]>("/api/admin/inventory");
export const updateInventory = (payload: { productId: string; action: "Add" | "Remove" | "Set" | "Threshold"; quantity: number; reason?: string; notes?: string }) => apiRequest<InventoryResponse>("/api/admin/inventory", { method: "PATCH", body: JSON.stringify(payload) });
