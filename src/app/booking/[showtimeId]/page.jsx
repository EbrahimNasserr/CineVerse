'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetSeatMapQuery } from '@/features/seats/seatsApi';
import { SeatMap } from '@/features/seats/components/SeatMap';
import { BookingSummary } from '@/features/booking/components/BookingSummary';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useSelector } from '@/store/hooks';

export default function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const router = useRouter();
  const { data: seats = [], isLoading } = useGetSeatMapQuery(showtimeId, { skip: !showtimeId });
  const selectedSeatIds = useSelector((state) => state.seats.selectedSeatIds);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-md py-28 md:grid-cols-12 max-w-7xl mx-auto">
      <div className="md:col-span-8">
        <h1 className="mb-md text-headline-sm">Choose your seats</h1>
        <SeatMap seats={seats} />
      </div>
      <div className="flex flex-col gap-sm md:col-span-4">
        <BookingSummary seatLabels={selectedSeatIds} />
        <Button
          variant="primary"
          disabled={!selectedSeatIds.length}
          onClick={() => router.push(`/booking/${showtimeId}/checkout`)}
        >
          Continue to Checkout
        </Button>
      </div>
    </div>
  );
}
