import "server-only";

import { randomBytes } from "crypto";
import { OAuth2Client } from "google-auth-library";

export const GOOGLE_OAUTH_STATE_COOKIE =
  "royalchins_google_oauth_state";

export const GOOGLE_OAUTH_RETURN_COOKIE =
  "royalchins_google_oauth_return";

export function getGoogleClientId() {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID must be configured.");
  }

  return clientId;
}

export function getGoogleClientSecret() {
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error("GOOGLE_CLIENT_SECRET must be configured.");
  }

  return clientSecret;
}

export function getGoogleRedirectUri() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL must be configured.");
  }

  return `${appUrl.replace(/\/$/, "")}/api/store/auth/google/callback`;
}

export function createGoogleOAuthState() {
  return randomBytes(32).toString("hex");
}

export function sanitizeReturnTo(value: string | null) {
  if (!value) {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export async function verifyGoogleIdToken(idToken: string) {
  const client = new OAuth2Client(getGoogleClientId());

  const ticket = await client.verifyIdToken({
    idToken,
    audience: getGoogleClientId(),
  });

  const payload = ticket.getPayload();

  if (
    !payload?.sub ||
    !payload.email ||
    payload.email_verified !== true
  ) {
    throw new Error("Google account could not be verified.");
  }

  return {
    providerAccountId: payload.sub,
    email: payload.email.trim().toLowerCase(),
    name:
      payload.name?.trim() ||
      payload.given_name?.trim() ||
      payload.email.split("@")[0],
  };
}
