import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSeatIds: [],
};

const seatsSlice = createSlice({
  name: 'seats',
  initialState,
  reducers: {
    toggleSeat(state, action) {
      const seatId = action.payload;
      state.selectedSeatIds = state.selectedSeatIds.includes(seatId)
        ? state.selectedSeatIds.filter((id) => id !== seatId)
        : [...state.selectedSeatIds, seatId];
    },
    clearSelectedSeats(state) {
      state.selectedSeatIds = [];
    },
  },
});

export const { toggleSeat, clearSelectedSeats } = seatsSlice.actions;
export default seatsSlice.reducer;
