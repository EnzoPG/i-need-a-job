"use client";

import { useState, useMemo } from "react";
import posthog from "posthog-js";
import { SearchControls } from "./SearchControls";
import { JobFilters, type MatchFilterOption, type SortOption } from "./JobFilters";
import { JobsTable } from "./JobsTable";
import { JobsPagination } from "./JobsPagination";
import { MOCK_JOBS, type MockJob } from "@/lib/mock-jobs";
import type { JobRow } from "@/types/database";

const PAGE_SIZE = 6;
const HIGH_MATCH_THRESHOLD = 70;

export function FindJobsContent() {
  const [jobTitle, setJobTitle] = useState("Frontend Engineer");
  const [location, setLocation] = useState("Remote, New York...");
  const [bannerMessage, setBannerMessage] = useState<string | null>(
    "Found 8 jobs and saved 4 strong matches."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [jobs, setJobs] = useState<MockJob[]>(MOCK_JOBS);

  const [searchQuery, setSearchQuery] = useState("");
  const [matchFilter, setMatchFilter] = useState<MatchFilterOption>("all");
  const [sortOption, setSortOption] = useState<SortOption>("match-score");
  const [currentPage, setCurrentPage] = useState(1);

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

      if (Array.isArray(data.jobs) && data.jobs.length > 0) {
        const receivedJobs: MockJob[] = (data.jobs as JobRow[]).map((job) => ({
          ...job,
          displayDate: "Today",
        }));
        setJobs(receivedJobs);

        // Track found jobs in client PostHog
        for (const j of receivedJobs) {
          try {
            posthog.capture("job_found", {
              job_id: j.id,
              title: j.title,
              company: j.company,
              match_score: j.match_score,
            });
          } catch {
            // Ignore telemetry exceptions
          }
        }
      }

      setCurrentPage(1);
    } catch (err) {
      console.error("[FindJobsContent/handleSearchTrigger] Search error:", err);
      setIsError(true);
      setBannerMessage("Network error during job discovery. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    let result: MockJob[] = [...jobs];

    // Filter by keyword (company or role)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (job) =>
          job.company.toLowerCase().includes(q) ||
          job.title.toLowerCase().includes(q)
      );
    }

    // Filter by match tier
    if (matchFilter === "high") {
      result = result.filter((job) => job.match_score >= HIGH_MATCH_THRESHOLD);
    } else if (matchFilter === "low") {
      result = result.filter((job) => job.match_score < HIGH_MATCH_THRESHOLD);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === "match-score") {
        return b.match_score - a.match_score;
      }
      if (sortOption === "newest") {
        return new Date(b.found_at).getTime() - new Date(a.found_at).getTime();
      }
      if (sortOption === "oldest") {
        return new Date(a.found_at).getTime() - new Date(b.found_at).getTime();
      }
      return 0;
    });

    return result;
  }, [jobs, searchQuery, matchFilter, sortOption]);

  const totalResults = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  // Compute slice for current page
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  const startIndex = totalResults === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, totalResults);

  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleMatchFilterChange = (val: MatchFilterOption) => {
    setMatchFilter(val);
    setCurrentPage(1);
  };

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

      {/* 2. Filter Bar Card */}
      <JobFilters
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        matchFilter={matchFilter}
        onMatchFilterChange={handleMatchFilterChange}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
      />

      {/* 3. Jobs Table Card */}
      <JobsTable jobs={paginatedJobs} />

      {/* 4. Pagination Footer */}
      <JobsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
