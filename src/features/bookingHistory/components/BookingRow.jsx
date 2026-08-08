"use client";

import Link from 'next/link';
import { BookingStatusBadge } from '@/features/booking/components/BookingStatusBadge';
import { TicketDownload } from '@/features/bookingHistory/components/TicketDownload';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';

export function BookingRow({ booking }) {
  const id            = booking._id;
  const bookingNumber = booking.bookingNumber ?? `#${id?.slice(-6).toUpperCase()}`;
  const movieTitle    = booking.movie?.title ?? booking.movie ?? 'Movie';
  const seatCount     = booking.seatCount ?? booking.selectedSeats?.length ?? 0;
  const total         = booking.totalAmount ?? booking.total ?? 0;
  const bookedAt      = booking.bookedAt ?? booking.createdAt;

  return (
    <article className="glass flex flex-col gap-sm rounded-lg p-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-sm">
          <Link
            href={`/bookings/${id}`}
            className="font-display text-title-lg transition-colors hover:text-primary"
          >
            {bookingNumber}
          </Link>
          <BookingStatusBadge status={booking.bookingStatus ?? 'pending'} />
          <BookingStatusBadge status={booking.paymentStatus  ?? 'pending'} />
        </div>

        <p className="text-body-sm font-medium text-on-surface">{movieTitle}</p>

        <p className="text-body-sm text-on-surface-variant">
          {formatDate(bookedAt)} &nbsp;·&nbsp; {seatCount} seat{seatCount !== 1 ? 's' : ''}
          {booking.selectedSeats?.length ? ` (${booking.selectedSeats.join(', ')})` : ''}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-sm">
        <span className="font-display text-title-lg text-primary">{formatCurrency(total)}</span>
        <TicketDownload bookingId={id} />
      </div>
    </article>
  );
}
