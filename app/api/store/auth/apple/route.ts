import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  APPLE_OAUTH_RETURN_COOKIE,
  APPLE_OAUTH_STATE_COOKIE,
  createAppleOAuthState,
  getAppleClientId,
  getAppleRedirectUri,
  sanitizeAppleReturnTo,
} from "@/lib/auth/apple-oauth";

export async function GET(
  request: NextRequest
) {
  try {
    const state =
      createAppleOAuthState();

    const returnTo =
      sanitizeAppleReturnTo(
        request.nextUrl.searchParams.get(
          "returnTo"
        )
      );

    const params =
      new URLSearchParams({
        client_id:
          getAppleClientId(),

        redirect_uri:
          getAppleRedirectUri(),

        response_type:
          "code",

        response_mode:
          "form_post",

        scope:
          "name email",

        state,
      });

    const response =
      NextResponse.redirect(
        `https://appleid.apple.com/auth/authorize?${params.toString()}`
      );

    response.cookies.set(
      APPLE_OAUTH_STATE_COOKIE,
      state,
      {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 60 * 10,
      }
    );

    response.cookies.set(
      APPLE_OAUTH_RETURN_COOKIE,
      returnTo,
      {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 60 * 10,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Apple OAuth initialization failed",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/auth/login?error=apple_unavailable",
        request.url
      )
    );
  }
}