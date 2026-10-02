"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions } from "@insforge/sdk/ssr";

export async function signInWithOAuthAction(provider: "google" | "github") {
  let redirectUrl: string | null = null;

  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({ cookies: cookieStore });

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo: `${appUrl}/api/auth/callback`,
      skipBrowserRedirect: true,
    });

    if (error || !data?.url || !data?.codeVerifier) {
      console.error("[actions/auth/signInWithOAuth]", error);
      return {
        success: false,
        error: error?.message || "Failed to initialize OAuth provider",
      };
    }

    cookieStore.set("insforge_code_verifier", data.codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    redirectUrl = data.url;
  } catch (error) {
    console.error("[actions/auth/signInWithOAuth]", error);
    return {
      success: false,
      error: "Unexpected error starting authentication flow",
    };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}

export async function signOutAction(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({ cookies: cookieStore });
    await auth.signOut();
  } catch (error) {
    console.error("[actions/auth/signOut]", error);
  }

  redirect("/login");
}
