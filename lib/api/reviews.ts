import { apiRequest } from "@/lib/api/client";
export const getReviews = () => apiRequest<unknown[]>("/admin/reviews");
export const getReview = (id: string | number) => apiRequest<unknown>(`/admin/reviews/${id}`);
export const updateReviewStatus = (id: string | number, status: string) => apiRequest<unknown>(`/admin/reviews/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
