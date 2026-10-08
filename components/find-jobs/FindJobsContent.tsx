"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { AlertCircle, RefreshCw } from "lucide-react";
import { SearchControls } from "./SearchControls";
import { JobFilters, type MatchFilterOption, type SortOption } from "./JobFilters";
import { JobsTable } from "./JobsTable";
import { JobsPagination } from "./JobsPagination";
import type { JobRow } from "@/types/database";

type Props = {
  initialJobs: JobRow[];
  filteredCount: number;
  totalUserJobsCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  initialFilters: {
    q: string;
    match: MatchFilterOption;
    sort: SortOption;
  };
  queryError?: string;
};

export function FindJobsContent({
  initialJobs,
  filteredCount,
  totalUserJobsCount,
  currentPage,
  totalPages,
  pageSize,
  initialFilters,
  queryError,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Search discovery state (for calling Adzuna agent)
  const [jobTitle, setJobTitle] = useState("Frontend Engineer");
  const [location, setLocation] = useState("Remote, New York...");
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Filter input state (local string for instant typing, debounced into URL)
  const [prevInitialQ, setPrevInitialQ] = useState(initialFilters.q);
  const [searchInput, setSearchInput] = useState(initialFilters.q);

  // Sync search input if URL changes externally (e.g. back/forward navigation or clear)
  if (initialFilters.q !== prevInitialQ) {
    setPrevInitialQ(initialFilters.q);
    setSearchInput(initialFilters.q);
  }

  // URL updating helper
  const updateUrl = useCallback(
    (updates: {
      q?: string;
      match?: MatchFilterOption;
      sort?: SortOption;
      page?: number;
    }) => {
      const current = new URLSearchParams(searchParams.toString());

      const nextQ = updates.q !== undefined ? updates.q : (current.get("q") || "");
      const nextMatch = updates.match !== undefined ? updates.match : (current.get("match") || "all");
      const nextSort = updates.sort !== undefined ? updates.sort : (current.get("sort") || "match-score");
      const nextPage = updates.page !== undefined ? updates.page : parseInt(current.get("page") || "1", 10);

      const params = new URLSearchParams();

      if (nextQ.trim()) {
        params.set("q", nextQ.trim());
      }
      if (nextMatch && nextMatch !== "all") {
        params.set("match", nextMatch);
      }
      if (nextSort && nextSort !== "match-score") {
        params.set("sort", nextSort);
      }
      if (nextPage > 1) {
        params.set("page", String(nextPage));
      }

      const qs = params.toString();
      const targetUrl = qs ? `/find-jobs?${qs}` : "/find-jobs";

      startTransition(() => {
        router.replace(targetUrl, { scroll: false });
      });
    },
    [router, searchParams]
  );

  // Debounced search input handler (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== initialFilters.q) {
        updateUrl({ q: searchInput, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, initialFilters.q, updateUrl]);

  const handleMatchFilterChange = (filter: MatchFilterOption) => {
    updateUrl({ match: filter, page: 1 });
  };

  const handleSortOptionChange = (sort: SortOption) => {
    updateUrl({ sort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    updateUrl({ q: "", match: "all", sort: "match-score", page: 1 });
  };

  // Live Adzuna discovery trigger
  const handleSearchTrigger = async () => {
    if (!jobTitle.trim() || isLoading) return;

    setIsLoading(true);
    setIsError(false);
    setBannerMessage(null);

    try {
      posthog.capture("job_search_started", {
        job_title: jobTitle.trim(),
        location: location.trim() || "Any",
      });
    } catch {
      // Non-blocking telemetry
    }

    try {
      const res = await fetch("/api/agent/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          location: location.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsError(true);
        setBannerMessage(
          data.error || "Failed to search for jobs. Please verify your connection or try again."
        );
        return;
      }

      setIsError(false);
      setBannerMessage(data.message || `Discovered ${data.jobsFound || 0} jobs.`);

      // Client telemetry for discovered jobs
      if (Array.isArray(data.jobs) && data.jobs.length > 0) {
        for (const j of data.jobs) {
          try {
            posthog.capture("job_found", {
              job_id: j.id,
              title: j.title,
              company: j.company,
              match_score: j.match_score,
            });
          } catch {
            // Non-blocking telemetry
          }
        }
      }

      // Re-execute Server Component queries to refresh the live table data
      router.refresh();
      // Ensure we are viewing page 1 after discovering new listings
      updateUrl({ page: 1 });
    } catch (err) {
      console.error("[FindJobsContent/handleSearchTrigger] Search error:", err);
      setIsError(true);
      setBannerMessage("Network error during job discovery. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFiltered = Boolean(
    initialFilters.q.trim() ||
      initialFilters.match !== "all" ||
      initialFilters.sort !== "match-score"
  );

  const startIndex = filteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredCount);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Search Controls Card */}
      <SearchControls
        jobTitle={jobTitle}
        location={location}
        onJobTitleChange={setJobTitle}
        onLocationChange={setLocation}
        onSearch={handleSearchTrigger}
        bannerMessage={bannerMessage}
        isLoading={isLoading}
        isError={isError}
      />

      {/* Query Error Notification (if database query encountered error) */}
      {queryError && (
        <div className="bg-error/10 border border-error/20 rounded-xl px-4 py-3 flex items-center justify-between text-error text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{queryError}</span>
          </div>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-error/30 rounded-lg hover:bg-surface-secondary text-xs font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 2. Filter Bar Card */}
      <JobFilters
        searchQuery={searchInput}
        onSearchQueryChange={setSearchInput}
        matchFilter={initialFilters.match}
        onMatchFilterChange={handleMatchFilterChange}
        sortOption={initialFilters.sort}
        onSortOptionChange={handleSortOptionChange}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
        isPending={isPending}
      />

      {/* 3. Jobs Table Card */}
      <JobsTable
        jobs={initialJobs}
        isPending={isPending}
        totalUserJobsCount={totalUserJobsCount}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Pagination Footer */}
      <JobsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={filteredCount}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
        isPending={isPending}
      />
    </div>
  );
}
