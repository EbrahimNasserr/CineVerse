import { baseApi } from '@/lib/api/baseQuery';

export const moviesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query({
      query: (params) => ({ url: '/movies', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Movie', id })),
              { type: 'Movie', id: 'LIST' },
            ]
          : [{ type: 'Movie', id: 'LIST' }],
    }),
    getMovieById: builder.query({
      query: (movieId) => `/movies/${movieId}`,
      providesTags: (result, error, movieId) => [{ type: 'Movie', id: movieId }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMoviesQuery, useGetMovieByIdQuery } = moviesApi;
