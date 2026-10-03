import Link from "next/link";
import Image from "next/image";

type Props = {
  className?: string;
};

export function Hero({ className = "" }: Props) {
  return (
    <section className={`relative overflow-hidden bg-surface bg-hero-gradient border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.12]">
          Job hunting is hard.
          <br />
          Your tools shouldn&apos;t be.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Stop applying blind. INeedAJob finds the jobs, researches the companies, and
          gives you everything you need to stand out.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-text-darkest hover:bg-text-black text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            <span>Get Started</span>
            <svg
              className="w-3 h-3 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </Link>
          <Link
            href="/find-jobs"
            className="inline-flex items-center bg-surface hover:bg-surface-secondary text-text-primary border border-border text-sm font-medium px-5 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            Find Your First Match
          </Link>
        </div>

        <div className="mt-14 max-w-5xl mx-auto px-2 sm:px-4">
          <div className="relative mx-auto transition-transform">
            <Image
              src="/images/dashboard-demo.png"
              alt="INeedAJob Dashboard Overview"
              width={1200}
              height={628}
              priority
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
