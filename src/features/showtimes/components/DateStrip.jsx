"use client";

import { cn } from '@/lib/utils/cn';
import { dateLabel } from '@/features/showtimes/utils/dateHelpers';

export function DateStrip({ dates, selected, onChange }) {
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
