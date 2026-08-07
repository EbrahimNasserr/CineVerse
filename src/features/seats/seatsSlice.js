import { createSlice } from '@reduxjs/toolkit';

/** Hard ceiling enforced on the client — the server also validates (1–10). */
const DEFAULT_MAX_SEATS = 10;

const initialState = {
  selectedSeatIds: [],
  maxSeats: DEFAULT_MAX_SEATS,
};

const seatsSlice = createSlice({
  name: 'seats',
  initialState,
  reducers: {
    /**
     * Toggle a seat on/off.
     * - Deselecting always works.
     * - Selecting is silently blocked once maxSeats is reached.
     */
    toggleSeat(state, action) {
      const seatId = action.payload;
      const isSelected = state.selectedSeatIds.includes(seatId);

      if (isSelected) {
        state.selectedSeatIds = state.selectedSeatIds.filter((id) => id !== seatId);
      } else if (state.selectedSeatIds.length < state.maxSeats) {
        state.selectedSeatIds.push(seatId);
      }
    },

    /**
     * Allows the seat selection page to set a per-booking cap
     * (e.g. derived from available seats on the slot).
     */
    setMaxSeats(state, action) {
      const cap = Number(action.payload);
      state.maxSeats = Number.isFinite(cap) && cap >= 1 ? Math.min(cap, DEFAULT_MAX_SEATS) : DEFAULT_MAX_SEATS;
      // Drop any selections that now exceed the new cap.
      if (state.selectedSeatIds.length > state.maxSeats) {
        state.selectedSeatIds = state.selectedSeatIds.slice(0, state.maxSeats);
      }
    },

    clearSelectedSeats(state) {
      state.selectedSeatIds = [];
    },
  },
});

export const { toggleSeat, setMaxSeats, clearSelectedSeats } = seatsSlice.actions;
export default seatsSlice.reducer;
