import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type DeliveryReader = Pick<Prisma.TransactionClient, "deliveryZone">;

export type DeliveryQuoteInput = {
  emirate: string;
  area: string;
  subtotal: number;
};

export async function listDeliveryZones() {
  return prisma.deliveryZone.findMany({
    orderBy: [{ emirate: "asc" }, { area: "asc" }],
  });
}

export async function getDeliveryQuote(
  reader: DeliveryReader,
  input: DeliveryQuoteInput
) {
  const emirate = input.emirate.trim();
  if (!emirate) return null;

  const zones = await reader.deliveryZone.findMany({
    where: { emirate, isActive: true },
    orderBy: { area: "asc" },
  });
  // Delivery pricing is based on emirate. "All areas" is the editable
  // default rule, while older area-specific records remain a fallback.
  const zone =
    zones.find((candidate) => candidate.area.toLocaleLowerCase() === "all areas") ??
    zones[0];

  if (!zone) return null;

  const threshold = zone.freeDeliveryThreshold === null ? null : Number(zone.freeDeliveryThreshold);
  const isFree = zone.isFreeDelivery || (threshold !== null && input.subtotal >= threshold);

  return {
    id: zone.id,
    area: zone.area,
    emirate: zone.emirate,
    eta: zone.eta,
    isFreeDelivery: isFree,
    freeDeliveryThreshold: threshold,
    fee: isFree ? 0 : Number(zone.fee),
  };
}
