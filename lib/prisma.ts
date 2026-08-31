import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Increment this whenever the Prisma schema gains a model or field.  Next's
// development hot-reloader preserves `globalThis`, which otherwise leaves an
// old generated Prisma client alive after `prisma generate`.
const prismaSchemaRevision = "customer-checkout-2026-08-31";
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaRevision?: string;
};
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be configured.");
}

export const prisma =
  globalForPrisma.prismaSchemaRevision === prismaSchemaRevision && globalForPrisma.prisma
    ? globalForPrisma.prisma
    : new PrismaClient({
        adapter: new PrismaPg(connectionString),
      });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaRevision = prismaSchemaRevision;
}
