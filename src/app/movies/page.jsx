import { MovieGrid } from "@/features/movies/components/MovieGrid";
import { MovieFilters } from "@/features/movies/components/MovieFilters";
import { FEATURED_MOVIE } from "@/lib/constants/mockMovies";

export default function MoviesPage() {
  return (
    <div className="flex flex-col gap-6 py-20 md:py-20 max-w-7xl mx-auto px-4 md:px-0">
      <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-crimson/20 via-obsidian to-slate-900/70 p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,57,70,0.22),transparent_45%)]" />
        <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-crimson/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Now screening
            </p>
            <h1 className="text-headline-md">
              Curated movie nights, one tap away.
            </h1>
            <p className="mt-3 text-body-sm text-on-surface-variant">
              Browse the latest premieres, discover each story’s mood, and book
              your next cinematic escape in minutes.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-on-surface-variant">
                4K sound
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-on-surface-variant">
                Fast booking
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-on-surface-variant">
                Premium seats
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl border border-white/[0.08] p-4 md:min-w-[280px]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">
              Featured release
            </p>
            <p className="mt-2 font-display text-title-lg">
              {FEATURED_MOVIE.title}
            </p>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              {FEATURED_MOVIE.genres.join(" • ")} • {FEATURED_MOVIE.runtime}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-headline-sm">Browse the slate</h2>
          <p className="text-body-sm text-on-surface-variant">
            Narrow the lineup by genre, search instantly, and head straight to a
            cinematic booking.
          </p>
        </div>
        <div className="rounded-full border border-white/[0.08] bg-surface-container/70 px-3 py-2 text-body-sm text-on-surface-variant">
          Updated daily
        </div>
      </div>

      <MovieFilters />
      <MovieGrid />
    </div>
  );
}
