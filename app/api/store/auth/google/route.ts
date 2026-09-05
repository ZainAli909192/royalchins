import { NextRequest, NextResponse } from "next/server";

import {
  createGoogleOAuthState,
  getGoogleClientId,
  getGoogleRedirectUri,
  GOOGLE_OAUTH_RETURN_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
  sanitizeReturnTo,
} from "@/lib/auth/google-oauth";

export async function GET(request: NextRequest) {
  try {
    const state = createGoogleOAuthState();

    const returnTo = sanitizeReturnTo(
      request.nextUrl.searchParams.get("returnTo")
    );

    const params = new URLSearchParams({
      client_id: getGoogleClientId(),
      redirect_uri: getGoogleRedirectUri(),
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });

    const response = NextResponse.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    );

    response.cookies.set(
      GOOGLE_OAUTH_STATE_COOKIE,
      state,
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 10,
      }
    );

    response.cookies.set(
      GOOGLE_OAUTH_RETURN_COOKIE,
      returnTo,
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 10,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Google OAuth initialization failed",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/auth/login?error=google_unavailable",
        request.url
      )
    );
  }
}