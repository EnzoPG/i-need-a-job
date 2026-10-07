"use client";

import type { ProfileData } from "@/types/profile";
import { TagInput } from "@/components/profile/TagInput";

type Props = {
  formData: ProfileData;
  onChange: <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => void;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  onAddIndustry: (industry: string) => void;
  onRemoveIndustry: (industry: string) => void;
};

export function ProfessionalInfoSection({
  formData,
  onChange,
  onAddSkill,
  onRemoveSkill,
  onAddIndustry,
  onRemoveIndustry,
}: Props) {
  return (
    <div className="mb-8 pt-6 border-t border-border">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Professional Info
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
            Current/Recent Job Title
          </label>
          <input
            type="text"
            value={formData.currentTitle}
            onChange={(e) => onChange("currentTitle", e.target.value)}
            placeholder="Frontend Engineer"
            className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => onChange("experienceLevel", e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            >
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              value={formData.yearsExperience}
              onChange={(e) => onChange("yearsExperience", e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Skills Tag Input */}
        <TagInput
          label="Skills"
          tags={formData.skills}
          placeholder="Add a skill"
          onAddTag={onAddSkill}
          onRemoveTag={onRemoveSkill}
        />

        {/* Industries Tag Input */}
        <TagInput
          label="Industries Worked In (Optional)"
          tags={formData.industries}
          placeholder="E.g. FinTech, Healthcare"
          onAddTag={onAddIndustry}
          onRemoveTag={onRemoveIndustry}
        />
      </div>
    </div>
  );
}
