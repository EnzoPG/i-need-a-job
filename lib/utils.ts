/**
 * Core application constants and utilities.
 */

export const MATCH_THRESHOLD = 70;
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Formats an ISO date string into human friendly relative time.
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "Recently";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // If timestamp is slightly in the future due to clock drift
  if (diffMs < 0) return "Today";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return "Just now";
  }

  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
