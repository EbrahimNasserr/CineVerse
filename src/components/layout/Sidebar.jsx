"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  Clapperboard,
  LayoutDashboard,
  Menu,
  Ticket,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/movies",    label: "Movies",     icon: Clapperboard    },
  { href: "/admin/showtimes", label: "Showtimes",  icon: CalendarClock   },
  { href: "/admin/bookings",  label: "Bookings",   icon: Ticket          },
];

function NavLink({ href, label, icon: Icon, onClick }) {
  const pathname = usePathname();
  // Exact match for dashboard, prefix match for everything else.
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded px-sm py-xs text-body-sm transition-colors",
        isActive
          ? "bg-crimson/10 text-crimson font-semibold"
          : "text-on-surface-variant hover:bg-white/[0.06] hover:text-on-surface"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon size={16} className="shrink-0" />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* ── Mobile toggle ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-container-lowest text-on-surface shadow-lg transition-transform duration-200 hover:scale-105 md:hidden"
        aria-label="Toggle navigation"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* ── Mobile backdrop ───────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={close}
        aria-hidden="true"
      />

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/[0.08] bg-surface-container-lowest p-sm transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
            Admin
          </span>
          <button
            type="button"
            onClick={close}
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-white/[0.06] hover:text-on-surface"
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink key={link.href} {...link} onClick={close} />
          ))}
        </nav>
      </aside>

      {/* ── Desktop sidebar ───────────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 border-r border-white/[0.08] bg-surface-container-lowest p-sm md:flex md:flex-col">
        <p className="mb-4 px-sm text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
          Admin
        </p>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </aside>
    </>
  );
}
