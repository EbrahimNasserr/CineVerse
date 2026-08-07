'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Ticket } from 'lucide-react';

import { useGetUserBookingsQuery } from '@/features/booking/bookingApi';
import { BookingStatusBadge } from '@/features/booking/components/BookingStatusBadge';
import { TicketDownload } from '@/features/bookingHistory/components/TicketDownload';
import { EmptyState } from '@/components/common/EmptyState';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { label: 'All',       value: undefined     },
  { label: 'Confirmed', value: 'confirmed'   },
  { label: 'Pending',   value: 'pending'     },
  { label: 'Cancelled', value: 'cancelled'   },
];

function FilterTabs({ active, onChange }) {
  return (
    <div role="tablist" aria-label="Filter bookings" className="flex gap-xs overflow-x-auto pb-1">
      {FILTER_TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.label}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.value)}
            className={[
              'shrink-0 rounded-full border px-sm py-xs text-body-sm font-medium transition-colors',
              isActive
                ? 'border-crimson bg-crimson/10 text-crimson'
                : 'border-white/[0.08] bg-transparent text-on-surface-variant hover:border-white/20',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Single booking row card ──────────────────────────────────────────────────

function BookingRow({ booking }) {
  // API response wraps the booking object; _id is the Mongo id.
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
            className="font-display text-title-lg hover:text-primary transition-colors"
          >
            {bookingNumber}
          </Link>
          <BookingStatusBadge status={booking.bookingStatus ?? 'pending'} />
          <BookingStatusBadge status={booking.paymentStatus  ?? 'pending'} />
        </div>

        <p className="text-body-sm font-medium text-on-surface">{movieTitle}</p>

        <p className="text-body-sm text-on-surface-variant">
          {formatDate(bookedAt)} &nbsp;·&nbsp; {seatCount} seat{seatCount !== 1 ? 's' : ''}
          {booking.selectedSeats?.length
            ? ` (${booking.selectedSeats.join(', ')})`
            : ''}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-sm">
        <span className="font-display text-title-lg text-primary">{formatCurrency(total)}</span>
        <TicketDownload bookingId={id} />
      </div>
    </article>
  );
}

// ─── Pagination controls ──────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-sm pt-md">
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </Button>
      <span className="text-body-sm text-on-surface-variant">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </Button>
    </div>
  );
}

// ─── Main list ────────────────────────────────────────────────────────────────

function BookingsList() {
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useGetUserBookingsQuery({
    status: statusFilter,
    page,
    limit: 8,
    sortBy: '-createdAt',
  });

  const bookings   = data?.bookings ?? data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const isEmpty    = !isLoading && !isError && bookings.length === 0;

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-md">
      <FilterTabs active={statusFilter} onChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex justify-center py-xl">
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <EmptyState
          title="Couldn't load bookings"
          description="Please try refreshing the page."
        />
      ) : isEmpty ? (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          description="Once you book a showtime, it'll show up here."
          action={
            <Link href="/movies">
              <Button variant="primary">Browse movies</Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Dim list while refetching (page / filter change) */}
          <div className={`flex flex-col gap-sm transition-opacity ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
            {bookings.map((booking) => (
              <BookingRow key={booking._id} booking={booking} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-4xl px-md py-28">
        <h1 className="mb-lg font-display text-headline-sm">My Bookings</h1>
        <BookingsList />
      </section>
    </ProtectedRoute>
  );
}
