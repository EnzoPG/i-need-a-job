import { createInsforgeServer } from "@/lib/insforge-server";
import { MATCH_THRESHOLD, DEFAULT_PAGE_SIZE } from "@/lib/utils";
import type { JobRow } from "@/types/database";

export type MatchFilterOption = "all" | "high" | "low";
export type SortOption = "match-score" | "newest" | "oldest";

export type JobQueryOptions = {
  q?: string;
  match?: MatchFilterOption;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
};

export type GetUserJobsResult = {
  jobs: JobRow[];
  filteredCount: number;
  totalUserJobsCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  error?: string;
};

/**
 * Sanitizes search query string to prevent PostgREST syntax injection errors.
 * PostgREST uses parentheses, commas, dots, and colons in its filter language.
 */
function sanitizeSearchQuery(raw: string | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/[(),."':;\\/]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

/**
 * Queries jobs for the authenticated user with filtering, sorting, and pagination.
 */
export async function getUserJobs(
  userId: string,
  options: JobQueryOptions = {}
): Promise<GetUserJobsResult> {
  const pageSize = options.pageSize && options.pageSize > 0 ? options.pageSize : DEFAULT_PAGE_SIZE;
  let requestedPage = Math.max(1, Math.floor(options.page || 1));

  const validMatch: MatchFilterOption =
    options.match === "high" || options.match === "low" ? options.match : "all";

  const validSort: SortOption =
    options.sort === "newest" || options.sort === "oldest" ? options.sort : "match-score";

  const cleanQuery = sanitizeSearchQuery(options.q);

  try {
    const insforge = await createInsforgeServer();

    // 1. Get total user jobs count (unfiltered) to distinguish empty DB from filtered empty
    const { count: totalUserJobsCount, error: totalCountError } = await insforge.database
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (totalCountError) {
      console.error("[jobs/getUserJobs] Error fetching total user count:", totalCountError);
    }

    const totalJobsInDb = totalUserJobsCount ?? 0;

    // Helper to build filtered query
    const buildFilteredQuery = () => {
      let query = insforge.database
        .from("jobs")
        .select("*", { count: "exact" })
        .eq("user_id", userId);

      // Search keyword filter
      if (cleanQuery) {
        query = query.or(`title.ilike.%${cleanQuery}%,company.ilike.%${cleanQuery}%`);
      }

      // Match score filter
      if (validMatch === "high") {
        query = query.gte("match_score", MATCH_THRESHOLD);
      } else if (validMatch === "low") {
        query = query.lt("match_score", MATCH_THRESHOLD);
      }

      // Sort
      if (validSort === "match-score") {
        query = query
          .order("match_score", { ascending: false })
          .order("found_at", { ascending: false });
      } else if (validSort === "newest") {
        query = query.order("found_at", { ascending: false });
      } else if (validSort === "oldest") {
        query = query.order("found_at", { ascending: true });
      }

      return query;
    };

    // Helper to build count-only query for recovery
    const buildCountQuery = () => {
      let query = insforge.database
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      if (cleanQuery) {
        query = query.or(`title.ilike.%${cleanQuery}%,company.ilike.%${cleanQuery}%`);
      }

      if (validMatch === "high") {
        query = query.gte("match_score", MATCH_THRESHOLD);
      } else if (validMatch === "low") {
        query = query.lt("match_score", MATCH_THRESHOLD);
      }

      return query;
    };

    // Calculate initial range
    let from = (requestedPage - 1) * pageSize;
    let to = from + pageSize - 1;

    const initialResult = await buildFilteredQuery().range(from, to);
    let data = initialResult.data;
    let count = initialResult.count;
    let error = initialResult.error;

    // Handle PostgREST range out of bounds error (PGRST103: Requested range not satisfiable)
    if (error && (error as { code?: string }).code === "PGRST103") {
      const countResult = await buildCountQuery();
      const validFilteredCount = countResult.count ?? 0;

      if (validFilteredCount === 0) {
        return {
          jobs: [],
          filteredCount: 0,
          totalUserJobsCount: totalJobsInDb,
          currentPage: 1,
          totalPages: 1,
          pageSize,
        };
      }

      requestedPage = Math.max(1, Math.ceil(validFilteredCount / pageSize));
      from = (requestedPage - 1) * pageSize;
      to = from + pageSize - 1;

      const clampedResult = await buildFilteredQuery().range(from, to);
      data = clampedResult.data;
      count = validFilteredCount;
      error = clampedResult.error;
    }

    if (error) {
      console.error("[jobs/getUserJobs] Query execution error:", error);
      return {
        jobs: [],
        filteredCount: 0,
        totalUserJobsCount: totalJobsInDb,
        currentPage: 1,
        totalPages: 1,
        pageSize,
        error: "Failed to retrieve job listings. Please try again.",
      };
    }

    const filteredCount = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize));

    // Handle out-of-bounds page requests by clamping to the max available page
    if (filteredCount > 0 && requestedPage > totalPages) {
      requestedPage = totalPages;
      from = (requestedPage - 1) * pageSize;
      to = from + pageSize - 1;

      const secondAttempt = await buildFilteredQuery().range(from, to);
      if (!secondAttempt.error && secondAttempt.data) {
        data = secondAttempt.data;
      }
    }

    return {
      jobs: (data as JobRow[]) || [],
      filteredCount,
      totalUserJobsCount: totalJobsInDb,
      currentPage: requestedPage,
      totalPages,
      pageSize,
    };
  } catch (err) {
    console.error("[jobs/getUserJobs] Unexpected exception:", err);
    return {
      jobs: [],
      filteredCount: 0,
      totalUserJobsCount: 0,
      currentPage: 1,
      totalPages: 1,
      pageSize,
      error: "An unexpected error occurred while loading jobs.",
    };
  }
}
