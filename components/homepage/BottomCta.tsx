import Link from "next/link";

type Props = {
  className?: string;
};

export function BottomCta({ className = "" }: Props) {
  return (
    <section className={`w-full bg-surface bg-cta-gradient border-y border-border py-20 px-6 sm:px-8 text-center ${className}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.18]">
          Your next job search can feel a
          <br className="hidden sm:inline" /> lot less overwhelming
        </h2>

        <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
          Set up your profile, upload your resume, and start finding matches in
          minutes.
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
      </div>
    </section>
  );
}
