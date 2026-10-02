import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createAuthActions } from "@insforge/sdk/ssr";

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
      return NextResponse.redirect(new URL("/login?error=oauth", request.url));
    }

    response.cookies.delete("insforge_code_verifier");
    return response;
  } catch (error) {
    console.error("[api/auth/callback] Unexpected error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }
}
