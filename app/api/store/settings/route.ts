import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const defaults = {
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

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function GET() {
  try {
    const records = await prisma.storeSetting.findMany({
      where: { key: { in: ["brand", "contact"] } },
    });
    const saved = Object.fromEntries(
      records.map((record) => [record.key, asObject(record.value)])
    );

    return NextResponse.json(
      {
        brand: { ...defaults.brand, ...saved.brand },
        contact: { ...defaults.contact, ...saved.contact },
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json(defaults, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
