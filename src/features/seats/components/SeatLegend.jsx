const ITEMS = [
  { label: 'Available',  className: 'border border-teal bg-transparent' },
  { label: 'VIP',        className: 'border border-gold bg-transparent' },
  { label: 'Selected',   className: 'bg-crimson shadow-glow' },
  { label: 'Held',       className: 'border border-gold/30 bg-gold/20' },
  { label: 'Occupied',   className: 'bg-white/10' },
];

export function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-md gap-y-xs text-body-sm text-on-surface-variant">
      {ITEMS.map(({ label, className }) => (
        <div key={label} className="flex items-center gap-1">
          <span className={`h-4 w-4 rounded-sm ${className}`} aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
