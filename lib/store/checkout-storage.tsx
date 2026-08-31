export type CheckoutSource =
  | "buy-now"
  | "cart";

export type CheckoutItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  price: number;
  quantity: number;
  shortMeta?: string;
};

export type CheckoutData = {
  source: CheckoutSource;
  items: CheckoutItem[];
};

const CHECKOUT_KEY =
  "royalchins_checkout";

export function saveCheckout(
  data: CheckoutData
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    CHECKOUT_KEY,
    JSON.stringify(data)
  );
}

export function getCheckout():
  | CheckoutData
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const data =
      localStorage.getItem(
        CHECKOUT_KEY
      );

    if (!data) {
      return null;
    }

    return JSON.parse(
      data
    ) as CheckoutData;
  } catch {
    return null;
  }
}

export function clearCheckout() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    CHECKOUT_KEY
  );
}