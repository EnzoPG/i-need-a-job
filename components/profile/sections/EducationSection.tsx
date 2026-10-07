"use client";

import type { ProfileData } from "@/types/profile";

type Props = {
  formData: ProfileData;
  onChange: <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => void;
};

export function EducationSection({ formData, onChange }: Props) {
  return (
    <div className="mb-8 pt-6 border-t border-border">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Education
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Highest Degree
          </label>
          <select
            value={formData.highestDegree}
            onChange={(e) => onChange("highestDegree", e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          >
            <option value="High School">High School</option>
            <option value="Associate">Associate Degree</option>
            <option value="Bachelor's">Bachelor&apos;s</option>
            <option value="Master's">Master&apos;s</option>
            <option value="Doctorate">Doctorate</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Field of Study
          </label>
          <input
            type="text"
            value={formData.fieldOfStudy}
            onChange={(e) => onChange("fieldOfStudy", e.target.value)}
            placeholder="Computer Science"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Institution Name
          </label>
          <input
            type="text"
            value={formData.institutionName}
            onChange={(e) => onChange("institutionName", e.target.value)}
            placeholder="E.g. State University"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Graduation Year
          </label>
          <input
            type="text"
            value={formData.graduationYear}
            onChange={(e) => onChange("graduationYear", e.target.value)}
            placeholder="YYYY"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
