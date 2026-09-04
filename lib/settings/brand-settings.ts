export const BRAND_SETTINGS_KEY =
  "royal-chins-brand-settings";

export type SavedBrandSettings = {
  storeName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
};

export function saveBrandSettings(
  settings: SavedBrandSettings
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    BRAND_SETTINGS_KEY,
    JSON.stringify(
      settings
    )
  );
}

export function getBrandSettings():
  | SavedBrandSettings
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const raw =
      localStorage.getItem(
        BRAND_SETTINGS_KEY
      );

    if (!raw) {
      return null;
    }

    return JSON.parse(
      raw
    ) as SavedBrandSettings;
  } catch {
    return null;
  }
}

export function applyBrandColors(
  primaryColor: string,
  secondaryColor: string,
  textColor = "#000000"
) {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  const primary = normalizeHex(primaryColor);
  const secondary = normalizeHex(secondaryColor);
  const foreground = normalizeTextHex(textColor);

  document.documentElement.style.setProperty("--primary", primary);
  document.documentElement.style.setProperty("--primary-hover", darken(primary, 0.14));
  document.documentElement.style.setProperty("--primary-active", darken(primary, 0.24));
  document.documentElement.style.setProperty("--primary-foreground", foregroundFor(primary));
  document.documentElement.style.setProperty("--secondary", secondary);
  document.documentElement.style.setProperty("--secondary-foreground", foregroundFor(secondary));
  document.documentElement.style.setProperty("--foreground", foreground);
}

function normalizeHex(color: string) {
  return /^#[0-9a-f]{6}$/i.test(color) ? color : "#6F3CC3";
}

function normalizeTextHex(color: string) {
  return /^#[0-9a-f]{6}$/i.test(color) ? color : "#000000";
}

function darken(color: string, amount: number) {
  const channels = [1, 3, 5].map((offset) =>
    Math.round(parseInt(color.slice(offset, offset + 2), 16) * (1 - amount))
  );
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function foregroundFor(color: string) {
  const [red, green, blue] = [1, 3, 5].map((offset) =>
    parseInt(color.slice(offset, offset + 2), 16)
  );
  return red * 0.299 + green * 0.587 + blue * 0.114 > 160
    ? "#111111"
    : "#ffffff";
}
