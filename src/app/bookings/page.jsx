'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { BookingsList } from '@/features/bookingHistory/components/BookingsList';

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
