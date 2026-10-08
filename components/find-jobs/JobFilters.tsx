"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, RotateCcw } from "lucide-react";
import type { MatchFilterOption, SortOption } from "@/lib/services/jobs";

export type { MatchFilterOption, SortOption };

type Props = {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  matchFilter: MatchFilterOption;
  onMatchFilterChange: (filter: MatchFilterOption) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
  isPending?: boolean;
};

const MATCH_FILTER_LABELS: Record<MatchFilterOption, string> = {
  all: "All Matches",
  high: "High Match (70%+)",
  low: "Low Match (<70%)"
};

const SORT_LABELS: Record<SortOption, string> = {
  "match-score": "Match Score",
  newest: "Newest",
  oldest: "Oldest"
};

export function JobFilters({
  searchQuery,
  onSearchQueryChange,
  matchFilter,
  onMatchFilterChange,
  sortOption,
  onSortOptionChange,
  onClearFilters,
  isFiltered,
  isPending = false
}: Props) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-4 sm:px-6 sm:py-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Search Filter Input */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Search className="w-4 h-4 text-text-muted shrink-0" aria-hidden="true" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Filter by company or role..."
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {/* Filter and Sort Dropdowns + Optional Reset */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        {/* Clear Filters Quick Action (visible when filters are active) */}
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary transition-colors cursor-pointer disabled:opacity-50"
            title="Reset to default filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}

        {/* Match Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen((prev) => !prev);
              setIsSortOpen(false);
            }}
            disabled={isPending}
            className="inline-flex items-center justify-between gap-2 bg-surface hover:bg-surface-secondary border border-border text-text-primary text-sm font-medium px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            aria-expanded={isFilterOpen}
          >
            <span>{MATCH_FILTER_LABELS[matchFilter]}</span>
            <ChevronDown className="w-4 h-4 text-text-secondary" aria-hidden="true" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
              {(Object.keys(MATCH_FILTER_LABELS) as MatchFilterOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onMatchFilterChange(option);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    matchFilter === option
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  <span>{MATCH_FILTER_LABELS[option]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => {
              setIsSortOpen((prev) => !prev);
              setIsFilterOpen(false);
            }}
            disabled={isPending}
            className="inline-flex items-center justify-between gap-2 bg-surface hover:bg-surface-secondary border border-border text-text-primary text-sm font-medium px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            aria-expanded={isSortOpen}
          >
            <span>{SORT_LABELS[sortOption]}</span>
            <ChevronDown className="w-4 h-4 text-text-secondary" aria-hidden="true" />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-surface border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSortOptionChange(option);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    sortOption === option
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  <span>{SORT_LABELS[option]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
