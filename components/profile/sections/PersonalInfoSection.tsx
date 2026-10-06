"use client";

import type { ProfileData } from "@/types/profile";

type Props = {
  formData: ProfileData;
  onChange: <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => void;
};

export function PersonalInfoSection({ formData, onChange }: Props) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Personal Info
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2 text-sm text-text-secondary cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="City, Country"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => onChange("linkedinUrl", e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Portfolio / GitHub
          </label>
          <input
            type="url"
            value={formData.portfolioUrl}
            onChange={(e) => onChange("portfolioUrl", e.target.value)}
            placeholder="https://github.com/username"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Work Authorization
          </label>
          <select
            value={formData.workAuthorization}
            onChange={(e) => onChange("workAuthorization", e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          >
            <option value="Citizen">Citizen</option>
            <option value="Permanent Resident">Permanent Resident</option>
            <option value="Visa Required">Visa Required</option>
          </select>
        </div>
      </div>
    </div>
  );
}
