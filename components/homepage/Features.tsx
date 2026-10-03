import Image from "next/image";

type Props = {
  className?: string;
};

export function Features({ className = "" }: Props) {
  return (
    <section className={`w-full py-12 sm:py-16 bg-diagonal-stripes ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-surface border border-border overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Heading and value props */}
          <div className="flex flex-col">
            <div className="p-8 sm:p-10 border-b border-border">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary max-w-sm leading-tight">
                Manage Your Job Search With Ease
              </h2>
            </div>

            <div className="p-8 border-b border-border border-l-2 border-l-accent bg-surface">
              <h3 className="text-base font-semibold text-text-primary">
                Find jobs that actually fit
              </h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                Search by title and location or paste a job link. Get matched roles
                you can quickly scan.
              </p>
            </div>

            <div className="p-8 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">
                Know the Company Before You Apply
              </h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                Stop guessing what a company is about. INeedAJob browses their site
                and gives you everything you need to apply with confidence.
              </p>
            </div>

            <div className="p-8">
              <h3 className="text-base font-semibold text-text-primary">
                Keep track of every application
              </h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                Keep a clear view of every job you&apos;ve found, tailored. Your
                activity and progress all stay in one simple place.
              </p>
            </div>
          </div>

          {/* Right Column: Jobs table mockup */}
          <div className="border-t md:border-t-0 md:border-l border-border p-8 lg:p-12 flex items-center justify-center bg-surface-secondary/30">
            <div className="w-full max-w-md">
              <Image
                src="/images/jobs-lists.png"
                alt="Job matches list preview"
                width={520}
                height={420}
                className="w-full h-auto object-contain shadow-xs rounded-xl border border-border"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
