"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  clearFilters,
  setSearchQuery,
  toggleGenreFilter,
} from "@/features/movies/moviesSlice";
import { GENRES } from "@/lib/constants";
import { useDispatch, useSelector } from "@/store/hooks";

export function MovieFilters() {
  const dispatch = useDispatch();
  const activeGenreFilters = useSelector(
    (state) => state.movies.activeGenreFilters,
  );
  const searchQuery = useSelector((state) => state.movies.searchQuery);
  const hasActiveFilters =
    activeGenreFilters.length > 0 || searchQuery.trim().length > 0;

  return (
    <section className="rounded-[24px] border border-white/[0.08] bg-surface-container/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 items-start gap-3">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-crimson/15 text-primary">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
              Cinema filters
            </p>
            <h3 className="text-title-md">Find the right screening fast</h3>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Search by title or genre, then fine-tune the lineup with a single
              tap.
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="secondary"
            className="w-full lg:w-auto"
            onClick={() => dispatch(clearFilters())}
          >
            <X size={16} className="mr-2" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search movies</span>
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            value={searchQuery}
            onChange={(event) => dispatch(setSearchQuery(event.target.value))}
            placeholder="Search by title or genre"
            className="w-full rounded-xl border border-white/[0.08] bg-obsidian/80 py-3 pl-10 pr-4 text-body-sm text-on-surface outline-none transition focus:border-crimson"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-on-surface-variant">
          <span className="rounded-full border border-white/[0.08] px-3 py-2">
            {activeGenreFilters.length > 0
              ? `${activeGenreFilters.length} active`
              : "All genres"}
          </span>
          {searchQuery.trim() && (
            <span className="rounded-full border border-white/[0.08] px-3 py-2">
              “{searchQuery.trim()}”
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {GENRES.map((genre) => (
          <Chip
            key={genre}
            active={activeGenreFilters.includes(genre)}
            onClick={() => dispatch(toggleGenreFilter(genre))}
          >
            {genre}
          </Chip>
        ))}
      </div>
    </section>
  );
}
