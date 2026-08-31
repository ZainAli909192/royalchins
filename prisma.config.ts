import "dotenv/config";

import { definePrismaConfig } from "@prisma/cli-engine";

export default definePrismaConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: process.env.DATABASE_URL,
  },

  skills: {
    agents: [
      "claude",
      "cursor",
      "agents",
      "devin",
    ],
  },
});
