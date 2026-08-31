import { apiRequest } from "@/lib/api/client";

export type AdminLoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type AuthResponse = {
  user: {
    id: string | number;
    name?: string;
    email: string;
    role?: string;
  };
};

export async function adminLogin(payload: AdminLoginPayload) {
  return apiRequest<AuthResponse>("/api/admin/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

export async function adminForgotPassword(email: string) {
  return apiRequest<{ message: string; resetUrl?: string }>("/api/admin/auth/forgot-password", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email }),
  });
}

export async function adminResetPassword(payload: {
  token: string;
  password: string;
  passwordConfirmation: string;
}) {
  return apiRequest<{ message: string }>("/api/admin/auth/reset-password", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

export async function adminLogout() {
  return apiRequest<{ message: string }>("/api/admin/auth/logout", {
    method: "POST",
  });
}
