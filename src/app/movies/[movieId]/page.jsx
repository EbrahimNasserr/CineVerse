'use client';

import { useParams } from 'next/navigation';

import { useGetMovieByIdQuery } from '@/features/movies/moviesApi';
import { useGetSlotsByMovieQuery } from '@/features/showtimes/showtimesApi';
import { getMovieById as getMockMovieById } from '@/lib/constants/mockMovies';

import { MovieHero } from '@/features/movies/components/MovieHero';
import { SynopsisSection } from '@/features/movies/components/SynopsisSection';
import { ShowtimesSection } from '@/features/showtimes/components/ShowtimesSection';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/common/EmptyState';

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const id = Array.isArray(movieId) ? movieId[0] : movieId;

  const { data: movieResponse, isLoading: movieLoading, isError: movieError } =
    useGetMovieByIdQuery(id, { skip: !id });

  const { data: slotsResponse, isLoading: slotsLoading } =
    useGetSlotsByMovieQuery(id, { skip: !id });

  const apiMovie    = movieResponse?.success ? movieResponse.data : null;
  const activeMovie = apiMovie ?? getMockMovieById(id);
  const slots       = slotsResponse?.data ?? [];

  if (movieLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={36} />
      </div>
    );
  }

  if (movieError && !activeMovie) {
    return (
      <EmptyState
        title="Movie not found"
        description="We couldn't find this title. It may have been removed."
      />
    );
  }

  if (!activeMovie) return null;

  return (
    <div className="flex flex-col gap-lg pb-xl">
      <MovieHero movie={activeMovie} />

      <div className="mx-auto w-full max-w-content px-md md:px-lg flex flex-col gap-lg">
        <SynopsisSection movie={activeMovie} />

        <div>
          <div className="mb-md flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
                Screenings
              </p>
              <h2 className="mt-1 text-headline-sm">Pick a showtime</h2>
            </div>
            {slotsLoading && <Spinner size={18} />}
          </div>

          {!slotsLoading && (
            <ShowtimesSection slots={slots} movieId={id} />
          )}
        </div>
      </div>
    </div>
  );
}
