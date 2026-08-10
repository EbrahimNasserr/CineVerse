/**
 * Pure data-derivation functions that transform a flat bookings array
 * into chart-ready series.  No React, no side-effects.
 */

/**
 * Build a last-N-days revenue + booking-count series.
 *
 * @param {object[]} bookings - Raw booking objects from the API
 * @param {number}   days     - Number of trailing days to include (default 7)
 * @returns {{ day: string, revenue: number, bookings: number }[]}
 */
export function buildRevenueSeries(bookings = [], days = 7) {
  const map = {};
  const now = new Date();

  // Pre-fill every day so gaps show as zero instead of missing ticks
  for (let i = days - 1; i >= 0; i--) {
    const d   = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    map[key]  = { day: key, revenue: 0, bookings: 0 };
  }

  bookings.forEach((b) => {
    const d   = new Date(b.bookedAt ?? b.createdAt);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

    if (!map[key]) return; // outside the window

    map[key].bookings += 1;

    if (b.paymentStatus === 'paid') {
      map[key].revenue += b.totalAmount ?? 0;
    }
  });

  return Object.values(map);
}

/**
 * Build booking-status distribution for a donut / pie chart.
 *
 * @param {object[]} bookings
 * @returns {{ name: string, value: number }[]}
 */
export function buildStatusSeries(bookings = []) {
  const counts = { confirmed: 0, pending: 0, cancelled: 0 };

  bookings.forEach((b) => {
    const status = (b.bookingStatus ?? '').toLowerCase();
    if (status in counts) counts[status]++;
  });

  return Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));
}

/**
 * Build top-N movies ranked by booking count.
 *
 * @param {object[]} bookings
 * @param {number}   topN     - How many movies to return (default 6)
 * @returns {{ title: string, bookings: number, revenue: number }[]}
 */
export function buildMovieSeries(bookings = [], topN = 6) {
  const map = {};

  bookings.forEach((b) => {
    const title = b.movie?.title ?? 'Unknown';

    if (!map[title]) map[title] = { title, bookings: 0, revenue: 0 };

    map[title].bookings += 1;

    if (b.paymentStatus === 'paid') {
      map[title].revenue += b.totalAmount ?? 0;
    }
  });

  return Object.values(map)
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, topN);
}
