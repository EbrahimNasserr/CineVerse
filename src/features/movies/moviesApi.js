import { baseApi } from '@/lib/api/baseQuery';

export const moviesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /movie?page=1&limit=10&search=
     * @param {import('./types').MoviesQueryParams} params
     * @returns {import('./types').MoviesListResponse}
     */
    getMovies: builder.query({
      query: (params = {}) => ({
        url: '/movie',
        params,
      }),
      // The API wraps results in { data: [...], pagination: {...} }
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Movie', id: _id })),
              { type: 'Movie', id: 'LIST' },
            ]
          : [{ type: 'Movie', id: 'LIST' }],
    }),

    /**
     * GET /movie/:id
     * @param {string} movieId
     * @returns {import('./types').MovieResponse}
     */
    getMovieById: builder.query({
      query: (movieId) => `/movie/${movieId}`,
      providesTags: (result) =>
        result?.data ? [{ type: 'Movie', id: result.data._id }] : [],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMoviesQuery, useGetMovieByIdQuery } = moviesApi;
