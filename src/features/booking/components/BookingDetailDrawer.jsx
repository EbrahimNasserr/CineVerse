'use client';

import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';
import { StatusBadge } from '@/components/admin/StatusBadge';

// ─── Small info row ───────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.05] py-2 last:border-0">
      <span className="shrink-0 text-body-sm text-on-surface-variant">{label}</span>
      <span className="text-right text-body-sm text-on-surface">{value}</span>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-label-caps text-on-surface-variant">{title}</p>
      <div className="rounded-lg border border-white/[0.08] bg-surface-container px-md py-1">
        {children}
      </div>
    </div>
  );
}

// ─── Seat list ────────────────────────────────────────────────────────────────
function SeatList({ seats }) {
  if (!Array.isArray(seats) || seats.length === 0) {
    return <p className="py-2 text-body-sm text-on-surface-variant">No seat data</p>;
  }

  return (
    <div className="flex flex-wrap gap-1 py-2">
      {seats.map((s, i) => {
        const label = s.seatNumber ?? s.label ?? s;
        return (
          <span
            key={i}
            className="inline-flex items-center rounded border border-white/[0.08] bg-surface-container-lowest px-2 py-0.5 font-mono text-xs text-on-surface"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

// ─── Main drawer ──────────────────────────────────────────────────────────────
/**
 * Slide-in panel showing full booking details.
 *
 * @param {object|null} booking  - Booking to display; null = closed
 * @param {function}    onClose  - Dismissal callback
 */
export function BookingDetailDrawer({ booking, onClose }) {
  const open = Boolean(booking);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Booking details"
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/[0.08] bg-surface-container-lowest transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-md py-sm">
          <div>
            <h2 className="text-title-lg">Booking Details</h2>
            {booking?.bookingNumber && (
              <p className="font-mono text-body-sm text-on-surface-variant">
                #{booking.bookingNumber}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-white/[0.06] hover:text-on-surface"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex flex-1 flex-col gap-md overflow-y-auto px-md py-md">
          {!booking ? null : (
            <>
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                {booking.bookingStatus && (
                  <StatusBadge value={booking.bookingStatus} />
                )}
                {booking.paymentStatus && (
                  <StatusBadge value={booking.paymentStatus} />
                )}
              </div>

              {/* Customer */}
              <Section title="Customer">
                <InfoRow
                  label="Name"
                  value={
                    booking.user
                      ? `${booking.user.firstName} ${booking.user.lastName}`
                      : undefined
                  }
                />
                <InfoRow label="Email" value={booking.user?.email} />
              </Section>

              {/* Movie & showtime */}
              <Section title="Movie & Showtime">
                <InfoRow label="Movie"   value={booking.movie?.title} />
                <InfoRow
                  label="Date"
                  value={
                    booking.slot?.date
                      ? new Date(booking.slot.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year:    'numeric',
                          month:   'long',
                          day:     'numeric',
                        })
                      : undefined
                  }
                />
                <InfoRow label="Time"    value={booking.slot?.startTime} />
                <InfoRow label="Theater" value={booking.slot?.theater} />
                <InfoRow label="Screen"  value={booking.slot?.screen} />
              </Section>

              {/* Seats */}
              <Section title="Seats">
                <SeatList seats={booking.seats} />
              </Section>

              {/* Payment */}
              <Section title="Payment">
                <InfoRow
                  label="Total"
                  value={
                    booking.totalAmount != null
                      ? `$${Number(booking.totalAmount).toFixed(2)}`
                      : undefined
                  }
                />
                <InfoRow label="Payment ID" value={booking.paymentIntentId} />
                <InfoRow
                  label="Booked"
                  value={
                    booking.bookedAt || booking.createdAt
                      ? new Date(
                          booking.bookedAt ?? booking.createdAt
                        ).toLocaleString('en-US', {
                          year:   'numeric',
                          month:  'short',
                          day:    'numeric',
                          hour:   '2-digit',
                          minute: '2-digit',
                        })
                      : undefined
                  }
                />
              </Section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

BookingDetailDrawer.propTypes = {
  booking: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
