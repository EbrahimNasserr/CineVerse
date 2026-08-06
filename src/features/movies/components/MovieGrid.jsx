"use client";

import { useMemo } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useGetMoviesQuery } from "@/features/movies/moviesApi";
import { MOCK_MOVIES } from "@/lib/constants/mockMovies";
import { useSelector } from "@/store/hooks";
import { MovieCard } from "./MovieCard";

export function MovieGrid() {
  const { data: response, isLoading, isError } = useGetMoviesQuery({
    page: 1,
    limit: 10,
    search: ""
  });
  const activeGenreFilters = useSelector(
    (state) => state.movies.activeGenreFilters,
  );
  const searchQuery = useSelector((state) => state.movies.searchQuery);

  // Extract movies from API response structure: { success: true, data: [...], pagination: {...} }
  const apiMovies = response?.success && Array.isArray(response.data) ? response.data : [];
  const sourceMovies = apiMovies.length > 0 ? apiMovies : MOCK_MOVIES;

  const movies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredMovies = sourceMovies.filter((movie) => {
      // Handle both API structure and mock structure
      const movieGenres = movie.genres || [];
      const movieTitle = movie.title || "";
      const movieDescription = movie.description || movie.synopsis || "";
      
      const matchesGenres =
        !activeGenreFilters.length ||
        activeGenreFilters.every((genre) => movieGenres.includes(genre));

      const searchableText = [
        movieTitle,
        movieDescription,
        ...movieGenres,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesGenres && matchesSearch;
    });

    return filteredMovies
      .slice()
      .sort((a, b) => {
        // API movies use imdbRating, mock movies use rating
        const aRating = a.imdbRating ?? a.rating ?? 0;
        const bRating = b.imdbRating ?? b.rating ?? 0;
        return bRating - aRating;
      });
  }, [activeGenreFilters, searchQuery, sourceMovies]);

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
        description="Try adjusting your search or clearing a genre filter to see more stories on the marquee."
      />
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-on-surface-variant">
            Catalog
          </p>
          <h3 className="text-title-md">
            {movies.length} {movies.length === 1 ? "title" : "titles"} ready
          </h3>
        </div>
        <div className="rounded-full border border-white/[0.08] bg-surface-container/70 px-3 py-2 text-body-sm text-on-surface-variant">
          {activeGenreFilters.length
            ? `${activeGenreFilters.length} genre${activeGenreFilters.length > 1 ? "s" : ""} selected`
            : "Showing every genre"}
          {searchQuery.trim() ? ` • matching “${searchQuery.trim()}”` : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    </section>
  );
}
