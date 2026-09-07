import "server-only";

const baseUrl = (process.env.TAMARA_API_BASE_URL || "https://api-sandbox.tamara.co").replace(/\/$/, "");
export class TamaraError extends Error { constructor(message: string, public readonly status: number) { super(message); } }
async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = process.env.TAMARA_API_TOKEN;
  if (!token || token.length < 20 || /^\*+$/.test(token)) {
    throw new Error("TAMARA_NOT_CONFIGURED");
  }
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init?.headers ?? {}) }, cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const message = [data.message, data.error_message, data.error].find((value) => typeof value === "string") || "Tamara rejected the checkout request."; console.error("Tamara API request failed", { path, status: response.status, data }); throw new TamaraError(message, response.status); }
  return data as T;
}
export const createTamaraCheckout = (body: unknown) => call<{ order_id: string; checkout_url: string }>("/checkout", { method: "POST", body: JSON.stringify(body) });
export const authoriseTamaraOrder = (id: string) => call(`/orders/${encodeURIComponent(id)}/authorise`, { method: "POST" });
