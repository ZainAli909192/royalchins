import { apiRequest } from "@/lib/api/client";
export const getFaqs = () => apiRequest<unknown[]>("/admin/faq");
export const createFaq = (payload: Record<string, unknown>) => apiRequest<unknown>("/admin/faq", { method: "POST", body: JSON.stringify(payload) });
export const updateFaq = (id: string | number, payload: Record<string, unknown>) => apiRequest<unknown>(`/admin/faq/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteFaq = (id: string | number) => apiRequest<{ message: string }>(`/admin/faq/${id}`, { method: "DELETE" });
