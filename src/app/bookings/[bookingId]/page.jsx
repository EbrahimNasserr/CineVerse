'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Film, MapPin, Clock, Calendar, Tag } from 'lucide-react';

import { useGetBookingByIdQuery, useCancelBookingMutation } from '@/features/booking/bookingApi';
import { BookingStatusBadge } from '@/features/booking/components/BookingStatusBadge';
import { TicketDownload } from '@/features/bookingHistory/components/TicketDownload';
import { EmptyState } from '@/components/common/EmptyState';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';

// ─── Confirmation banner (shown on redirect from checkout) ────────────────────

function ConfirmationBanner({ bookingNumber }) {
  return (
    <div
      role="status"
      className="flex items-center gap-sm rounded-lg border border-teal/30 bg-teal/10 px-md py-sm text-teal"
    >
      <CheckCircle size={20} className="shrink-0" />
      <div>
        <p className="font-medium">Booking confirmed!</p>
        <p className="text-body-sm">
          Your booking <span className="font-bold">{bookingNumber}</span> is confirmed.
          A confirmation email has been sent to you.
        </p>
      </div>
    </div>
  );
}

// ─── Cancel confirmation modal ────────────────────────────────────────────────

function CancelModal({ bookingNumber, onConfirm, onDismiss, isLoading }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-md"
    >
      <div className="glass w-full max-w-sm rounded-xl p-lg flex flex-col gap-md">
        <h2 id="cancel-title" className="font-display text-title-xl">
          Cancel booking?
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          You are about to cancel <span className="font-medium text-on-surface">{bookingNumber}</span>.
          If you paid, a refund will be initiated per our refund policy.
        </p>
        <div className="flex gap-sm">
          <Button
            variant="primary"
            className="flex-1 bg-crimson/80"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? <Spinner size={16} /> : 'Yes, cancel'}
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onDismiss}>
            Keep it
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail info row ──────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-sm text-body-sm">
      <Icon size={16} className="mt-px shrink-0 text-on-surface-variant" />
      <span className="text-on-surface-variant w-24 shrink-0">{label}</span>
      <span className="text-on-surface">{value}</span>
    </div>
  );
}

// ─── Pricing breakdown ────────────────────────────────────────────────────────

