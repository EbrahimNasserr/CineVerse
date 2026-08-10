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
     * All active slots for a specific movie.
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
     * Single slot with populated movie.
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

    // ── Admin mutations ────────────────────────────────────────────────────────

    /**
     * POST /admin/slots
     * Creates a slot and bulk-generates its seats.
     * Body: { movie, theater, screen, date, startTime, endTime,
     *         language, format, price, layout? }
     */
    createSlot: builder.mutation({
      query: (body) => ({
        url: '/slots',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Showtime', id: 'LIST' }],
    }),

    /**
     * PATCH /admin/slots/:id
     * Updates mutable slot fields. availableSeats is re-derived server-side.
     */
    updateSlot: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/slots/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Showtime', id },
        { type: 'Showtime', id: 'LIST' },
      ],
    }),

    /**
     * DELETE /admin/slots/:id
     * Soft-deletes the slot and releases all held seats.
     */
    deleteSlot: builder.mutation({
      query: (id) => ({
        url: `/slots/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Showtime', id },
        { type: 'Showtime', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSlotsQuery,
  useGetSlotsByMovieQuery,
  useGetShowtimeByIdQuery,
  useGetShowtimesByMovieQuery,
  useCreateSlotMutation,
  useUpdateSlotMutation,
  useDeleteSlotMutation,
} = showtimesApi;
