import { cookies } from "next/headers";
import { after, NextResponse, type NextRequest } from "next/server";
import { createAuthActions } from "@insforge/sdk/ssr";
import { SeverityNumber } from "@opentelemetry/api-logs";
import {
  flushPostHogLogs,
  logOAuthCallbackOutcome,
} from "@/instrumentation";

function flushLogsAfterResponse() {
  after(async () => {
    await flushPostHogLogs();
  });
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("insforge_code");
    const cookieStore = await cookies();
    const verifier = cookieStore.get("insforge_code_verifier")?.value;

    if (!code || !verifier) {
      console.error("[api/auth/callback] Missing code or verifier", {
        hasCode: !!code,
        hasVerifier: !!verifier,
      });
      logOAuthCallbackOutcome(
        "oauth_callback_missing_parameters",
        SeverityNumber.WARN
      );
      flushLogsAfterResponse();
      return NextResponse.redirect(new URL("/login?error=oauth", request.url));
    }

    const response = NextResponse.redirect(
      new URL("/dashboard", request.url)
    );

    const auth = createAuthActions({
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });

    const { error } = await auth.exchangeOAuthCode(code, verifier);

    if (error) {
      console.error("[api/auth/callback] Exchange code error:", error);
      logOAuthCallbackOutcome(
        "oauth_callback_exchange_failed",
        SeverityNumber.ERROR
      );
      flushLogsAfterResponse();
      return NextResponse.redirect(new URL("/login?error=oauth", request.url));
    }

    response.cookies.delete("insforge_code_verifier");
    logOAuthCallbackOutcome(
      "oauth_callback_exchange_succeeded",
      SeverityNumber.INFO
    );
    flushLogsAfterResponse();
    return response;
  } catch (error) {
    console.error("[api/auth/callback] Unexpected error:", error);
    logOAuthCallbackOutcome(
      "oauth_callback_unexpected_error",
      SeverityNumber.ERROR
    );
    flushLogsAfterResponse();
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }
}