function PricingBreakdown({ booking }) {
  const ticketPrice = booking.ticketPrice ?? 0;
  const serviceFee  = booking.serviceFee  ?? 0;
  const total       = booking.totalAmount ?? booking.total ?? 0;
  const seatCount   = booking.seatCount   ?? 1;
  const currency    = booking.currency    ?? 'USD';

  return (
    <div className="glass rounded-lg p-md flex flex-col gap-xs text-body-sm">
      <h3 className="mb-xs font-display text-title-lg">Price Breakdown</h3>
      <div className="flex justify-between text-on-surface-variant">
        <span>{seatCount} × seat ({formatCurrency(ticketPrice)})</span>
        <span>{formatCurrency(seatCount * ticketPrice)}</span>
      </div>
      <div className="flex justify-between text-on-surface-variant">
        <span>Service fee</span>
        <span>{formatCurrency(serviceFee)}</span>
      </div>
      <div className="h-px bg-white/[0.08]" />
      <div className="flex justify-between font-medium text-on-surface">
        <span>Total ({currency})</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

// ─── Main detail component ────────────────────────────────────────────────────

function BookingDetail() {
  const { bookingId } = useParams();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const isJustConfirmed = searchParams.get('confirmed') === '1';

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason,    setCancelReason]    = useState('');

  const {
    data: response,
    isLoading,
    isError,
  } = useGetBookingByIdQuery(bookingId, { skip: !bookingId });

  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={36} />
      </div>
    );
  }

  if (isError || !response) {
    return (
      <EmptyState
        title="Booking not found"
        description="The booking may have been removed or the link is invalid."
        action={
          <Link href="/bookings">
            <Button variant="secondary">View all bookings</Button>
          </Link>
        }
      />
    );
  }

  // API may return { booking } or { data } or the object directly.
  const booking = response.booking ?? response.data ?? response;

  const bookingNumber = booking.bookingNumber ?? `#${booking._id?.slice(-6).toUpperCase()}`;
  const movieTitle    = booking.movie?.title  ?? booking.movie ?? 'Movie';
  const slot          = booking.slot ?? {};
  const canCancel     = ['pending', 'confirmed'].includes(booking.bookingStatus);

  const handleCancel = async () => {
    try {
      await cancelBooking({ bookingId: booking._id, reason: cancelReason }).unwrap();
      setShowCancelModal(false);
      router.refresh();
    } catch {
      // Error surfaces via RTK Query — the modal stays open.
    }
  };

  return (
    <>
      {showCancelModal && (
        <CancelModal
          bookingNumber={bookingNumber}
          onConfirm={handleCancel}
          onDismiss={() => setShowCancelModal(false)}
          isLoading={cancelling}
        />
      )}

      <div className="flex flex-col gap-md">
        {/* ── Confirmation banner ── */}
        {isJustConfirmed && <ConfirmationBanner bookingNumber={bookingNumber} />}

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-sm">
          <div className="flex flex-col gap-xs">
            <h1 className="font-display text-headline-sm">{bookingNumber}</h1>
            <div className="flex flex-wrap gap-xs">
              <BookingStatusBadge status={booking.bookingStatus ?? 'pending'} />
              <BookingStatusBadge status={booking.paymentStatus  ?? 'pending'} />
            </div>
          </div>
          <TicketDownload bookingId={booking._id} />
        </div>

        <div className="grid grid-cols-1 gap-md md:grid-cols-2">

          {/* ── Booking info ── */}
          <div className="glass rounded-lg p-md flex flex-col gap-sm">
            <h2 className="font-display text-title-lg">Booking Details</h2>
            <div className="h-px bg-white/[0.08]" />
            <InfoRow icon={Film}     label="Movie"    value={movieTitle} />
            <InfoRow icon={MapPin}   label="Theater"  value={slot.theater} />
            <InfoRow icon={Tag}      label="Screen"   value={slot.screen} />
            <InfoRow icon={Calendar} label="Date"     value={slot.date ? formatDate(slot.date) : undefined} />
            <InfoRow icon={Clock}    label="Time"     value={slot.startTime && slot.endTime ? `${slot.startTime} – ${slot.endTime}` : undefined} />
            <InfoRow icon={Tag}      label="Format"   value={slot.format} />
            <InfoRow icon={Tag}      label="Language" value={slot.language} />

            {booking.selectedSeats?.length > 0 && (
              <div className="flex items-start gap-sm text-body-sm">
                <Tag size={16} className="mt-px shrink-0 text-on-surface-variant" />
                <span className="text-on-surface-variant w-24 shrink-0">Seats</span>
                <span className="text-on-surface">{booking.selectedSeats.join(', ')}</span>
              </div>
            )}

            {booking.notes && (
              <div className="mt-xs rounded border border-white/[0.06] bg-white/[0.03] px-sm py-xs text-body-sm text-on-surface-variant">
                {booking.notes}
              </div>
            )}
          </div>

          {/* ── Pricing ── */}
          <div className="flex flex-col gap-sm">
            <PricingBreakdown booking={booking} />

            {/* Transaction IDs (shown if present) */}
            {(booking.paymentId || booking.transactionId) && (
              <div className="glass rounded-lg p-md text-body-xs text-on-surface-variant flex flex-col gap-1">
                {booking.paymentId     && <span>Payment ID: <span className="font-mono">{booking.paymentId}</span></span>}
                {booking.transactionId && <span>Txn ID: <span className="font-mono">{booking.transactionId}</span></span>}
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-sm pt-sm">
          <Link href="/bookings">
            <Button variant="secondary">← Back to bookings</Button>
          </Link>

          {canCancel && (
            <Button
              variant="secondary"
              className="border-crimson/30 text-crimson hover:bg-crimson/10"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel booking
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingDetailPage() {
  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-4xl px-md py-28">
        <BookingDetail />
      </section>
    </ProtectedRoute>
  );
}
