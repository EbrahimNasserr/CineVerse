"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Ticket } from 'lucide-react';
import { useGetUserBookingsQuery } from '@/features/booking/bookingApi';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { FilterTabs } from './FilterTabs';
import { BookingRow } from './BookingRow';
import { BookingsPagination } from './BookingsPagination';

export function BookingsList() {
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
          <div className={`flex flex-col gap-sm transition-opacity ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
            {bookings.map((booking) => (
              <BookingRow key={booking._id} booking={booking} />
            ))}
          </div>
          <BookingsPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
