import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerSession,
  CUSTOMER_SESSION_COOKIE,
} from "@/lib/auth/customer-auth-server";

import {
  getGoogleClientId,
  getGoogleClientSecret,
  getGoogleRedirectUri,
  GOOGLE_OAUTH_RETURN_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
  sanitizeReturnTo,
  verifyGoogleIdToken,
} from "@/lib/auth/google-oauth";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const loginUrl = new URL("/auth/login", request.url);

  try {
    const code =
      request.nextUrl.searchParams.get("code");

    const state =
      request.nextUrl.searchParams.get("state");

    const oauthError =
      request.nextUrl.searchParams.get("error");

    const expectedState =
      request.cookies.get(
        GOOGLE_OAUTH_STATE_COOKIE
      )?.value;

    const storedReturnTo =
      request.cookies.get(
        GOOGLE_OAUTH_RETURN_COOKIE
      )?.value;

    if (oauthError) {
      loginUrl.searchParams.set(
        "error",
        "google_cancelled"
      );

      return clearOAuthCookies(
        NextResponse.redirect(loginUrl)
      );
    }

    if (
      !code ||
      !state ||
      !expectedState ||
      state !== expectedState
    ) {
      loginUrl.searchParams.set(
        "error",
        "google_invalid_state"
      );

      return clearOAuthCookies(
        NextResponse.redirect(loginUrl)
      );
    }

    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: getGoogleClientId(),
          client_secret: getGoogleClientSecret(),
          redirect_uri: getGoogleRedirectUri(),
          grant_type: "authorization_code",
        }),
        cache: "no-store",
      }
    );

    if (!tokenResponse.ok) {
      console.error(
        "Google token exchange failed",
        await tokenResponse.text()
      );

      loginUrl.searchParams.set(
        "error",
        "google_token_failed"
      );

      return clearOAuthCookies(
        NextResponse.redirect(loginUrl)
      );
    }

    const tokenData = (await tokenResponse.json()) as {
      id_token?: string;
    };

    if (!tokenData.id_token) {
      throw new Error(
        "Google did not return an ID token."
      );
    }

    const googleUser = await verifyGoogleIdToken(
      tokenData.id_token
    );

    const customer = await findOrCreateGoogleCustomer(
      googleUser
    );

    if (!customer.isActive) {
      loginUrl.searchParams.set(
        "error",
        "account_disabled"
      );

      return clearOAuthCookies(
        NextResponse.redirect(loginUrl)
      );
    }

    const session = await createCustomerSession(
      customer
    );

    const returnTo = sanitizeReturnTo(
      storedReturnTo ?? null
    );

    const destination = new URL(
      returnTo,
      request.nextUrl.origin
    );

    const response =
      NextResponse.redirect(destination);

    response.cookies.set(
      CUSTOMER_SESSION_COOKIE,
      session.token,
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: session.maxAge,
      }
    );

    return clearOAuthCookies(response);
  } catch (error) {
    console.error(
      "Google authentication failed",
      error
    );

    loginUrl.searchParams.set(
      "error",
      "google_failed"
    );

    return clearOAuthCookies(
      NextResponse.redirect(loginUrl)
    );
  }
}

async function findOrCreateGoogleCustomer(
  googleUser: {
    providerAccountId: string;
    email: string;
    name: string;
  }
) {
  const linkedAccount =
    await prisma.customerOAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId:
            googleUser.providerAccountId,
        },
      },
      include: {
        customer: true,
      },
    });

  if (linkedAccount) {
    return linkedAccount.customer;
  }

  const existingCustomer =
    await prisma.customer.findUnique({
      where: {
        email: googleUser.email,
      },
    });

  if (existingCustomer) {
    await prisma.customerOAuthAccount.create({
      data: {
        provider: "google",
        providerAccountId:
          googleUser.providerAccountId,
        customerId: existingCustomer.id,
      },
    });

    return existingCustomer;
  }

  return prisma.customer.create({
    data: {
      name: googleUser.name,
      email: googleUser.email,
      phone: "",
      passwordHash: null,

      oauthAccounts: {
        create: {
          provider: "google",
          providerAccountId:
            googleUser.providerAccountId,
        },
      },
    },
  });
}

function clearOAuthCookies(
  response: NextResponse
) {
  response.cookies.set(
    GOOGLE_OAUTH_STATE_COOKIE,
    "",
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    }
  );

  response.cookies.set(
    GOOGLE_OAUTH_RETURN_COOKIE,
    "",
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    }
  );

  return response;
}