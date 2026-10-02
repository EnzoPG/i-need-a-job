import { AlertCircle } from "lucide-react";

type Props = {
  completionPercentage?: number;
  missingFields?: string[];
  className?: string;
};

export function CompletionIndicator({
  completionPercentage = 70,
  missingFields = ["PHONE", "LOCATION", "EDUCATION"],
  className = "",
}: Props) {
  // SVG circle circumference for r = 32: 2 * PI * 32 ~= 201
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div
      className={`bg-surface border border-border rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs ${className}`}
    >
      {/* Left Column: Details & Missing Badges */}
      <div className="flex items-start gap-3.5">
        <div className="text-error shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-error" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Profile needs attention
          </h2>
          <p className="mt-1 text-xs text-text-secondary leading-relaxed max-w-xl">
            Complete the missing fields to improve your chance of getting
            tailored matches and generating quality resumes.
          </p>

          {missingFields.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              {missingFields.map((field) => (
                <span
                  key={field}
                  className="text-[11px] font-semibold text-error bg-error/10 border border-error/20 px-2 py-0.5 rounded uppercase tracking-wider"
                >
                  {field}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Circular Progress Meter */}
      <div className="relative w-20 h-20 shrink-0 self-center sm:self-auto flex items-center justify-center">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--color-error)"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-lg font-bold text-text-primary tracking-tight">
          {completionPercentage}%
        </span>
      </div>
    </div>
  );
}
