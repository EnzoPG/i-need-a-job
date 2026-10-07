"use client";

import { Search, Sparkles } from "lucide-react";

type Props = {
  jobTitle: string;
  location: string;
  onJobTitleChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
  bannerMessage?: string | null;
};

export function SearchControls({
  jobTitle,
  location,
  onJobTitleChange,
  onLocationChange,
  onSearch,
  bannerMessage = "Found 8 jobs and saved 4 strong matches."
}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-6 sm:p-7 shadow-xs">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Job Title */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label
              htmlFor="job-title-input"
              className="text-xs font-semibold text-text-secondary tracking-wider uppercase"
            >
              JOB TITLE
            </label>
            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="job-title-input"
                type="text"
                value={jobTitle}
                onChange={(e) => onJobTitleChange(e.target.value)}
                placeholder="Frontend Engineer"
                className="w-full bg-surface border border-border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Location */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label
              htmlFor="location-input"
              className="text-xs font-semibold text-text-secondary tracking-wider uppercase"
            >
              LOCATION
            </label>
            <input
              id="location-input"
              type="text"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Remote, New York..."
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-[42px] bg-accent hover:bg-accent-dark text-accent-foreground font-medium text-sm px-5 py-2.5 rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Find Jobs</span>
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {bannerMessage && (
          <div className="mt-2 bg-success-lightest border border-success/20 rounded-xl px-4 py-3 flex items-center gap-2.5 text-success-foreground">
            <Sparkles className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
            <span className="text-sm font-medium">{bannerMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}
