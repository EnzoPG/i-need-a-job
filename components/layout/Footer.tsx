import Link from "next/link";
import Image from "next/image";

type Props = {
  className?: string;
};

export function Footer({ className = "" }: Props) {
  return (
    <footer className={`w-full bg-surface border-t border-border py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={116}
            height={30}
            className="h-7 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <Link
            href="/dashboard"
            className="hover:text-text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="hover:text-text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="hover:text-text-primary transition-colors"
          >
            Terms & Condition
          </Link>
        </div>
      </div>
    </footer>
  );
}
