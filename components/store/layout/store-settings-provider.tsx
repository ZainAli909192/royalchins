"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { applyBrandColors } from "@/lib/settings/brand-settings";

export type StoreBrandSettings = {
  storeName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
};

export type StoreContactSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
};

type StoreSettings = {
  brand: StoreBrandSettings;
  contact: StoreContactSettings;
};

const fallbackSettings: StoreSettings = {
  brand: {
    storeName: "Royal Chins",
    logo: "/logo.png",
    primaryColor: "#6F3CC3",
    secondaryColor: "#000000",
    textColor: "#000000",
  },
  contact: {
    email: "hello@royalchins.ae",
    phone: "+971 50 000 0000",
    whatsapp: "+971 50 000 0000",
    instagram: "@royalchins",
  },
};

const StoreSettingsContext = createContext<StoreSettings>(fallbackSettings);

async function loadSettings(): Promise<StoreSettings> {
  const response = await fetch("/api/store/settings", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load storefront settings.");
  const data = (await response.json()) as Partial<StoreSettings>;
  return {
    brand: { ...fallbackSettings.brand, ...data.brand },
    contact: { ...fallbackSettings.contact, ...data.contact },
  };
}

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(fallbackSettings);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      loadSettings()
        .then((next) => {
          if (!active) return;
          setSettings(next);
          applyBrandColors(next.brand.primaryColor, next.brand.secondaryColor, next.brand.textColor);
        })
        .catch(() => undefined);
    };

    refresh();
    window.addEventListener("royalchins-settings-updated", refresh);
    return () => {
      active = false;
      window.removeEventListener("royalchins-settings-updated", refresh);
    };
  }, []);

  return (
    <StoreSettingsContext.Provider value={settings}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}
