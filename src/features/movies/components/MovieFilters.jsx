'use client';

import { Chip } from '@/components/ui/Chip';
import { useDispatch, useSelector } from '@/store/hooks';
import { toggleGenreFilter } from '@/features/movies/moviesSlice';
import { GENRES } from '@/lib/constants';

export function MovieFilters() {
  const dispatch = useDispatch();
  const activeGenreFilters = useSelector((state) => state.movies.activeGenreFilters);

  return (
    <div className="flex flex-wrap gap-2">
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
  );
}
