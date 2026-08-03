"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, Clapperboard, Menu, X } from "lucide-react";

const links = [
  { href: "/admin/movies", label: "Movies", icon: Clapperboard },
  { href: "/admin/showtimes", label: "Showtimes", icon: CalendarClock },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);

  const closeSidebar = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-container-lowest text-on-surface shadow-lg transition-transform duration-200 hover:scale-105 md:hidden"
        aria-label="Toggle navigation"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/[0.08] bg-surface-container-lowest p-sm transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
            Admin
          </span>
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-white/[0.06] hover:text-on-surface"
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeSidebar}
              className="flex items-center gap-2 rounded px-sm py-xs text-body-sm text-on-surface transition-colors hover:bg-white/[0.06]"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <aside className="hidden w-60 shrink-0 border-r border-white/[0.08] bg-surface-container-lowest p-sm md:block">
        <nav className="flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded px-sm py-xs text-body-sm text-on-surface transition-colors hover:bg-white/[0.06]"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
