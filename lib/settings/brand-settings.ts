export const BRAND_SETTINGS_KEY =
  "royal-chins-brand-settings";

export type SavedBrandSettings = {
  storeName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
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
  secondaryColor: string
) {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  document.documentElement.style.setProperty(
    "--primary",
    primaryColor
  );

  document.documentElement.style.setProperty(
    "--secondary",
    secondaryColor
  );
}