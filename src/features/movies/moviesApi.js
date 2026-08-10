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

    // ── Admin mutations ────────────────────────────────────────────────────────

    /**
     * POST /admin/movies  (multipart/form-data — poster & backdrop files)
     * Body matches createMovie controller: title, description, duration,
     * director, releaseDate, poster (url fallback), backdrop (url fallback),
     * trailer, cast[], genres[], languages[], writer, production, country,
     * imdbRating, ageRating, status, featured, trending, isActive.
     */
    createMovie: builder.mutation({
      query: (formData) => ({
        url: '/movie',
        method: 'POST',
        body: formData,
        // Let the browser set the multipart boundary automatically.
        formData: true,
      }),
      invalidatesTags: [{ type: 'Movie', id: 'LIST' }],
    }),

    /**
     * PATCH /admin/movies/:id
     * Accepts the same fields as createMovie; only provided fields are updated.
     */
    updateMovie: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/movie/${id}`,
        method: 'PATCH',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Movie', id },
        { type: 'Movie', id: 'LIST' },
      ],
    }),

    /**
     * DELETE /admin/movies/:id
     * Hard-deletes the movie and its associated files.
     */
    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/movie/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Movie', id },
        { type: 'Movie', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = moviesApi;
