import { baseApi } from '@/lib/api/baseQuery';

export const showtimesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /api/slots?movie=&theater=&date=&format=&language=&page=&limit=
     * Generic slot listing with all optional filters.
     */
    getSlots: builder.query({
      query: (params = {}) => {
        const search = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            search.set(key, value);
          }
        });
        const qs = search.toString();
        return `/slots${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Showtime', id: _id })),
              { type: 'Showtime', id: 'LIST' },
            ]
          : [{ type: 'Showtime', id: 'LIST' }],
    }),

    /**
     * GET /api/slots?movie=:movieId
     * All active slots for a specific movie — used on the movie detail page.
     */
    getSlotsByMovie: builder.query({
      query: (movieId) => `/slots?movie=${movieId}&limit=50`,
      providesTags: (result, error, movieId) => [
        { type: 'Showtime', id: movieId },
        { type: 'Showtime', id: 'LIST' },
      ],
    }),

    /**
     * GET /api/slots/:slotId
     * Single slot with populated movie — used on the seat selection page.
     */
    getShowtimeById: builder.query({
      query: (slotId) => `/slots/${slotId}`,
      providesTags: (result, error, slotId) => [{ type: 'Showtime', id: slotId }],
    }),

    // ── Legacy alias kept so old imports don't break ─────────────────────────
    getShowtimesByMovie: builder.query({
      query: (movieId) => `/slots?movie=${movieId}&limit=50`,
      providesTags: (result, error, movieId) => [{ type: 'Showtime', id: movieId }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSlotsQuery,
  useGetSlotsByMovieQuery,
  useGetShowtimeByIdQuery,
  useGetShowtimesByMovieQuery,
} = showtimesApi;
