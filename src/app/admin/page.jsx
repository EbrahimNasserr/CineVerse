'use client';

import {
  BookCheck,
  CalendarClock,
  Clapperboard,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useGetMoviesQuery } from '@/features/movies/moviesApi';
import { useGetSlotsQuery } from '@/features/showtimes/showtimesApi';
import { useGetAllBookingsQuery } from '@/features/booking/bookingApi';
import { StatCard } from '@/components/admin/StatCard';
import { PageHeader } from '@/components/admin/PageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Spinner } from '@/components/ui/Spinner';

// ─── Recent bookings mini-table ──────────────────────────────────────────────
function RecentBookings({ bookings, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-lg">
        <Spinner size={28} />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <p className="py-md text-center text-body-sm text-on-surface-variant">
        No bookings yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/[0.06]">
        <thead>
          <tr>
            {['Booking #', 'Customer', 'Movie', 'Amount', 'Status'].map(
              (h) => (
                <th
                  key={h}
                  className="px-md py-sm text-left text-label-caps text-on-surface-variant"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {bookings.map((b) => (
            <tr
              key={b._id}
              className="transition-colors hover:bg-white/[0.03]"
            >
              <td className="px-md py-sm font-mono text-body-sm text-on-surface-variant">
                {b.bookingNumber ?? b._id.slice(-8).toUpperCase()}
              </td>
              <td className="px-md py-sm text-body-sm">
                {b.user
                  ? `${b.user.firstName} ${b.user.lastName}`
                  : '—'}
              </td>
              <td className="px-md py-sm text-body-sm">
                {b.movie?.title ?? '—'}
              </td>
              <td className="px-md py-sm text-body-sm tabular-nums">
                {b.totalAmount != null ? `$${b.totalAmount.toFixed(2)}` : '—'}
              </td>
              <td className="px-md py-sm">
                <StatusBadge value={b.bookingStatus ?? b.paymentStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Quick-action card ────────────────────────────────────────────────────────
function QuickAction({ href, icon: Icon, label, description }) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-surface-container p-md transition-colors hover:border-crimson/40 hover:bg-white/[0.03]"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-crimson/10">
        <Icon size={18} className="text-crimson" />
      </span>
      <div>
        <p className="text-body-sm font-semibold text-on-surface">{label}</p>
        <p className="text-body-sm text-on-surface-variant">{description}</p>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { data: moviesData, isLoading: loadingMovies } = useGetMoviesQuery({
    limit: 1,
  });
  const { data: slotsData, isLoading: loadingSlots } = useGetSlotsQuery({
    limit: 1,
  });
  const { data: bookingsData, isLoading: loadingBookings } =
    useGetAllBookingsQuery({ limit: 5, page: 1 });

  const totalMovies = moviesData?.pagination?.total ?? '—';
  const totalSlots = slotsData?.pagination?.total ?? '—';
  const totalBookings = bookingsData?.pagination?.total ?? '—';

  // Revenue: sum all confirmed booking amounts from the first page (rough KPI)
  const revenue =
    bookingsData?.bookings
      ?.filter((b) => b.paymentStatus === 'paid')
      .reduce((acc, b) => acc + (b.totalAmount ?? 0), 0) ?? null;

  return (
    <div className="flex flex-col gap-lg px-md py-md">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here's what's happening."
      />

      {/* ── KPI grid ───────────────────────────────────────────────── */}
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
          title="Revenue (page)"
          value={
            loadingBookings
              ? '…'
              : revenue != null
              ? `$${revenue.toFixed(2)}`
              : '—'
          }
          icon={<DollarSign size={18} className="text-amber-400" />}
        />
      </div>

      {/* ── Main content: recent bookings + quick actions ───────────── */}
      <div className="grid grid-cols-1 gap-md xl:grid-cols-3">
        {/* Recent bookings (takes 2/3 of the row on xl) */}
        <section className="flex flex-col gap-sm rounded-lg border border-white/[0.08] bg-surface-container p-md xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-title-lg">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-body-sm text-crimson hover:underline"
            >
              View all →
            </Link>
          </div>
          <RecentBookings
            bookings={bookingsData?.bookings}
            isLoading={loadingBookings}
          />
        </section>

        {/* Quick actions */}
        <section className="flex flex-col gap-sm">
          <h2 className="text-title-lg">Quick Actions</h2>
          <div className="flex flex-col gap-sm">
            <QuickAction
              href="/admin/movies"
              icon={Clapperboard}
              label="Manage Movies"
              description="Add, edit, or remove movies"
            />
            <QuickAction
              href="/admin/showtimes"
              icon={CalendarClock}
              label="Schedule Showtimes"
              description="Create and manage slots"
            />
            <QuickAction
              href="/admin/bookings"
              icon={BookCheck}
              label="View Bookings"
              description="Browse all customer bookings"
            />
            <QuickAction
              href="/admin/movies"
              icon={TrendingUp}
              label="Feature a Movie"
              description="Toggle featured / trending flags"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
