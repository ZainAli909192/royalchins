export function formatPhone(value?: string | null) {
  if (!value) return "—";
  return value.trim();
}

export function truncate(value: string, maxLength = 80) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}
