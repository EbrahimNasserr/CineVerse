'use client';

import { useGetBookingHistoryQuery } from '@/features/bookingHistory/bookingHistoryApi';
import { BookingCard } from '@/features/bookingHistory/components/BookingCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

function BookingsList() {
  const { data: bookings = [], isLoading, isError } = useGetBookingHistoryQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !bookings.length) {
    return (
      <EmptyState
        title="No bookings yet"
        description="Once you book a showtime, it'll show up here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

export default function BookingsPage() {
  return (
     <ProtectedRoute>
      <div className="flex flex-col gap-md">
        <h1 className="text-h5 font-semibold text-on-surface">My Bookings</h1>
        <BookingsList />
      </div>
    </ProtectedRoute>
  );
}
