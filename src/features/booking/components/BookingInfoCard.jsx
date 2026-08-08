"use client";

import { Film, MapPin, Clock, Calendar, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';

export function BookingInfoCard({ booking }) {
  const movieTitle = booking.movie?.title ?? booking.movie ?? 'Movie';
  const slot       = booking.slot ?? {};

  return (
    <div className="glass rounded-lg p-md flex flex-col gap-sm">
      <h2 className="font-display text-title-lg">Booking Details</h2>
      <div className="h-px bg-white/[0.08]" />

      <InfoRow icon={Film}     label="Movie"   value={movieTitle} />
      <InfoRow icon={MapPin}   label="Theater" value={slot.theater} />
      <InfoRow icon={Tag}      label="Screen"  value={slot.screen} />
      <InfoRow icon={Calendar} label="Date"    value={slot.date ? formatDate(slot.date) : undefined} />
      <InfoRow
        icon={Clock}
        label="Time"
        value={slot.startTime && slot.endTime ? `${slot.startTime} – ${slot.endTime}` : undefined}
      />
      <InfoRow icon={Tag} label="Format"   value={slot.format} />
      <InfoRow icon={Tag} label="Language" value={slot.language} />

      {booking.selectedSeats?.length > 0 && (
        <div className="flex items-start gap-sm text-body-sm">
          <Tag size={16} className="mt-px shrink-0 text-on-surface-variant" />
          <span className="w-24 shrink-0 text-on-surface-variant">Seats</span>
          <span className="text-on-surface">{booking.selectedSeats.join(', ')}</span>
        </div>
      )}

      {booking.notes && (
        <div className="mt-xs rounded border border-white/[0.06] bg-white/[0.03] px-sm py-xs text-body-sm text-on-surface-variant">
          {booking.notes}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-sm text-body-sm">
      <Icon size={16} className="mt-px shrink-0 text-on-surface-variant" />
      <span className="w-24 shrink-0 text-on-surface-variant">{label}</span>
      <span className="text-on-surface">{value}</span>
    </div>
  );
}
