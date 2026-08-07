'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, Monitor, Ticket, MapPin, ChevronRight } from 'lucide-react';

import { useGetMovieByIdQuery } from '@/features/movies/moviesApi';
import { useGetSlotsByMovieQuery } from '@/features/showtimes/showtimesApi';
import { MovieHero } from '@/features/movies/components/MovieHero';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { cn } from '@/lib/utils/cn';
import { getMovieById as getMockMovieById } from '@/lib/constants/mockMovies';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converts a Date or ISO string to a local YYYY-MM-DD key. */
function toDateKey(dateVal) {
  const d = new Date(dateVal);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Short weekday + day label for the date strip. */
function dateLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = toDateKey(new Date());
  const tomorrow = toDateKey(new Date(Date.now() + 86_400_000));

  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const day     = d;
  const month   = date.toLocaleDateString('en-US', { month: 'short' });

  if (dateKey === today)    return { top: 'Today', bottom: `${month} ${day}` };
  if (dateKey === tomorrow) return { top: 'Tomorrow', bottom: `${month} ${day}` };
  return { top: weekday, bottom: `${month} ${day}` };
}

const FORMAT_BADGE = {
  IMAX: 'border-gold/40 bg-gold/10 text-gold',
  '4DX': 'border-teal/40 bg-teal/10 text-teal',
  '3D':  'border-primary/30 bg-primary/10 text-primary',
  '2D':  'border-white/10 bg-white/5 text-on-surface-variant',
};

// ─── Date strip ──────────────────────────────────────────────────────────────

