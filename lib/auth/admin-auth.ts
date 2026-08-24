import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/auth/auth-storage";

export function isAdminAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export function saveAdminSession(token: string): void {
  setAuthToken(token);
}

export function clearAdminSession(): void {
  clearAuthToken();
}
