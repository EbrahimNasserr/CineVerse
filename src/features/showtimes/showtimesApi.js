import { baseApi } from '@/lib/api/baseQuery';

export const showtimesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShowtimesByMovie: builder.query({
      query: (movieId) => `/movies/${movieId}/showtimes`,
      providesTags: (result, error, movieId) => [{ type: 'Showtime', id: movieId }],
    }),
    getShowtimeById: builder.query({
      query: (showtimeId) => `/showtimes/${showtimeId}`,
      providesTags: (result, error, showtimeId) => [{ type: 'Showtime', id: showtimeId }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetShowtimesByMovieQuery, useGetShowtimeByIdQuery } = showtimesApi;
