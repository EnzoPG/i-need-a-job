"use client";

import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import type { MockJob } from "@/lib/mock-jobs";

type Props = {
  jobs: MockJob[];
};

function getScoreColorClass(score: number): string {
  if (score >= 90) return "bg-success";
  if (score >= 80) return "bg-info-medium";
  if (score >= 60) return "bg-warning";
  return "bg-text-muted";
}

export function JobsTable({ jobs }: Props) {
  const router = useRouter();

  if (jobs.length === 0) {
    return (
      <div className="w-full bg-surface border border-border rounded-2xl p-12 text-center shadow-xs">
        <Building2 className="w-10 h-10 text-text-muted mx-auto mb-3" aria-hidden="true" />
        <h3 className="text-base font-semibold text-text-primary mb-1">No jobs found</h3>
        <p className="text-sm text-text-secondary max-w-sm mx-auto">
          No job listings match your current filters. Try adjusting your search keyword or match tier.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th scope="col" className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[24%]">
                COMPANY
              </th>
              <th scope="col" className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[28%]">
                ROLE
              </th>
              <th scope="col" className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[22%]">
                MATCH SCORE
              </th>
              <th scope="col" className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[14%]">
                SALARY EST.
              </th>
              <th scope="col" className="py-3.5 px-6 text-xs font-semibold text-text-secondary tracking-wider uppercase w-[12%]">
                DATE FOUND
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => {
              const scoreFill = getScoreColorClass(job.match_score);
              const dateText = job.displayDate || "Recently";

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
