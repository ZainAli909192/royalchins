export const SITE_URL = "https://www.royalchins.com";
export const SITE_NAME = "Royal Chins";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function normalizeDescription(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
