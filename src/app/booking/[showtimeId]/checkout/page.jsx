'use client';

import { useParams, useRouter } from 'next/navigation';
import { CheckoutForm } from '@/features/booking/components/CheckoutForm';
import { BookingSummary } from '@/features/booking/components/BookingSummary';
import { useCreateBookingMutation } from '@/features/booking/bookingApi';
import { useSelector } from '@/store/hooks';

export default function CheckoutPage() {
  const { showtimeId } = useParams();
  const router = useRouter();
  const selectedSeatIds = useSelector((state) => state.seats.selectedSeatIds);
  const [createBooking] = useCreateBookingMutation();

  const handleSubmit = async (values) => {
    try {
      const booking = await createBooking({
        showtimeId,
        seatIds: selectedSeatIds,
        ...values,
      }).unwrap();
      router.push(`/bookings/${booking.id}`);
    } catch {
      // Surface a toast/error UI here in a real implementation.
    }
  };

  return (
    <div className="grid grid-cols-1 gap-md py-md md:grid-cols-12">
      <div className="md:col-span-7">
        <h1 className="mb-md text-headline-sm">Checkout</h1>
        <CheckoutForm onSubmit={handleSubmit} />
      </div>
      <div className="md:col-span-5">
        <BookingSummary seatLabels={selectedSeatIds} />
      </div>
    </div>
  );
}
