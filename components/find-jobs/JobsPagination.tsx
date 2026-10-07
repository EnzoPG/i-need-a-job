"use client";

type Props = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
};

export function JobsPagination({
  currentPage,
  totalPages,
  totalResults,
  startIndex,
  endIndex,
  onPageChange
}: Props) {
  if (totalResults === 0) return null;

  // Generate page numbers array with ellipsis support
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Middle pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="w-full bg-surface border border-border rounded-2xl px-6 py-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Results counter */}
      <div className="text-sm text-text-secondary">
        Showing <span className="font-semibold text-text-primary">{startIndex}</span> to{" "}
        <span className="font-semibold text-text-primary">{endIndex}</span> of{" "}
        <span className="font-semibold text-text-primary">{totalResults}</span> results
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Previous
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) => {
          if (p === "ellipsis") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-text-muted select-none">
                ...
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-8 h-8 px-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
                isActive
                  ? "border-accent bg-accent/10 text-accent font-semibold"
                  : "border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
