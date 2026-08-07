import { baseApi } from '@/lib/api/baseQuery';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /api/bookings/initialize
     * Creates a pending booking and returns a Stripe PaymentIntent client secret.
     */
    initializeBooking: builder.mutation({
      query: (payload) => ({
        url: '/bookings/initialize',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    /**
     * POST /api/bookings/:bookingId/confirm
     * Confirms a booking after successful Stripe payment.
     */
    confirmBooking: builder.mutation({
      query: ({ bookingId, paymentIntentId }) => ({
        url: `/bookings/${bookingId}/confirm`,
        method: 'POST',
        body: { paymentIntentId },
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: 'Booking', id: bookingId },
        { type: 'Booking', id: 'LIST' },
      ],
    }),

    /**
     * POST /api/bookings/:bookingId/cancel
     * Cancels a booking and triggers a refund if applicable.
     */
    cancelBooking: builder.mutation({
      query: ({ bookingId, reason }) => ({
        url: `/bookings/${bookingId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: 'Booking', id: bookingId },
        { type: 'Booking', id: 'LIST' },
      ],
    }),

    /**
     * GET /api/bookings?status=&page=&limit=&sortBy=
     * Returns paginated booking history for the authenticated user.
     */
    getUserBookings: builder.query({
      query: ({ status, page = 1, limit = 10, sortBy = '-createdAt' } = {}) => {
        const params = new URLSearchParams({ page, limit, sortBy });
        if (status) params.set('status', status);
        return `/bookings?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.bookings
          ? [
              ...result.bookings.map(({ _id }) => ({ type: 'Booking', id: _id })),
              { type: 'Booking', id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    /**
     * GET /api/bookings/:bookingId
     * Returns full booking details by Mongo ObjectId.
     */
    getBookingById: builder.query({
      query: (bookingId) => `/bookings/${bookingId}`,
      providesTags: (result, error, bookingId) => [{ type: 'Booking', id: bookingId }],
    }),

    /**
     * GET /api/bookings/number/:bookingNumber
     * Returns full booking details by human-readable booking number (BK-…).
     */
    getBookingByNumber: builder.query({
      query: (bookingNumber) => `/bookings/number/${bookingNumber}`,
      providesTags: (result) =>
        result?.booking ? [{ type: 'Booking', id: result.booking._id }] : [],
    }),

    /**
     * GET /api/bookings/config/stripe
     * Returns the Stripe publishable key for client-side Elements initialisation.
     */
    getStripeConfig: builder.query({
      query: () => '/bookings/config/stripe',
    }),
  }),
  overrideExisting: true,
});

export const {
  useInitializeBookingMutation,
  useConfirmBookingMutation,
  useCancelBookingMutation,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingByNumberQuery,
  useGetStripeConfigQuery,
} = bookingApi;
