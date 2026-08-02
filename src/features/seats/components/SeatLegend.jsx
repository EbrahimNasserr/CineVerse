export function SeatLegend() {
  const items = [
    { label: 'Available', className: 'border border-teal bg-transparent' },
    { label: 'Selected', className: 'bg-crimson' },
    { label: 'VIP', className: 'border border-gold bg-transparent' },
    { label: 'Occupied', className: 'bg-white/10' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-md text-body-sm text-on-surface-variant">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1">
          <span className={`h-4 w-4 rounded-sm ${item.className}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
