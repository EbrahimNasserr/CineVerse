import Link from 'next/link';
import PropTypes from 'prop-types';
import { formatDate } from '@/lib/utils/formatDate';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { TicketDownload } from './TicketDownload';

export function BookingCard({ booking }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-surface-container p-sm">
      <div>
        <Link href={`/bookings/${booking.id}`} className="font-display text-title-lg hover:text-primary">
          Booking #{booking.id}
        </Link>
        <p className="text-body-sm text-on-surface-variant">{formatDate(booking.createdAt)}</p>
        <p className="text-body-sm text-on-surface-variant">{booking.seatIds?.length ?? 0} seat(s)</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-title-lg text-primary">{formatCurrency(booking.total)}</span>
        <TicketDownload bookingId={booking.id} />
      </div>
    </div>
  );
}

BookingCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    seatIds: PropTypes.arrayOf(PropTypes.string),
    total: PropTypes.number,
  }).isRequired,
};
