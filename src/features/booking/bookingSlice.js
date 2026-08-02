import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  checkoutStep: 'seats', // 'seats' | 'details' | 'payment' | 'confirmation'
  paymentMethod: 'card',
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCheckoutStep(state, action) {
      state.checkoutStep = action.payload;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    resetCheckout(state) {
      state.checkoutStep = 'seats';
      state.paymentMethod = 'card';
    },
  },
});

export const { setCheckoutStep, setPaymentMethod, resetCheckout } = bookingSlice.actions;
export default bookingSlice.reducer;
