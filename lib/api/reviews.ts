import { apiRequest } from "@/lib/api/client";
export type ReviewResponse = { id: string; rating: number; title: string | null; comment: string; status: "Pending" | "Approved" | "Rejected"; rejectionReason: string | null; rejectionNotes: string | null; moderatedAt: string | null; moderatedBy: string | null; createdAt: string; customer: { id: string; name: string; email: string }; product: { id: string; name: string; type: "Animal" | "Accessory"; images: { url: string }[] }; order: { id: string; orderNumber: string } | null };
export const getReviews = () => apiRequest<ReviewResponse[]>("/api/admin/reviews");
export const getReview = (id: string) => apiRequest<ReviewResponse>(`/api/admin/reviews/${id}`);
export const updateReview = (id: string, payload: Record<string, unknown>) => apiRequest<ReviewResponse>(`/api/admin/reviews/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteReview = (id: string) => apiRequest<{ message: string }>(`/api/admin/reviews/${id}`, { method: "DELETE" });
