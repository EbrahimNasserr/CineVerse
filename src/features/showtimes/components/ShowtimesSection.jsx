"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { DateStrip } from './DateStrip';
import { TheaterPicker } from './TheaterPicker';
import { ShowtimePill } from './ShowtimePill';
import { BookingPanel } from './BookingPanel';
import { toDateKey } from '@/features/showtimes/utils/dateHelpers';

export function ShowtimesSection({ slots, movieId }) {
  const router = useRouter();

  // ── Sorted unique date keys ───────────────────────────────────────────────
  const allDates = useMemo(() => {
    const keys = [...new Set(slots.map((s) => toDateKey(s.date)))];
    return keys.sort();
  }, [slots]);

  const [selectedDate, setSelectedDate] = useState(() => allDates[0] ?? null);

  // ── Slots on the selected date ────────────────────────────────────────────
  const slotsForDate = useMemo(
    () => slots.filter((s) => toDateKey(s.date) === selectedDate),
    [slots, selectedDate],
  );

  // ── Unique theaters on that date ──────────────────────────────────────────
  const theatersForDate = useMemo(
    () => [...new Set(slotsForDate.map((s) => s.theater))].sort(),
    [slotsForDate],
  );

  const [selectedTheater, setSelectedTheater] = useState(() => theatersForDate[0] ?? null);

  const resolvedTheater = theatersForDate.includes(selectedTheater)
    ? selectedTheater
    : theatersForDate[0] ?? null;

  // ── Showtime pills for selected date + theater ────────────────────────────
  const visibleSlots = useMemo(
    () =>
      slotsForDate
        .filter((s) => s.theater === resolvedTheater)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [slotsForDate, resolvedTheater],
  );

  const [selectedSlotId, setSelectedSlotId] = useState(
    () => visibleSlots.find((s) => s.availableSeats > 0)?._id ?? visibleSlots[0]?._id ?? null,
  );

  const resolvedSlot =
    visibleSlots.find((s) => s._id === selectedSlotId) ??
    visibleSlots.find((s) => s.availableSeats > 0) ??
    visibleSlots[0] ??
    null;

  const handleDateChange = (key) => {
    setSelectedDate(key);
    setSelectedSlotId(null);
  };

  const handleTheaterChange = (name) => {
    setSelectedTheater(name);
    setSelectedSlotId(null);
  };

  if (!allDates.length) {
    return (
      <EmptyState
        title="No upcoming showtimes"
        description="There are no scheduled screenings right now. Check back soon."
      />
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-content gap-lg lg:grid-cols-[1.2fr_0.8fr]">

      {/* ── Left: filters + showtime grid ── */}
      <section className="flex flex-col gap-md rounded-2xl border border-white/[0.08] bg-surface-container/70 p-md md:p-lg">

        <div className="flex flex-col gap-xs">
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
            Date
          </label>
          <DateStrip
            dates={allDates}
            selected={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        {theatersForDate.length > 1 && (
          <div className="flex flex-col gap-xs">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
              Theater
            </label>
            <TheaterPicker
              theaters={theatersForDate}
              selected={resolvedTheater}
              onChange={handleTheaterChange}
            />
          </div>
        )}

        <div className="flex flex-col gap-xs">
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
            Showtime
          </label>
          {visibleSlots.length ? (
            <div className="flex flex-wrap gap-2">
              {visibleSlots.map((slot) => (
                <ShowtimePill
                  key={slot._id}
                  slot={slot}
                  isSelected={slot._id === resolvedSlot?._id}
                  onClick={() => setSelectedSlotId(slot._id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-on-surface-variant">
              No showtimes available for this selection.
            </p>
          )}
        </div>

        {theatersForDate.length === 1 && (
          <div className="flex items-center gap-xs text-body-sm text-on-surface-variant">
            <MapPin size={13} />
            <span>{resolvedTheater}</span>
          </div>
        )}
      </section>

      {/* ── Right: booking panel ── */}
      <BookingPanel
        selectedSlot={resolvedSlot}
        onBook={() => resolvedSlot && router.push(`/booking/${resolvedSlot._id}`)}
      />
    </div>
  );
}
