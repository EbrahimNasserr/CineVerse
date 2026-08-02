export const MOCK_THEATERS = [
  {
    id: 'theater-downtown',
    name: 'CineVerse IMAX Downtown',
    address: '1200 Cinema Blvd, Downtown',
  },
  {
    id: 'theater-luxe',
    name: 'Grand Cinema Luxe',
    address: '88 Oak Avenue, Midtown',
  },
  {
    id: 'theater-harbor',
    name: 'Harbor View Multiplex',
    address: '5 Pier Street, Waterfront',
  },
];

const SHOWTIME_SLOTS = [
  { startTime: '11:30 AM', format: 'Standard' },
  { startTime: '2:45 PM', format: 'IMAX' },
  { startTime: '6:15 PM', format: 'Dolby Atmos' },
  { startTime: '9:30 PM', format: 'Standard', soldOut: true },
];

function buildShowtimesForMovie(movieId) {
  return MOCK_THEATERS.flatMap((theater, theaterIndex) =>
    SHOWTIME_SLOTS.map((slot, slotIndex) => ({
      id: `st-${movieId}-${theater.id}-${slotIndex}`,
      movieId,
      theaterId: theater.id,
      startTime: slot.startTime,
      format: slot.format,
      isSoldOut: Boolean(slot.soldOut && theaterIndex === 2),
    }))
  );
}

export function getMockShowtimesByMovie(movieId) {
  if (!movieId) return [];
  return buildShowtimesForMovie(movieId);
}

export function getMockTheatersForMovie(movieId) {
  const showtimes = getMockShowtimesByMovie(movieId);
  const theaterIds = [...new Set(showtimes.map((showtime) => showtime.theaterId))];
  return MOCK_THEATERS.filter((theater) => theaterIds.includes(theater.id));
}
