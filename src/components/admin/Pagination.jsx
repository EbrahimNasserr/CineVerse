import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Simple numeric pagination bar.
 *
 * @param {number}   page        - Current 1-based page number
 * @param {number}   totalPages  - Total number of pages
 * @param {function} onPageChange - Called with the new page number
 */
export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build a compact window: [1] … [page-1] [page] [page+1] … [last]
  const pages = [];
  const delta = 1; // siblings on each side of current page

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - delta && i <= page + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <nav
      className="flex items-center justify-between gap-2"
      aria-label="Pagination"
    >
      <p className="text-body-sm text-on-surface-variant">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-white/[0.08] text-on-surface-variant transition-colors hover:bg-white/[0.06] disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-body-sm text-on-surface-variant"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded text-body-sm transition-colors",
                p === page
                  ? "bg-crimson-gradient text-white shadow-glow"
                  : "border border-white/[0.08] text-on-surface-variant hover:bg-white/[0.06]"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded border border-white/[0.08] text-on-surface-variant transition-colors hover:bg-white/[0.06] disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
}

Pagination.propTypes = {
  page:         PropTypes.number.isRequired,
  totalPages:   PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
