import PropTypes from 'prop-types';
import Link from 'next/link';
import { Spinner } from '@/components/ui/Spinner';
import { StatusBadge } from '@/components/admin/StatusBadge';

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeaderCell({ children }) {
  return (
    <th className="px-md py-sm text-left text-label-caps text-on-surface-variant">
      {children}
    </th>
  );
}

function BookingRow({ booking: b }) {
  return (
    <tr className="transition-colors hover:bg-white/[0.03]">
      <td className="px-md py-sm font-mono text-body-sm text-on-surface-variant">
        {b.bookingNumber ?? b._id.slice(-8).toUpperCase()}
      </td>
      <td className="px-md py-sm text-body-sm">
        {b.user ? `${b.user.firstName} ${b.user.lastName}` : '—'}
      </td>
      <td className="px-md py-sm text-body-sm">{b.movie?.title ?? '—'}</td>
      <td className="px-md py-sm text-body-sm tabular-nums">
        {b.totalAmount != null ? `$${b.totalAmount.toFixed(2)}` : '—'}
      </td>
      <td className="px-md py-sm">
        <StatusBadge value={b.bookingStatus ?? b.paymentStatus} />
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Mini table showing the 5 most recent bookings on the dashboard overview.
 * Links to the full /admin/bookings page.
 */
export function RecentBookingsTable({ bookings, isLoading }) {
  return (
    <section className="flex flex-col gap-sm rounded-lg border border-white/[0.08] bg-surface-container p-md xl:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="text-title-lg">Recent Bookings</h2>
        <Link
          href="/admin/bookings"
          className="text-body-sm text-crimson hover:underline"
        >
          View all →
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-lg">
          <Spinner size={28} />
        </div>
      ) : !bookings?.length ? (
        <p className="py-md text-center text-body-sm text-on-surface-variant">
          No bookings yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/[0.06]">
            <thead>
              <tr>
                {['Booking #', 'Customer', 'Movie', 'Amount', 'Status'].map(
                  (h) => <HeaderCell key={h}>{h}</HeaderCell>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {bookings.map((b) => (
                <BookingRow key={b._id} booking={b} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

RecentBookingsTable.propTypes = {
  bookings:  PropTypes.array,
  isLoading: PropTypes.bool,
};
