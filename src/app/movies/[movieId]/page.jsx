"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetMovieByIdQuery } from "@/features/movies/moviesApi";
import { useGetShowtimesByMovieQuery } from "@/features/showtimes/showtimesApi";
import { ShowtimeSelector } from "@/features/showtimes/components/ShowtimeSelector";
import { TheaterSelector } from "@/features/showtimes/components/TheaterSelector";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/common/EmptyState";
import { MovieHero } from "@/features/movies/components/MovieHero";
import { Button } from "@/components/ui/Button";
import { getMovieById as getMockMovieById } from "@/lib/constants/mockMovies";
import {
  getMockShowtimesByMovie,
  getMockTheatersForMovie,
} from "@/lib/constants/mockShowtimes";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const router = useRouter();
  const movieIdParam = Array.isArray(movieId) ? movieId[0] : movieId;

  const {
    data: movieResponse,
    isLoading,
    isError,
  } = useGetMovieByIdQuery(movieIdParam, { skip: !movieIdParam });
  const { data: showtimes = [], isLoading: isShowtimesLoading } =
    useGetShowtimesByMovieQuery(movieIdParam, {
      skip: !movieIdParam,
    });

  const fallbackMovie = useMemo(
    () => getMockMovieById(movieIdParam),
    [movieIdParam],
  );
  const fallbackShowtimes = useMemo(
    () => getMockShowtimesByMovie(movieIdParam),
    [movieIdParam],
  );
  const fallbackTheaters = useMemo(
    () => getMockTheatersForMovie(movieIdParam),
    [movieIdParam],
  );

  // Extract movie from API response structure: { success: true, data: {...} }
  const apiMovie = movieResponse?.success ? movieResponse.data : null;
  const activeMovie = apiMovie ?? fallbackMovie;
  const activeShowtimes = showtimes?.length ? showtimes : fallbackShowtimes;
  const activeTheaters = useMemo(
    () => (fallbackTheaters.length ? fallbackTheaters : []),
    [fallbackTheaters],
  );
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);

  useEffect(() => {
    if (!activeTheaters.length) {
      setSelectedTheaterId(null);
      return;
    }

    if (
      !selectedTheaterId ||
      !activeTheaters.some((theater) => theater.id === selectedTheaterId)
    ) {
      setSelectedTheaterId(activeTheaters[0].id);
    }
  }, [activeTheaters, selectedTheaterId]);

  const visibleShowtimes = useMemo(() => {
    if (!selectedTheaterId) return activeShowtimes;
    return activeShowtimes.filter(
      (showtime) => showtime.theaterId === selectedTheaterId,
    );
  }, [activeShowtimes, selectedTheaterId]);

  useEffect(() => {
    if (!visibleShowtimes.length) {
      setSelectedShowtimeId(null);
      return;
    }

    if (
      !selectedShowtimeId ||
      !visibleShowtimes.some((showtime) => showtime.id === selectedShowtimeId)
    ) {
      const preferredShowtime =
        visibleShowtimes.find((showtime) => !showtime.isSoldOut) ??
        visibleShowtimes[0];
      setSelectedShowtimeId(preferredShowtime.id);
    }
  }, [visibleShowtimes, selectedShowtimeId]);

  const selectedTheater =
    activeTheaters.find((theater) => theater.id === selectedTheaterId) ??
    activeTheaters[0];
  const selectedShowtime =
    visibleShowtimes.find((showtime) => showtime.id === selectedShowtimeId) ??
    visibleShowtimes[0];

  if (isLoading || isShowtimesLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError && !activeMovie) {
    return (
      <EmptyState
        title="Movie not found"
        description="We couldn't find showtimes for this title right now."
      />
    );
  }

  return (
    <div className="flex flex-col gap-lg py-md">
      <MovieHero movie={activeMovie} />

      <div className="mx-auto grid w-full max-w-7xl gap-lg lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-white/[0.08] bg-surface-container/70 p-md md:p-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                Synopsis
              </p>
              <h2 className="mt-2 text-headline-sm">{activeMovie.title}</h2>
            </div>
            {!apiMovie && fallbackMovie ? (
              <span className="rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
                Preview mode
              </span>
            ) : null}
          </div>

          <p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
            {/* API uses description, mock uses synopsis */}
            {activeMovie.description || activeMovie.synopsis}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                Runtime
              </p>
              <p className="mt-1 font-display text-title-md">
                {/* API uses duration (number of minutes), mock uses runtime (formatted string) */}
                {activeMovie.duration ? `${activeMovie.duration}m` : activeMovie.runtime || "—"}
              </p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                Year
              </p>
              <p className="mt-1 font-display text-title-md">
                {/* API uses releaseDate (ISO string), mock uses year */}
                {activeMovie.releaseDate
                  ? new Date(activeMovie.releaseDate).getFullYear()
                  : activeMovie.year || "—"}
              </p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                Genres
              </p>
              <p className="mt-1 font-display text-title-md">
                {activeMovie.genres?.join(" • ") || "—"}
              </p>
            </div>
          </div>
        </section>

        <aside className="glass rounded-2xl border border-white/[0.08] p-md md:p-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                Booking panel
              </p>
              <h2 className="mt-2 text-headline-sm">Reserve your seats</h2>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <section className="flex flex-col gap-2">
              <h3 className="text-title-sm">Theater</h3>
              <TheaterSelector
                theaters={activeTheaters}
                value={selectedTheaterId}
                onChange={setSelectedTheaterId}
              />
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-title-sm">Showtime</h3>
              {visibleShowtimes.length ? (
                <ShowtimeSelector
                  showtimes={visibleShowtimes}
                  value={selectedShowtimeId}
                  onChange={setSelectedShowtimeId}
                />
              ) : (
                <p className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-sm text-body-sm text-on-surface-variant">
                  No showtimes are currently available for this theater.
                </p>
              )}
            </section>

            <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-sm">
              <p className="text-body-sm text-on-surface-variant">
                Selected screening
              </p>
              <p className="mt-1 font-display text-title-md">
                {selectedTheater?.name || "Choose a theater"}
              </p>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                {selectedShowtime?.startTime
                  ? `${selectedShowtime.startTime} • ${selectedShowtime.format ?? "Screening"}`
                  : "Choose a showtime"}
              </p>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={() =>
                selectedShowtime &&
                router.push(`/booking/${selectedShowtime.id}`)
              }
              disabled={!selectedShowtime}
            >
              Continue to seats
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
