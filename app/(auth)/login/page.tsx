import Link from "next/link";
import Image from "next/image";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const isAuthError = params.error === "oauth";

  return (
    <div className="min-h-screen bg-diagonal-stripes flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Top Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Image
              src="/logo.png"
              alt="INeedAJob"
              width={140}
              height={36}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-xs">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Welcome to INeedAJob
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Sign in with your developer account to get started.
            </p>
          </div>

          {isAuthError && (
            <div className="mb-6 p-3 rounded-lg border border-border bg-accent-muted text-error text-xs text-center">
              Authentication failed or was canceled. Please try again.
            </div>
          )}

          <OAuthButtons />

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-text-muted">
              By signing in, you agree to INeedAJob&apos;s{" "}
              <Link href="#" className="underline hover:text-text-secondary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-text-secondary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            &larr; Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
