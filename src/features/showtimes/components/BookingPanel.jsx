"use client";

import { Calendar, Clock, Monitor, Ticket, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { FORMAT_BADGE } from '@/features/showtimes/utils/dateHelpers';
import { cn } from '@/lib/utils/cn';

export function BookingPanel({ selectedSlot, onBook }) {
  return (
    <aside className="glass flex flex-col gap-md rounded-2xl border border-white/[0.08] p-md md:p-lg">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          Booking Panel
        </p>
        <h2 className="mt-1 font-display text-headline-sm">Reserve seats</h2>
      </div>

      {selectedSlot ? (
        <SelectedSlotContent selectedSlot={selectedSlot} onBook={onBook} />
      ) : (
        <EmptySlotPrompt />
      )}
    </aside>
  );
}

// ── Slot selected ─────────────────────────────────────────────────────────────

function SelectedSlotContent({ selectedSlot, onBook }) {
  return (
    <>
      <SlotInfoCard slot={selectedSlot} />
      <SlotPricing slot={selectedSlot} />

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
  );
}

// ── Slot info card ────────────────────────────────────────────────────────────

function SlotInfoCard({ slot }) {
  return (
    <div className="flex flex-col gap-xs rounded-lg border border-white/[0.06] bg-white/[0.03] p-sm">
      <InfoRow icon={MapPin}   value={`${slot.theater} · ${slot.screen ?? 'Screen 1'}`} />
      <InfoRow icon={Calendar} value={new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} />
      <InfoRow icon={Clock}    value={`${slot.startTime} – ${slot.endTime}`} />
      <InfoRow icon={Monitor}  value={slot.format} badge={FORMAT_BADGE[slot.format]} />
      {slot.language && slot.language !== 'English' && (
        <InfoRow icon={Ticket} value={slot.language} />
      )}
    </div>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────

function SlotPricing({ slot }) {
  return (
    <div className="flex flex-col gap-xs text-body-sm">
      <div className="flex items-baseline justify-between">
        <span className="text-on-surface-variant">Price per seat</span>
        <span className="font-display text-title-lg text-primary">
          {formatCurrency(slot.price)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-on-surface-variant">Available</span>
        <span className={slot.availableSeats < 20 ? 'font-medium text-gold' : 'text-on-surface'}>
          {slot.availableSeats} seat{slot.availableSeats !== 1 ? 's' : ''}
          {slot.availableSeats < 20 && slot.availableSeats > 0 && ' — hurry!'}
        </span>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptySlotPrompt() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-sm py-lg text-center text-on-surface-variant">
      <Ticket size={32} className="opacity-30" />
      <p className="text-body-sm">
        Pick a date and showtime to see pricing and availability.
      </p>
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

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
