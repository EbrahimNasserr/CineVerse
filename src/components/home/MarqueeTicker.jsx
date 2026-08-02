const DOT_COLORS = ['bg-crimson', 'bg-gold', 'bg-teal'];

export function MarqueeTicker({ items = [] }) {
  const track = (ariaHidden) => (
    <span className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={ariaHidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-on-surface-variant/60">
          <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
          {item}
        </span>
      ))}
    </span>
  );

  return (
    <div className="overflow-hidden border-y border-white/[0.08] py-4">
      <div className="flex w-max animate-marquee gap-12 motion-reduce:animate-none">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
