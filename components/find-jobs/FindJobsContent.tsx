"use client";

import { useState, useMemo } from "react";
import { SearchControls } from "./SearchControls";
import { JobFilters, type MatchFilterOption, type SortOption } from "./JobFilters";
import { JobsTable } from "./JobsTable";
import { JobsPagination } from "./JobsPagination";
import { MOCK_JOBS, type MockJob } from "@/lib/mock-jobs";

const PAGE_SIZE = 6;
const HIGH_MATCH_THRESHOLD = 70;

export function FindJobsContent() {
  const [jobTitle, setJobTitle] = useState("Frontend Engineer");
  const [location, setLocation] = useState("Remote, New York...");
  const [bannerMessage, setBannerMessage] = useState<string | null>(
    "Found 8 jobs and saved 4 strong matches."
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [matchFilter, setMatchFilter] = useState<MatchFilterOption>("all");
  const [sortOption, setSortOption] = useState<SortOption>("match-score");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchTrigger = () => {
    // In this mock UI phase, show feedback confirming search criteria
    setBannerMessage(`Found ${MOCK_JOBS.length} jobs for ${jobTitle || "all roles"}.`);
    setCurrentPage(1);
  };

  const filteredJobs = useMemo(() => {
    let result: MockJob[] = [...MOCK_JOBS];

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
  }, [searchQuery, matchFilter, sortOption]);

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
