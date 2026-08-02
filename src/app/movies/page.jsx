import { MovieGrid } from "@/features/movies/components/MovieGrid";
import { MovieFilters } from "@/features/movies/components/MovieFilters";
import { FEATURED_MOVIE } from "@/lib/constants/mockMovies";

export default function MoviesPage() {
  return (
    <div className="flex flex-col gap-md py-md">
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-crimson/20 via-obsidian to-slate-900/70 p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,57,70,0.22),transparent_45%)]" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Now showing
            </p>
            <h1 className="text-headline-md">
              CineVerse is ready for your next screening.
            </h1>
            <p className="mt-3 text-body-sm text-on-surface-variant">
              Browse the latest premieres, discover each story’s mood, and jump
              straight into a showtime.
            </p>
          </div>

          <div className="glass rounded-xl p-4">
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
            Select a genre to narrow the lineup and head straight to a cinematic
            booking.
          </p>
        </div>
      </div>

      <MovieFilters />
      <MovieGrid />
    </div>
  );
}
