import type {
  CheckoutItem,
} from "@/lib/store/checkout-storage";

const CART_KEY = "royalchins_cart";

export type CartItem = CheckoutItem;

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart =
      localStorage.getItem(CART_KEY);

    if (!storedCart) {
      return [];
    }

    const parsed =
      JSON.parse(storedCart);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return (parsed as CartItem[]).reduce<CartItem[]>((items, item) => {
      const existing = items.find((candidate) => candidate.slug === item.slug);
      if (!existing) return [...items, item];
      existing.quantity = existing.type === "Animal" ? 1 : existing.quantity + item.quantity;
      return items;
    }, []);
  } catch {
    return [];
  }
}

export function saveCart(
  items: CartItem[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(items)
  );
}

export function addToCart(
  item: CartItem
) {
  const currentCart = getCart();

  const existingItem =
    currentCart.find(
      (cartItem) =>
        cartItem.slug === item.slug
    );

  if (existingItem) {
    const updatedCart =
      currentCart.map(
        (cartItem) => {
          if (
            cartItem.slug !== item.slug
          ) {
            return cartItem;
          }

          if (
            cartItem.type === "Animal"
          ) {
            return {
              ...cartItem,
              quantity: 1,
            };
          }

          return {
            ...cartItem,
            quantity:
              cartItem.quantity +
              item.quantity,
          };
        }
      );

    saveCart(updatedCart);

    return updatedCart;
  }

  const updatedCart = [
    ...currentCart,
    {
      ...item,
      quantity:
        item.type === "Animal"
          ? 1
          : Math.max(1, item.quantity),
    },
  ];

  saveCart(updatedCart);
  window.dispatchEvent(new Event("royalchins-cart-updated"));

  return updatedCart;
}

export function updateCartQuantity(
  slug: string,
  quantity: number
) {
  const currentCart = getCart();

  const updatedCart =
    currentCart.map((item) => {
      if (item.slug !== slug) {
        return item;
      }

      if (item.type === "Animal") {
        return {
          ...item,
          quantity: 1,
        };
      }

      return {
        ...item,
        quantity: Math.max(
          1,
          quantity
        ),
      };
    });

  saveCart(updatedCart);
  window.dispatchEvent(new Event("royalchins-cart-updated"));

  return updatedCart;
}

export function removeFromCart(
  slug: string
) {
  const updatedCart =
    getCart().filter(
      (item) =>
        item.slug !== slug
    );

  saveCart(updatedCart);
  window.dispatchEvent(new Event("royalchins-cart-updated"));

  return updatedCart;
}

export function clearCart() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    CART_KEY
  );
  window.dispatchEvent(new Event("royalchins-cart-updated"));
}

export function getCartCount() {
  return getCart().reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}
