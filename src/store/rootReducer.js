import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/lib/api/baseQuery';
import authReducer from '@/features/auth/authSlice';
import moviesReducer from '@/features/movies/moviesSlice';
import seatsReducer from '@/features/seats/seatsSlice';
import bookingReducer from '@/features/booking/bookingSlice';

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  movies: moviesReducer,
  seats: seatsReducer,
  booking: bookingReducer,
});
