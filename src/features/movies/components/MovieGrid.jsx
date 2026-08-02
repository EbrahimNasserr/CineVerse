"use client";

import { useMemo } from "react";
import { useGetMoviesQuery } from "@/features/movies/moviesApi";
import { MovieCard } from "./MovieCard";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/common/EmptyState";
import { MOCK_MOVIES } from "@/lib/constants/mockMovies";
import { useSelector } from "@/store/hooks";

export function MovieGrid() {
  const { data, isLoading, isError } = useGetMoviesQuery();
  const activeGenreFilters = useSelector(
    (state) => state.movies.activeGenreFilters,
  );

  const sourceMovies = data && data.length ? data : MOCK_MOVIES;
  const movies = useMemo(() => {
    if (!activeGenreFilters.length) return sourceMovies;
    return sourceMovies.filter((movie) =>
      activeGenreFilters.every((genre) => movie.genres?.includes(genre)),
    );
  }, [activeGenreFilters, sourceMovies]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError && !sourceMovies.length) {
    return (
      <EmptyState
        title="Couldn't load movies"
        description="We couldn't reach the box office right now. Please try again shortly."
      />
    );
  }

  if (!movies.length) {
    return (
      <EmptyState
        title="No matching titles"
        description="Try clearing a genre filter to see more stories on the marquee."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-5">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} />
      ))}
    </div>
  );
}
