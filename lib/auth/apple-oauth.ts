import crypto from "node:crypto";

import {
  SignJWT,
  createRemoteJWKSet,
  importPKCS8,
  jwtVerify,
} from "jose";

export const APPLE_OAUTH_STATE_COOKIE =
  "royalchins_apple_oauth_state";

export const APPLE_OAUTH_RETURN_COOKIE =
  "royalchins_apple_oauth_return";

const APPLE_ISSUER =
  "https://appleid.apple.com";

const APPLE_KEYS =
  createRemoteJWKSet(
    new URL(
      "https://appleid.apple.com/auth/keys"
    )
  );

export function getAppleClientId() {
  const value =
    process.env.APPLE_CLIENT_ID?.trim();

  if (!value) {
    throw new Error(
      "APPLE_CLIENT_ID is not configured."
    );
  }

  return value;
}

export function getAppleTeamId() {
  const value =
    process.env.APPLE_TEAM_ID?.trim();

  if (!value) {
    throw new Error(
      "APPLE_TEAM_ID is not configured."
    );
  }

  return value;
}

export function getAppleKeyId() {
  const value =
    process.env.APPLE_KEY_ID?.trim();

  if (!value) {
    throw new Error(
      "APPLE_KEY_ID is not configured."
    );
  }

  return value;
}

export function getAppleRedirectUri() {
  const value =
    process.env.APPLE_REDIRECT_URI?.trim();

  if (!value) {
    throw new Error(
      "APPLE_REDIRECT_URI is not configured."
    );
  }

  return value;
}

export function getApplePrivateKey() {
  const value =
    process.env.APPLE_PRIVATE_KEY;

  if (!value) {
    throw new Error(
      "APPLE_PRIVATE_KEY is not configured."
    );
  }

  return value.replace(
    /\\n/g,
    "\n"
  );
}

export function createAppleOAuthState() {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

export function sanitizeAppleReturnTo(
  value: string | null
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/account";
  }

  return value;
}

export async function createAppleClientSecret() {
  const privateKey =
    await importPKCS8(
      getApplePrivateKey(),
      "ES256"
    );

  const now = Math.floor(
    Date.now() / 1000
  );

  return new SignJWT({})
    .setProtectedHeader({
      alg: "ES256",
      kid: getAppleKeyId(),
    })
    .setIssuer(
      getAppleTeamId()
    )
    .setIssuedAt(now)
    .setExpirationTime(
      now + 60 * 60
    )
    .setAudience(
      "https://appleid.apple.com"
    )
    .setSubject(
      getAppleClientId()
    )
    .sign(privateKey);
}

export async function verifyAppleIdToken(
  idToken: string
) {
  const {
    payload,
  } = await jwtVerify(
    idToken,
    APPLE_KEYS,
    {
      issuer: APPLE_ISSUER,
      audience:
        getAppleClientId(),
    }
  );

  const providerAccountId =
    payload.sub;

  const email =
    typeof payload.email ===
    "string"
      ? payload.email
      : null;

  if (
    !providerAccountId ||
    !email
  ) {
    throw new Error(
      "Apple account information is incomplete."
    );
  }

  return {
    providerAccountId,
    email:
      email.toLowerCase(),
  };
}

export function parseAppleUser(
  value: string | null
) {
  if (!value) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(value) as {
        name?: {
          firstName?: string;
          lastName?: string;
        };
        email?: string;
      };

    const firstName =
      parsed.name?.firstName
        ?.trim() ?? "";

    const lastName =
      parsed.name?.lastName
        ?.trim() ?? "";

    const name = [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      name:
        name || null,
      email:
        parsed.email
          ?.trim()
          .toLowerCase() ??
        null,
    };
  } catch {
    return null;
  }
}