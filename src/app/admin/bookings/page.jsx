'use client';

import { useState, useCallback } from 'react';
import { Ticket, X } from 'lucide-react';
import { useGetAllBookingsQuery } from '@/features/booking/bookingApi';
import { useGetMoviesQuery } from '@/features/movies/moviesApi';
import { PageHeader } from '@/components/admin/PageHeader';
import { Table } from '@/components/admin/Table';
import { Pagination } from '@/components/admin/Pagination';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { BookingDetailDrawer } from '@/features/booking/components/BookingDetailDrawer';

const LIMIT = 10;

const BOOKING_STATUSES = ['confirmed', 'pending', 'cancelled'];
const PAYMENT_STATUSES = ['paid', 'unpaid', 'refunded'];

// ─── Filter bar ───────────────────────────────────────────────────────────────
function FilterBar({
  movieId, onMovie,
  bookingStatus, onBookingStatus,
  paymentStatus, onPaymentStatus,
  startDate, onStartDate,
  endDate, onEndDate,
  movies,
  onClear,
  isDirty,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Movie */}
      <select
        value={movieId}
        onChange={(e) => onMovie(e.target.value)}
        className="rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-sm text-on-surface outline-none focus:border-crimson"
      >
        <option value="">All Movies</option>
        {movies.map((m) => (
          <option key={m._id} value={m._id}>
            {m.title}
          </option>
        ))}
      </select>

      {/* Booking status */}
      <select
        value={bookingStatus}
        onChange={(e) => onBookingStatus(e.target.value)}
        className="rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-sm text-on-surface outline-none focus:border-crimson"
      >
        <option value="">All Booking Statuses</option>
        {BOOKING_STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      {/* Payment status */}
      <select
        value={paymentStatus}
        onChange={(e) => onPaymentStatus(e.target.value)}
        className="rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-sm text-on-surface outline-none focus:border-crimson"
      >
        <option value="">All Payment Statuses</option>
        {PAYMENT_STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      {/* Date range */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDate(e.target.value)}
        title="From date"
        className="rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-sm text-on-surface outline-none focus:border-crimson"
      />
      <span className="text-on-surface-variant">→</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDate(e.target.value)}
        title="To date"
        className="rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-sm text-on-surface outline-none focus:border-crimson"
      />

      {/* Clear all */}
      {isDirty && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 rounded border border-white/[0.08] px-sm py-xs text-body-sm text-on-surface-variant transition-colors hover:bg-white/[0.06] hover:text-on-surface"
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  );
}

// ─── Table columns ────────────────────────────────────────────────────────────
function useColumns({ onViewDetail }) {
  return [
    {
      key: 'bookingNumber',
      header: 'Booking #',
      render: (row) => (
        <button
          type="button"
          onClick={() => onViewDetail(row)}
          className="font-mono text-body-sm text-crimson hover:underline"
        >
          {row.bookingNumber ?? row._id.slice(-8).toUpperCase()}
        </button>
      ),
    },
    {
      key: 'user',
      header: 'Customer',
      render: (row) =>
        row.user ? (
          <div className="flex flex-col">
            <span>
              {row.user.firstName} {row.user.lastName}
            </span>
            <span className="text-body-sm text-on-surface-variant">
              {row.user.email}
            </span>
          </div>
        ) : (
          '—'
        ),
    },
    {
      key: 'movie',
      header: 'Movie',
      render: (row) => row.movie?.title ?? '—',
    },
    {
      key: 'slot',
      header: 'Showtime',
      render: (row) =>
        row.slot ? (
          <div className="flex flex-col">
            <span className="tabular-nums">
              {row.slot.date
                ? new Date(row.slot.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : '—'}
            </span>
            <span className="text-body-sm text-on-surface-variant">
              {row.slot.startTime} · {row.slot.screen ?? row.slot.theater}
            </span>
          </div>
        ) : (
          '—'
        ),
    },
    {
      key: 'seats',
      header: 'Seats',
      render: (row) => {
        const count = Array.isArray(row.seats) ? row.seats.length : '—';
        return <span className="tabular-nums">{count}</span>;
      },
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      render: (row) =>
        row.totalAmount != null ? (
          <span className="tabular-nums text-emerald-400">
            ${Number(row.totalAmount).toFixed(2)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'bookingStatus',
      header: 'Booking',
      render: (row) => <StatusBadge value={row.bookingStatus} />,
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (row) => <StatusBadge value={row.paymentStatus} />,
    },
    {
      key: 'bookedAt',
      header: 'Booked',
      render: (row) =>
        row.bookedAt || row.createdAt
          ? new Date(row.bookedAt ?? row.createdAt).toLocaleDateString(
              'en-US',
              { year: 'numeric', month: 'short', day: 'numeric' }
            )
          : '—',
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <button
          type="button"
          onClick={() => onViewDetail(row)}
          className="rounded px-sm py-xs text-body-sm text-on-surface-variant transition-colors hover:bg-white/[0.06] hover:text-on-surface"
        >
          View
        </button>
      ),
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminBookingsPage() {
  const [page, setPage]                   = useState(1);
  const [movieId, setMovieId]             = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [startDate, setStartDate]         = useState('');
  const [endDate, setEndDate]             = useState('');
  const [detailBooking, setDetailBooking] = useState(null);

  const { data, isLoading, isFetching } = useGetAllBookingsQuery({
    page,
    limit:         LIMIT,
    movieId:       movieId       || undefined,
    status:        bookingStatus || undefined,
    paymentStatus: paymentStatus || undefined,
    startDate:     startDate     || undefined,
    endDate:       endDate       || undefined,
  });

  const { data: moviesData } = useGetMoviesQuery({ limit: 200 });
  const movies     = moviesData?.data ?? [];
  const bookings   = data?.bookings   ?? [];
  const pagination = data?.pagination ?? {};
  const totalPages = pagination.pages  ?? 1;

  const resetToPage1 = useCallback(() => setPage(1), []);

  const handleMovieChange = useCallback((val) => {
    setMovieId(val);
    resetToPage1();
  }, [resetToPage1]);

  const handleBookingStatusChange = useCallback((val) => {
    setBookingStatus(val);
    resetToPage1();
  }, [resetToPage1]);

  const handlePaymentStatusChange = useCallback((val) => {
    setPaymentStatus(val);
    resetToPage1();
  }, [resetToPage1]);

  const handleStartDate = useCallback((val) => {
    setStartDate(val);
    resetToPage1();
  }, [resetToPage1]);

  const handleEndDate = useCallback((val) => {
    setEndDate(val);
    resetToPage1();
  }, [resetToPage1]);

  const handleClear = useCallback(() => {
    setMovieId('');
    setBookingStatus('');
    setPaymentStatus('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  }, []);

  const isDirty =
    Boolean(movieId || bookingStatus || paymentStatus || startDate || endDate);

  const columns = useColumns({ onViewDetail: setDetailBooking });

  return (
    <div className="flex flex-col gap-md px-md py-md">
      <PageHeader
        title="Bookings"
        subtitle={`${pagination.total ?? 0} total bookings`}
      />

      <FilterBar
        movieId={movieId}
        onMovie={handleMovieChange}
        bookingStatus={bookingStatus}
        onBookingStatus={handleBookingStatusChange}
        paymentStatus={paymentStatus}
        onPaymentStatus={handlePaymentStatusChange}
        startDate={startDate}
        onStartDate={handleStartDate}
        endDate={endDate}
        onEndDate={handleEndDate}
        movies={movies}
        onClear={handleClear}
        isDirty={isDirty}
      />

      <Table
        columns={columns}
        data={bookings}
        isLoading={isLoading || isFetching}
        emptyTitle="No bookings found"
        emptyDescription="Try adjusting the filters."
        emptyIcon={Ticket}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Detail drawer */}
      <BookingDetailDrawer
        booking={detailBooking}
        onClose={() => setDetailBooking(null)}
      />
    </div>
  );
}
