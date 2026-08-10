import Link from 'next/link';
import {
  BookCheck,
  CalendarClock,
  Clapperboard,
  TrendingUp,
} from 'lucide-react';

const ACTIONS = [
  {
    href:        '/admin/movies',
    icon:        Clapperboard,
    label:       'Manage Movies',
    description: 'Add, edit, or remove movies',
  },
  {
    href:        '/admin/showtimes',
    icon:        CalendarClock,
    label:       'Schedule Showtimes',
    description: 'Create and manage slots',
  },
  {
    href:        '/admin/bookings',
    icon:        BookCheck,
    label:       'View Bookings',
    description: 'Browse all customer bookings',
  },
  {
    href:        '/admin/movies',
    icon:        TrendingUp,
    label:       'Feature a Movie',
    description: 'Toggle featured / trending flags',
  },
];

// ─── Single action tile ───────────────────────────────────────────────────────
function ActionTile({ href, icon: Icon, label, description }) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-surface-container p-md transition-colors hover:border-crimson/40 hover:bg-white/[0.03]"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-crimson/10">
        <Icon size={18} className="text-crimson" />
      </span>
      <div>
        <p className="text-body-sm font-semibold text-on-surface">{label}</p>
        <p className="text-body-sm text-on-surface-variant">{description}</p>
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Grid of quick-navigation tiles for the admin dashboard sidebar column.
 */
export function QuickActions() {
  return (
    <section className="flex flex-col gap-sm">
      <h2 className="text-title-lg">Quick Actions</h2>
      <div className="flex flex-col gap-sm">
        {ACTIONS.map((action) => (
          <ActionTile key={action.label} {...action} />
        ))}
      </div>
    </section>
  );
}
