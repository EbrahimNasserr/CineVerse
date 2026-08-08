"use client";

import { cn } from '@/lib/utils/cn';
import { FORMAT_BADGE } from '@/features/showtimes/utils/dateHelpers';

export function ShowtimePill({ slot, isSelected, onClick }) {
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
