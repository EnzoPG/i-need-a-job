import Image from "next/image";

type Props = {
  className?: string;
};

export function HowItWorks({ className = "" }: Props) {
  return (
    <section className={`w-full py-12 sm:py-16 bg-diagonal-stripes ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-surface border border-border overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Agent Terminal Mockup */}
          <div className="p-8 lg:p-12 flex items-center justify-center bg-surface-secondary/30">
            <div className="w-full max-w-md">
              <Image
                src="/images/agnet-log.png"
                alt="JobPilot AI Agent execution log"
                width={520}
                height={420}
                className="w-full h-auto object-contain shadow-xs rounded-xl"
              />
            </div>
          </div>

          {/* Right Column: Heading and value props */}
          <div className="border-t md:border-t-0 md:border-l border-border flex flex-col">
            <div className="p-8 sm:p-10 border-b border-border">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary max-w-sm leading-tight">
                Apply With More Confidence, Every Time
              </h2>
            </div>

            <div className="p-8 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">
                Understand your match score
              </h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                See how your profile lines up with each role before you apply. Get
                a clear breakdown of what fits and what&apos;s missing.
              </p>
            </div>

            <div className="p-8 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">
                AI-Powered Job Matching
              </h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                Stop guessing which jobs are worth applying to. JobPilot scores
                every role against your actual skills so you focus on the ones that
                matter.
              </p>
            </div>

            <div className="p-8">
              <h3 className="text-base font-semibold text-text-primary">
                Focus on the right roles
              </h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                Filter out low fit jobs and stay on the ones that actually matter.
                Spend less time sorting and more time applying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
