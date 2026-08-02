import { baseApi } from '@/lib/api/baseQuery';

export const seatsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSeatMap: builder.query({
      query: (showtimeId) => `/showtimes/${showtimeId}/seats`,
      providesTags: (result, error, showtimeId) => [{ type: 'Seat', id: showtimeId }],
    }),
    holdSeats: builder.mutation({
      query: ({ showtimeId, seatIds }) => ({
        url: `/showtimes/${showtimeId}/seats/hold`,
        method: 'POST',
        body: { seatIds },
      }),
      invalidatesTags: (result, error, { showtimeId }) => [{ type: 'Seat', id: showtimeId }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSeatMapQuery, useHoldSeatsMutation } = seatsApi;
