"use client";

import { useRouter } from "next/navigation";
import { Building2, FilterX, RotateCcw } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { JobRow } from "@/types/database";

type Props = {
  jobs: JobRow[];
  isPending?: boolean;
  totalUserJobsCount: number;
  onClearFilters: () => void;
};

function getScoreColorClass(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-info-medium";
  return "bg-warning";
}

export function JobsTable({
  jobs,
  isPending = false,
  totalUserJobsCount,
  onClearFilters,
}: Props) {
  const router = useRouter();

  if (jobs.length === 0) {
    // Initial empty state: User has not searched for or discovered any jobs yet
    if (totalUserJobsCount === 0) {
      return (
        <div className="w-full bg-surface border border-border rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-accent-muted border border-border flex items-center justify-center text-accent mx-auto mb-3">
            <Building2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">
            No jobs discovered yet
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Use the search controls above to search for tech positions by role and location. Our agent will discover vacancies and score them against your skills.
          </p>
        </div>
      );
    }

    // Filtered empty state: User has saved jobs, but current filter combination returns zero matches
    return (
      <div className="w-full bg-surface border border-border rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border flex items-center justify-center text-text-secondary mx-auto mb-3">
          <FilterX className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          No jobs match your filters
        </h3>
        <p className="text-sm text-text-secondary max-w-sm mx-auto mb-4">
          No job listings match your current search keyword or match tier. Try broadening your criteria or reset filters.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 bg-surface hover:bg-surface-secondary border border-border text-text-primary text-sm font-medium px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-text-secondary" aria-hidden="true" />
          <span>Clear Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`w-full bg-surface border border-border rounded-2xl shadow-xs overflow-hidden transition-opacity duration-200 ${
        isPending ? "opacity-60 pointer-events-none select-none" : "opacity-100"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th
                scope="col"
                className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[24%]"
              >
                COMPANY
              </th>
              <th
                scope="col"
                className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[28%]"
              >
                ROLE
              </th>
              <th
                scope="col"
                className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[22%]"
              >
                MATCH SCORE
              </th>
              <th
                scope="col"
                className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[14%]"
              >
                SALARY EST.
              </th>
              <th
                scope="col"
                className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[12%]"
              >
                DATE FOUND
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => {
              const scoreFill = getScoreColorClass(job.match_score);
              const dateText = formatRelativeTime(job.found_at);

              return (
                <tr
                  key={job.id}
                  onClick={() => router.push(`/find-jobs/${job.id}`)}
                  className="hover:bg-surface-secondary transition-colors cursor-pointer group"
                >
                  {/* Company */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-muted shrink-0 group-hover:border-border-muted transition-colors">
                        <Building2 className="w-4.5 h-4.5 text-text-secondary" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-semibold text-text-primary">
                        {job.company}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4.5 px-6">
                    <span className="text-sm font-medium text-text-primary">
                      {job.title}
                    </span>
                  </td>

                  {/* Match Score */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 sm:w-32 h-1.5 bg-border rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${scoreFill}`}
                          style={{ width: `${Math.min(Math.max(job.match_score, 0), 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-text-primary">
                        {job.match_score}%
                      </span>
                    </div>
                  </td>

                  {/* Salary Est */}
                  <td className="py-4.5 px-6">
                    <span className="text-sm font-medium text-text-secondary">
                      {job.salary || "Not specified"}
                    </span>
                  </td>

                  {/* Date Found */}
                  <td className="py-4.5 px-6">
                    <span className="text-sm font-medium text-text-secondary">
                      {dateText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
