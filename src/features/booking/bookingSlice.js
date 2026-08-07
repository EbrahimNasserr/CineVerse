import { createSlice } from '@reduxjs/toolkit';

/**
 * Booking UI state — tracks the in-progress booking flow.
 *
 * pendingBookingId  : Mongo ObjectId returned by /initialize, kept until confirm/cancel.
 * clientSecret      : Stripe PaymentIntent client_secret for Elements.
 * seatHoldExpiresAt : ISO timestamp when the seat hold expires (server-set, ~10 min).
 * checkoutStep      : Current step in the multi-step flow.
 * paymentMethod     : Stripe payment method type chosen by the user.
 * error             : Last API error message surfaced to the UI.
 */
const initialState = {
  pendingBookingId: null,
  clientSecret: null,
  seatHoldExpiresAt: null,
  selectedLabels: [],        // human-readable labels e.g. ["A1","B3"] for the checkout summary
  checkoutStep: 'seats',
  paymentMethod: 'card',
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    /** Called after /initialize succeeds. Stores the pending booking + Stripe secret. */
    setPendingBooking(state, action) {
      const { bookingId, clientSecret, seatHoldExpiresAt, selectedLabels } = action.payload;
      state.pendingBookingId  = bookingId;
      state.clientSecret      = clientSecret ?? null;
      state.seatHoldExpiresAt = seatHoldExpiresAt ?? null;
      state.selectedLabels    = selectedLabels ?? [];
      state.error             = null;
    },

    /** Called after confirm/cancel or when the user navigates away from the flow. */
    clearPendingBooking(state) {
      state.pendingBookingId  = null;
      state.clientSecret      = null;
      state.seatHoldExpiresAt = null;
      state.selectedLabels    = [];
      state.error             = null;
    },

    setCheckoutStep(state, action) {
      state.checkoutStep = action.payload;
    },

    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },

    setBookingError(state, action) {
      state.error = action.payload;
    },

    /** Full reset — used on logout or after a confirmed booking reaches /confirmation. */
    resetCheckout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setPendingBooking,
  clearPendingBooking,
  setCheckoutStep,
  setPaymentMethod,
  setBookingError,
  resetCheckout,
} = bookingSlice.actions;

export default bookingSlice.reducer;
