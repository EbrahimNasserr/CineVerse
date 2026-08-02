import { baseApi } from '@/lib/api/baseQuery';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (payload) => ({
        url: '/bookings',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),
    getBookingById: builder.query({
      query: (bookingId) => `/bookings/${bookingId}`,
      providesTags: (result, error, bookingId) => [{ type: 'Booking', id: bookingId }],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateBookingMutation, useGetBookingByIdQuery } = bookingApi;
