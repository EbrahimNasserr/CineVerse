import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeGenreFilters: [],
  searchQuery: '',
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    toggleGenreFilter(state, action) {
      const genre = action.payload;
      state.activeGenreFilters = state.activeGenreFilters.includes(genre)
        ? state.activeGenreFilters.filter((g) => g !== genre)
        : [...state.activeGenreFilters, genre];
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearFilters(state) {
      state.activeGenreFilters = [];
      state.searchQuery = '';
    },
  },
});

export const { toggleGenreFilter, setSearchQuery, clearFilters } = moviesSlice.actions;
export default moviesSlice.reducer;
