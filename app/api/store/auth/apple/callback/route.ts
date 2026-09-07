import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createCustomerSession,
  CUSTOMER_SESSION_COOKIE,
} from "@/lib/auth/customer-auth-server";

import {
  APPLE_OAUTH_RETURN_COOKIE,
  APPLE_OAUTH_STATE_COOKIE,
  createAppleClientSecret,
  getAppleClientId,
  getAppleRedirectUri,
  parseAppleUser,
  sanitizeAppleReturnTo,
  verifyAppleIdToken,
} from "@/lib/auth/apple-oauth";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest
) {
  const loginUrl =
    new URL(
      "/auth/login",
      request.url
    );

  try {
    const formData =
      await request.formData();

    const code =
      getFormValue(
        formData,
        "code"
      );

    const state =
      getFormValue(
        formData,
        "state"
      );

    const oauthError =
      getFormValue(
        formData,
        "error"
      );

    const appleUserRaw =
      getFormValue(
        formData,
        "user"
      );

    const expectedState =
      request.cookies.get(
        APPLE_OAUTH_STATE_COOKIE
      )?.value;

    const storedReturnTo =
      request.cookies.get(
        APPLE_OAUTH_RETURN_COOKIE
      )?.value;

    if (oauthError) {
      loginUrl.searchParams.set(
        "error",
        "apple_cancelled"
      );

      return clearAppleOAuthCookies(
        NextResponse.redirect(
          loginUrl,
          303
        )
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
        "apple_invalid_state"
      );

      return clearAppleOAuthCookies(
        NextResponse.redirect(
          loginUrl,
          303
        )
      );
    }

    const clientSecret =
      await createAppleClientSecret();

    const tokenResponse =
      await fetch(
        "https://appleid.apple.com/auth/token",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body:
            new URLSearchParams(
              {
                client_id:
                  getAppleClientId(),

                client_secret:
                  clientSecret,

                code,

                grant_type:
                  "authorization_code",

                redirect_uri:
                  getAppleRedirectUri(),
              }
            ),

          cache: "no-store",
        }
      );

    if (!tokenResponse.ok) {
      console.error(
        "Apple token exchange failed",
        await tokenResponse.text()
      );

      loginUrl.searchParams.set(
        "error",
        "apple_token_failed"
      );

      return clearAppleOAuthCookies(
        NextResponse.redirect(
          loginUrl,
          303
        )
      );
    }

    const tokenData =
      (await tokenResponse.json()) as {
        id_token?: string;
      };

    if (!tokenData.id_token) {
      throw new Error(
        "Apple did not return an ID token."
      );
    }

    const appleIdentity =
      await verifyAppleIdToken(
        tokenData.id_token
      );

    const firstLoginUser =
      parseAppleUser(
        appleUserRaw
      );

    const customer =
      await findOrCreateAppleCustomer(
        {
          providerAccountId:
            appleIdentity.providerAccountId,

          email:
            appleIdentity.email,

          name:
            firstLoginUser?.name ??
            null,
        }
      );

    if (!customer.isActive) {
      loginUrl.searchParams.set(
        "error",
        "account_disabled"
      );

      return clearAppleOAuthCookies(
        NextResponse.redirect(
          loginUrl,
          303
        )
      );
    }

    const session =
      await createCustomerSession(
        customer
      );

    const returnTo =
      sanitizeAppleReturnTo(
        storedReturnTo ??
          null
      );

    const destination =
      new URL(
        returnTo,
        request.nextUrl.origin
      );

    const response =
      NextResponse.redirect(
        destination,
        303
      );

    response.cookies.set(
      CUSTOMER_SESSION_COOKIE,
      session.token,
      {
        httpOnly: true,
        sameSite: "lax",
        secure:
          process.env
            .NODE_ENV ===
          "production",
        path: "/",
        maxAge:
          session.maxAge,
      }
    );

    return clearAppleOAuthCookies(
      response
    );
  } catch (error) {
    console.error(
      "Apple authentication failed",
      error
    );

    loginUrl.searchParams.set(
      "error",
      "apple_failed"
    );

    return clearAppleOAuthCookies(
      NextResponse.redirect(
        loginUrl,
        303
      )
    );
  }
}

async function findOrCreateAppleCustomer(
  appleUser: {
    providerAccountId: string;
    email: string;
    name: string | null;
  }
) {
  const linkedAccount =
    await prisma.customerOAuthAccount.findUnique(
      {
        where: {
          provider_providerAccountId:
            {
              provider:
                "apple",

              providerAccountId:
                appleUser.providerAccountId,
            },
        },

        include: {
          customer: true,
        },
      }
    );

  if (linkedAccount) {
    return linkedAccount.customer;
  }

  const existingCustomer =
    await prisma.customer.findUnique(
      {
        where: {
          email:
            appleUser.email,
        },
      }
    );

  if (existingCustomer) {
    await prisma.customerOAuthAccount.create(
      {
        data: {
          provider:
            "apple",

          providerAccountId:
            appleUser.providerAccountId,

          customerId:
            existingCustomer.id,
        },
      }
    );

    return existingCustomer;
  }

  const fallbackName =
    appleUser.email
      .split("@")[0]
      .replace(
        /[._-]+/g,
        " "
      )
      .trim();

  return prisma.customer.create(
    {
      data: {
        name:
          appleUser.name ||
          fallbackName ||
          "Apple Customer",

        email:
          appleUser.email,

        phone: "",

        passwordHash:
          null,

        oauthAccounts: {
          create: {
            provider:
              "apple",

            providerAccountId:
              appleUser.providerAccountId,
          },
        },
      },
    }
  );
}

function getFormValue(
  formData: FormData,
  key: string
) {
  const value =
    formData.get(key);

  return typeof value ===
    "string"
    ? value
    : null;
}

function clearAppleOAuthCookies(
  response: NextResponse
) {
  response.cookies.set(
    APPLE_OAUTH_STATE_COOKIE,
    "",
    {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 0,
    }
  );

  response.cookies.set(
    APPLE_OAUTH_RETURN_COOKIE,
    "",
    {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 0,
    }
  );

  return response;
}