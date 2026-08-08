"use client";

import { cn } from '@/lib/utils/cn';

const FILTER_TABS = [
  { label: 'All',       value: undefined   },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Cancelled', value: 'cancelled' },
];

export function FilterTabs({ active, onChange }) {
  return (
    <div role="tablist" aria-label="Filter bookings" className="flex gap-xs overflow-x-auto pb-1">
      {FILTER_TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.label}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'shrink-0 rounded-full border px-sm py-xs text-body-sm font-medium transition-colors',
              isActive
                ? 'border-crimson bg-crimson/10 text-crimson'
                : 'border-white/[0.08] bg-transparent text-on-surface-variant hover:border-white/20',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
