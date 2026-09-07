import "server-only";

const baseUrl = "https://api.tabby.ai";

export class TabbyError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}

type TabbyItem = { title: string; quantity: number; unit_price: string; category: string; reference_id: string; description: string; image_url?: string };
export type TabbyPayment = { id: string; status: "CREATED" | "AUTHORIZED" | "CLOSED" | "REJECTED" | "EXPIRED"; payment?: { id: string }; captures?: unknown[]; order?: { reference_id?: string } };

function headers() {
  const key = process.env.TABBY_SECRET_KEY;
  if (!key) throw new Error("TABBY_NOT_CONFIGURED");
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { ...headers(), ...(init?.headers ?? {}) }, cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = [data.error, data.message, data.detail, data.errorType]
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .join(" ");
    console.error("Tabby API request failed", { path, status: response.status, detail, response: data });
    throw new TabbyError(detail || "Tabby rejected the checkout request.", response.status);
  }
  return data as T;
}

export async function createTabbyCheckout(input: { amount: number; buyer: { name: string; email: string; phone: string }; address: { city: string; address: string }; orderNumber: string; items: TabbyItem[]; success: string; cancel: string; failure: string }) {
  const merchantCode = process.env.TABBY_MERCHANT_CODE;
  if (!merchantCode) throw new Error("TABBY_NOT_CONFIGURED");
  return request<{ payment: { id: string }; configuration?: { available_products?: { installments?: Array<{ web_url?: string }> }; products?: { installments?: { is_available?: boolean; rejection_reason?: string | null } } } }>("/api/v2/checkout", { method: "POST", body: JSON.stringify({ payment: { amount: input.amount.toFixed(2), currency: "AED", buyer: input.buyer, shipping_address: { city: input.address.city, address: input.address.address, zip: "00000" }, order: { reference_id: input.orderNumber, items: input.items }, description: `Royal Chins order ${input.orderNumber}`, meta: { order_number: input.orderNumber }, }, lang: "en", merchant_code: merchantCode, merchant_urls: { success: input.success, cancel: input.cancel, failure: input.failure } }) });
}

export const getTabbyPayment = (id: string) => request<TabbyPayment>(`/api/v2/payments/${encodeURIComponent(id)}`);
export const captureTabbyPayment = (id: string, amount: number, referenceId: string, items: TabbyItem[]) => request<TabbyPayment>(`/api/v2/payments/${encodeURIComponent(id)}/captures`, { method: "POST", body: JSON.stringify({ amount: amount.toFixed(2), reference_id: referenceId, items }) });