function DateStrip({ dates, selected, onChange }) {
  if (!dates.length) return null;
  return (
    <div
      role="tablist"
      aria-label="Select date"
      className="flex gap-2 overflow-x-auto pb-1"
    >
      {dates.map((key) => {
        const { top, bottom } = dateLabel(key);
        const isActive = key === selected;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              'flex shrink-0 flex-col items-center rounded-lg border px-sm py-xs transition-colors',
              isActive
                ? 'border-crimson bg-crimson/10 text-on-surface'
                : 'border-white/[0.08] bg-transparent text-on-surface-variant hover:border-white/[0.16]',
            )}
          >
            <span className={cn('text-[11px] font-bold uppercase tracking-wide', isActive ? 'text-crimson' : '')}>
              {top}
            </span>
            <span className="text-body-sm">{bottom}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Theater chips ────────────────────────────────────────────────────────────

function TheaterPicker({ theaters, selected, onChange }) {
  if (!theaters.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {theaters.map((name) => (
        <Chip
          key={name}
          active={name === selected}
          onClick={() => onChange(name)}
          className="text-body-sm"
        >
          {name}
        </Chip>
      ))}
    </div>
  );
}

// ─── Showtime pill ────────────────────────────────────────────────────────────

function ShowtimePill({ slot, isSelected, onClick }) {
  const isSoldOut = slot.availableSeats === 0;
  const badgeCls  = FORMAT_BADGE[slot.format] ?? FORMAT_BADGE['2D'];

  return (
    <button
      type="button"
      disabled={isSoldOut}
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-1 rounded-lg border px-sm py-xs transition-colors',
        isSelected
          ? 'border-crimson bg-crimson/10 text-on-surface'
          : 'border-white/[0.08] bg-transparent text-on-surface-variant hover:border-white/[0.16] hover:text-on-surface',
        isSoldOut && 'cursor-not-allowed opacity-35',
      )}
    >
      <span className="font-medium text-body-sm">{slot.startTime}</span>
      <span className={cn('rounded border px-1 py-px text-[10px] font-bold uppercase tracking-wide', badgeCls)}>
        {slot.format}
      </span>
      {isSoldOut && (
        <span className="text-[10px] text-on-surface-variant">Sold out</span>
      )}
    </button>
  );
}

// ─── Booking panel (right column) ────────────────────────────────────────────

function BookingPanel({ selectedSlot, onBook }) {
  return (
    <aside className="glass flex flex-col gap-md rounded-2xl border border-white/[0.08] p-md md:p-lg">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          Booking Panel
        </p>
        <h2 className="mt-1 font-display text-headline-sm">Reserve seats</h2>
      </div>

      {selectedSlot ? (
        <>
          {/* Slot info card */}
          <div className="flex flex-col gap-xs rounded-lg border border-white/[0.06] bg-white/[0.03] p-sm">
            <InfoRow icon={MapPin}  value={`${selectedSlot.theater} · ${selectedSlot.screen ?? 'Screen 1'}`} />
            <InfoRow icon={Calendar} value={new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} />
            <InfoRow icon={Clock}   value={`${selectedSlot.startTime} – ${selectedSlot.endTime}`} />
            <InfoRow icon={Monitor} value={selectedSlot.format} badge={FORMAT_BADGE[selectedSlot.format]} />
            {selectedSlot.language && selectedSlot.language !== 'English' && (
              <InfoRow icon={Ticket} value={selectedSlot.language} />
            )}
          </div>

          {/* Pricing */}
          <div className="flex flex-col gap-xs text-body-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-on-surface-variant">Price per seat</span>
              <span className="font-display text-title-lg text-primary">
                {formatCurrency(selectedSlot.price)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Available</span>
              <span className={selectedSlot.availableSeats < 20 ? 'font-medium text-gold' : 'text-on-surface'}>
                {selectedSlot.availableSeats} seat{selectedSlot.availableSeats !== 1 ? 's' : ''}
                {selectedSlot.availableSeats < 20 && selectedSlot.availableSeats > 0 && ' — hurry!'}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            disabled={selectedSlot.availableSeats === 0}
            onClick={onBook}
          >
            <span className="flex items-center gap-xs">
              Choose seats
              <ChevronRight size={16} />
            </span>
          </Button>

          <p className="text-center text-[11px] text-on-surface-variant">
            Seats held for 10 min · Free cancellation 2 h before show
          </p>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-sm py-lg text-center text-on-surface-variant">
          <Ticket size={32} className="opacity-30" />
          <p className="text-body-sm">
            Pick a date and showtime to see pricing and availability.
          </p>
        </div>
      )}
    </aside>
  );
}

function InfoRow({ icon: Icon, value, badge }) {
  return (
    <div className="flex items-center gap-xs text-body-sm">
      <Icon size={14} className="shrink-0 text-on-surface-variant" />
      {badge ? (
        <span className={cn('rounded border px-1 py-px text-[10px] font-bold uppercase tracking-wide', badge)}>
          {value}
        </span>
      ) : (
        <span className="text-on-surface">{value}</span>
      )}
    </div>
  );
}

// ─── Showtimes section ────────────────────────────────────────────────────────

function ShowtimesSection({ slots, movieId }) {
  const router = useRouter();

  // ── 1. Derive sorted unique date keys ──────────────────────────────────────
  const allDates = useMemo(() => {
    const keys = [...new Set(slots.map((s) => toDateKey(s.date)))];
    return keys.sort();
  }, [slots]);

  const [selectedDate, setSelectedDate] = useState(() => allDates[0] ?? null);

  // ── 2. Slots on the selected date ─────────────────────────────────────────
  const slotsForDate = useMemo(
    () => slots.filter((s) => toDateKey(s.date) === selectedDate),
    [slots, selectedDate],
  );

  // ── 3. Unique theaters on that date ───────────────────────────────────────
  const theatersForDate = useMemo(
    () => [...new Set(slotsForDate.map((s) => s.theater))].sort(),
    [slotsForDate],
  );

  const [selectedTheater, setSelectedTheater] = useState(() => theatersForDate[0] ?? null);

  // Keep selectedTheater valid when date changes
  const resolvedTheater = theatersForDate.includes(selectedTheater)
    ? selectedTheater
    : theatersForDate[0] ?? null;

  // ── 4. Showtime pills for selected date + theater ─────────────────────────
  const visibleSlots = useMemo(
    () => slotsForDate.filter((s) => s.theater === resolvedTheater).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [slotsForDate, resolvedTheater],
  );

  // Default: first non-sold-out slot
  const [selectedSlotId, setSelectedSlotId] = useState(
    () => visibleSlots.find((s) => s.availableSeats > 0)?._id ?? visibleSlots[0]?._id ?? null,
  );

  const resolvedSlot = visibleSlots.find((s) => s._id === selectedSlotId)
    ?? visibleSlots.find((s) => s.availableSeats > 0)
    ?? visibleSlots[0]
    ?? null;

  const handleDateChange = (key) => {
    setSelectedDate(key);
    setSelectedSlotId(null); // reset; resolvedSlot picks first available
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

        {/* Date strip */}
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

        {/* Theater chips */}
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

        {/* Showtime pills */}
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
                  isSelected={slot._id === (resolvedSlot?._id)}
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

        {/* Theater address hint (single theater) */}
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

// ─── Movie synopsis section ───────────────────────────────────────────────────

function SynopsisSection({ movie }) {
  const runtime = movie.duration ? `${movie.duration}m` : movie.runtime;
  const year    = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : movie.year;

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-surface-container/70 p-md md:p-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Synopsis</p>
          <h2 className="mt-1 text-headline-sm">{movie.title}</h2>
        </div>
      </div>

      <p className="mt-md max-w-2xl text-body-md text-on-surface-variant">
        {movie.description || movie.synopsis}
      </p>

      <div className="mt-md grid gap-3 sm:grid-cols-3">
        <MetaTile label="Runtime" value={runtime || '—'} />
        <MetaTile label="Year"    value={year   || '—'} />
        <MetaTile
          label="Genres"
          value={movie.genres?.join(' · ') || '—'}
        />
      </div>
    </section>
  );
}

function MetaTile({ label, value }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-sm">
      <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{label}</p>
      <p className="mt-1 font-display text-title-lg">{value}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const id = Array.isArray(movieId) ? movieId[0] : movieId;

  const { data: movieResponse, isLoading: movieLoading, isError: movieError } =
    useGetMovieByIdQuery(id, { skip: !id });

  const { data: slotsResponse, isLoading: slotsLoading } =
    useGetSlotsByMovieQuery(id, { skip: !id });

  // ── Data normalisation ──────────────────────────────────────────────────────
  // API: { success: true, data: {...} }   Mock: plain object
  const apiMovie    = movieResponse?.success ? movieResponse.data : null;
  const activeMovie = apiMovie ?? getMockMovieById(id);

  // API: { success: true, data: [...], pagination: {...} }
  const slots = slotsResponse?.data ?? [];

  // ── Loading / error states ──────────────────────────────────────────────────
  if (movieLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={36} />
      </div>
    );
  }

  if (movieError && !activeMovie) {
    return (
      <EmptyState
        title="Movie not found"
        description="We couldn't find this title. It may have been removed."
      />
    );
  }

  if (!activeMovie) return null;

  return (
    <div className="flex flex-col gap-lg pb-xl">
      <MovieHero movie={activeMovie} />

      <div className="mx-auto w-full max-w-content px-md md:px-lg flex flex-col gap-lg">
        <SynopsisSection movie={activeMovie} />

        <div>
          <div className="mb-md flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
                Screenings
              </p>
              <h2 className="mt-1 text-headline-sm">Pick a showtime</h2>
            </div>
            {slotsLoading && <Spinner size={18} />}
          </div>

          {!slotsLoading && (
            <ShowtimesSection slots={slots} movieId={id} />
          )}
        </div>
      </div>
    </div>
  );
}
