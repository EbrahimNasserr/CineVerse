'use client';

import { useParams } from 'next/navigation';
import { useGetBookingByIdQuery } from '@/features/booking/bookingApi';
import { BookingSummary } from '@/features/booking/components/BookingSummary';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

function BookingDetail() {
  const { bookingId } = useParams();
  const { data: booking, isLoading, isError } = useGetBookingByIdQuery(bookingId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !booking) {
    return <EmptyState title="Booking not found" description="Double-check the confirmation link." />;
  }

  return (
    <div className="flex flex-col gap-md py-md">
      <h1 className="text-headline-md">Booking #{booking.id}</h1>
      <BookingSummary seatLabels={booking.seatIds} total={booking.total} />
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <ProtectedRoute>
      <BookingDetail />
    </ProtectedRoute>
  );
}
