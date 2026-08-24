import { apiRequest } from "@/lib/api/client";

export type AnimalPayload = Record<string, unknown>;

export const getAnimals = () => apiRequest<unknown[]>("/admin/animals");
export const getAnimal = (id: string | number) => apiRequest<unknown>(`/admin/animals/${id}`);
export const createAnimal = (payload: AnimalPayload) =>
  apiRequest<unknown>("/admin/animals", { method: "POST", body: JSON.stringify(payload) });
export const updateAnimal = (id: string | number, payload: AnimalPayload) =>
  apiRequest<unknown>(`/admin/animals/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteAnimal = (id: string | number) =>
  apiRequest<{ message: string }>(`/admin/animals/${id}`, { method: "DELETE" });
