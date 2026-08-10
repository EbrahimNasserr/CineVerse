'use client';

import { BookCheck, CalendarClock, Clapperboard, DollarSign } from 'lucide-react';
import { useGetMoviesQuery } from '@/features/movies/moviesApi';
import { useGetSlotsQuery } from '@/features/showtimes/showtimesApi';
import { useGetAllBookingsQuery } from '@/features/booking/bookingApi';

import { PageHeader } from '@/components/admin/PageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { RecentBookingsTable } from '@/components/admin/RecentBookingsTable';
import { QuickActions } from '@/components/admin/QuickActions';
import { ChartCard } from '@/components/admin/charts/ChartCard';
import { RevenueChart } from '@/components/admin/charts/RevenueChart';
import { StatusPieChart } from '@/components/admin/charts/StatusPieChart';
import { TopMoviesChart } from '@/components/admin/charts/TopMoviesChart';
import {
  buildRevenueSeries,
  buildStatusSeries,
  buildMovieSeries,
} from '@/components/admin/charts/chartHelpers';

export default function AdminDashboardPage() {
  // ── Data fetching ────────────────────────────────────────────────────────
  const { data: moviesData,   isLoading: loadingMovies   } = useGetMoviesQuery({ limit: 1 });
  const { data: slotsData,    isLoading: loadingSlots    } = useGetSlotsQuery({ limit: 1 });
  const { data: bookingsData, isLoading: loadingBookings } = useGetAllBookingsQuery({
    page:  1,
    limit: 50, // larger page keeps chart data representative
  });

  const bookings = bookingsData?.bookings ?? [];

  // ── KPI values ───────────────────────────────────────────────────────────
  const totalMovies   = moviesData?.pagination?.total   ?? '—';
  const totalSlots    = slotsData?.pagination?.total    ?? '—';
  const totalBookings = bookingsData?.pagination?.total ?? '—';
  const paidRevenue   = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((acc, b) => acc + (b.totalAmount ?? 0), 0);

  // ── Chart series (pure derivation — no side-effects) ─────────────────────
  const revenueSeries = buildRevenueSeries(bookings, 7);
  const statusSeries  = buildStatusSeries(bookings);
  const movieSeries   = buildMovieSeries(bookings, 6);

  return (
    <div className="flex flex-col gap-lg px-md py-md">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here's what's happening."
      />

      {/* ── KPI cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Movies"
          value={loadingMovies ? '…' : totalMovies}
          icon={<Clapperboard size={18} className="text-violet-400" />}
        />
        <StatCard
          title="Active Showtimes"
          value={loadingSlots ? '…' : totalSlots}
          icon={<CalendarClock size={18} className="text-sky-400" />}
        />
        <StatCard
          title="Total Bookings"
          value={loadingBookings ? '…' : totalBookings}
          icon={<BookCheck size={18} className="text-emerald-400" />}
        />
        <StatCard
          title="Revenue (last 50)"
          value={loadingBookings ? '…' : `$${paidRevenue.toFixed(2)}`}
          icon={<DollarSign size={18} className="text-amber-400" />}
        />
      </div>

      {/* ── Charts row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
        <ChartCard
          title="Revenue & Bookings"
          subtitle="Last 7 days"
          className="lg:col-span-2"
        >
          <RevenueChart data={revenueSeries} isLoading={loadingBookings} />
        </ChartCard>

        <ChartCard title="Booking Status" subtitle="Distribution of last 50">
          <StatusPieChart data={statusSeries} isLoading={loadingBookings} />
        </ChartCard>
      </div>

      {/* ── Top movies ─────────────────────────────────────────────── */}
      <ChartCard
        title="Top Movies by Bookings"
        subtitle="Based on the last 50 bookings"
      >
        <TopMoviesChart data={movieSeries} isLoading={loadingBookings} />
      </ChartCard>

      {/* ── Recent bookings + quick actions ────────────────────────── */}
      <div className="grid grid-cols-1 gap-md xl:grid-cols-3">
        <RecentBookingsTable
          bookings={bookings.slice(0, 5)}
          isLoading={loadingBookings}
        />
        <QuickActions />
      </div>
    </div>
  );
}
