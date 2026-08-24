export const appConfig = {
  name: "Royal Chins",
  currency: "AED",
  locale: "en-AE",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  requestTimeoutMs: 15000,
} as const;
