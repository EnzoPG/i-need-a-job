"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { signOutAction } from "@/actions/auth";
import { insforge } from "@/lib/insforge-client";

type Props = {
  className?: string;
  showSignOut?: boolean;
};

export function Navbar({ className = "", showSignOut = false }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    if (!showSignOut) return;

    void insforge.auth.getCurrentUser().then(({ data }) => {
      const user = data?.user;
      if (user?.id) {
        posthog.identify(user.id, user.email ? { email: user.email } : undefined);
      }
    });
  }, [showSignOut]);

  const handleSignOut = () => {
    posthog.capture("user_signed_out");
    posthog.reset();
  };
  return (
    <header className={`w-full bg-surface border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto h-16 px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="INeedAJob"
            width={124}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              pathname.startsWith("/dashboard")
                ? "text-accent font-semibold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className={`text-sm font-medium transition-colors ${
              pathname.startsWith("/find-jobs")
                ? "text-accent font-semibold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className={`text-sm font-medium transition-colors ${
              pathname.startsWith("/profile")
                ? "text-accent font-semibold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {showSignOut ? (
            <form action={signOutAction} onSubmit={handleSignOut}>
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-text-darkest hover:bg-text-black text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-text-darkest hover:bg-text-black text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
            >
              Start for free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
