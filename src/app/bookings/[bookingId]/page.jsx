'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import { useGetBookingByIdQuery, useCancelBookingMutation } from '@/features/booking/bookingApi';
import { BookingStatusBadge } from '@/features/booking/components/BookingStatusBadge';
import { TicketDownload } from '@/features/bookingHistory/components/TicketDownload';
import { ConfirmationBanner } from '@/features/booking/components/ConfirmationBanner';
import { CancelModal } from '@/features/booking/components/CancelModal';
import { BookingInfoCard } from '@/features/booking/components/BookingInfoCard';
import { PricingBreakdown } from '@/features/booking/components/PricingBreakdown';
import { EmptyState } from '@/components/common/EmptyState';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

function BookingDetail() {
  const { bookingId } = useParams();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const isJustConfirmed = searchParams.get('confirmed') === '1';

  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: response, isLoading, isError } =
    useGetBookingByIdQuery(bookingId, { skip: !bookingId });

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

  const booking = response.booking ?? response.data ?? response;
  const bookingNumber = booking.bookingNumber ?? `#${booking._id?.slice(-6).toUpperCase()}`;
  const canCancel = ['pending', 'confirmed'].includes(booking.bookingStatus);

  const handleCancel = async () => {
    try {
      await cancelBooking({ bookingId: booking._id }).unwrap();
      setShowCancelModal(false);
      router.refresh();
    } catch {
      // Error surfaces via RTK Query — modal stays open.
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
        {isJustConfirmed && <ConfirmationBanner bookingNumber={bookingNumber} />}

        {/* Header */}
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

        {/* Detail grid */}
        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
          <BookingInfoCard booking={booking} />

          <div className="flex flex-col gap-sm">
            <PricingBreakdown booking={booking} />

            {(booking.paymentId || booking.transactionId) && (
              <div className="glass rounded-lg p-md text-body-xs text-on-surface-variant flex flex-col gap-1">
                {booking.paymentId     && <span>Payment ID: <span className="font-mono">{booking.paymentId}</span></span>}
                {booking.transactionId && <span>Txn ID: <span className="font-mono">{booking.transactionId}</span></span>}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
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

export default function BookingDetailPage() {
  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-4xl px-md py-28">
        <BookingDetail />
      </section>
    </ProtectedRoute>
  );
}
