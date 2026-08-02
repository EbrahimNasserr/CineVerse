import Link from 'next/link';
import { Clapperboard, CalendarClock } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-white/[0.08] bg-surface-container-lowest p-sm">
      <nav className="flex flex-col gap-1">
        <Link
          href="/admin/movies"
          className="flex items-center gap-2 rounded px-sm py-xs text-body-sm hover:bg-white/[0.06]"
        >
          <Clapperboard size={16} />
          Movies
        </Link>
        <Link
          href="/admin/showtimes"
          className="flex items-center gap-2 rounded px-sm py-xs text-body-sm hover:bg-white/[0.06]"
        >
          <CalendarClock size={16} />
          Showtimes
        </Link>
      </nav>
    </aside>
  );
}
