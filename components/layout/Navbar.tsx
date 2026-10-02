import Link from "next/link";
import Image from "next/image";

type Props = {
  className?: string;
};

export function Navbar({ className = "" }: Props) {
  return (
    <header className={`w-full bg-surface border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto h-16 px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={124}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-text-darkest hover:bg-text-black text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            Start for free
          </Link>
        </div>
      </div>
    </header>
  );
}
