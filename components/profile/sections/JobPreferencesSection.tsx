"use client";

import type { ProfileData } from "@/types/profile";

type Props = {
  formData: ProfileData;
  onChange: <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => void;
};

export function JobPreferencesSection({ formData, onChange }: Props) {
  return (
    <div className="mb-8 pt-6 border-t border-border">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Job Preferences
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Job Titles Seeking
          </label>
          <input
            type="text"
            value={formData.jobTitlesSeeking}
            onChange={(e) => onChange("jobTitlesSeeking", e.target.value)}
            placeholder="Frontend Engineer, React Developer"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Remote Preference
            </label>
            <select
              value={formData.remotePreference}
              onChange={(e) => onChange("remotePreference", e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            >
              <option value="Any">Any</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Salary Expectation (Optional)
            </label>
            <input
              type="text"
              value={formData.salaryExpectation}
              onChange={(e) => onChange("salaryExpectation", e.target.value)}
              placeholder="E.g. $120k+"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Preferred Locations (Optional)
          </label>
          <input
            type="text"
            value={formData.preferredLocations}
            onChange={(e) => onChange("preferredLocations", e.target.value)}
            placeholder="E.g. New York, London"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
