import { baseApi } from '@/lib/api/baseQuery';

export const bookingHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookingHistory: builder.query({
      query: () => '/bookings/history',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Booking', id })),
              { type: 'Booking', id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetBookingHistoryQuery } = bookingHistoryApi;
