import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {Object} MoviesState
 * @property {string[]} activeGenreFilters
 * @property {string}   searchQuery
 */

/** @type {MoviesState} */
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
      const idx = state.activeGenreFilters.indexOf(genre);
      if (idx === -1) {
        state.activeGenreFilters.push(genre);
      } else {
        state.activeGenreFilters.splice(idx, 1);
      }
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
