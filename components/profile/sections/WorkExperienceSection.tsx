"use client";

import { Plus, Calendar } from "lucide-react";
import type { WorkExperienceItem } from "@/types/profile";

type RoleField =
  | "company"
  | "title"
  | "startDate"
  | "endDate"
  | "current"
  | "responsibilities";

type Props = {
  roles: WorkExperienceItem[];
  onAddRole: () => void;
  onRoleChange: (id: string, field: RoleField, value: string | boolean) => void;
};

export function WorkExperienceSection({
  roles,
  onAddRole,
  onRoleChange,
}: Props) {
  return (
    <div className="mb-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Work Experience
        </h3>
        {roles.length < 3 && (
          <button
            type="button"
            onClick={onAddRole}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add role</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="border border-border rounded-xl p-5 sm:p-6 bg-surface space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  value={role.company}
                  onChange={(e) => onRoleChange(role.id, "company", e.target.value)}
                  placeholder="Company Name"
                  className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  value={role.title}
                  onChange={(e) => onRoleChange(role.id, "title", e.target.value)}
                  placeholder="Job Title"
                  className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={role.startDate}
                    onChange={(e) => onRoleChange(role.id, "startDate", e.target.value)}
                    placeholder="January 2022"
                    className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors pr-10"
                  />
                  <Calendar className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase">
                    End Date
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={role.current}
                      onChange={(e) => {
                        const isCurrent = e.target.checked;
                        onRoleChange(role.id, "current", isCurrent);
                        if (isCurrent) {
                          onRoleChange(role.id, "endDate", "--------- ----");
                        }
                      }}
                      className="rounded border-border text-accent focus:ring-accent"
                    />
                    <span>Currently working here</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={role.endDate}
                  disabled={role.current}
                  onChange={(e) => onRoleChange(role.id, "endDate", e.target.value)}
                  placeholder="MM/YYYY or Present"
                  className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary disabled:bg-surface-secondary disabled:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
                Key Responsibilities
              </label>
              <textarea
                rows={3}
                value={role.responsibilities}
                onChange={(e) => onRoleChange(role.id, "responsibilities", e.target.value)}
                placeholder="Built Next.js features and optimized web vitals. Led a team of 3 developers."
                className="w-full bg-surface border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-y"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
