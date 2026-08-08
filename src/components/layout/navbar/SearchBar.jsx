"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <>
      {/* Desktop */}
      <div className="glass hidden w-56 items-center gap-2 rounded-full px-4 py-2 md:flex lg:w-64">
        <Search
          size={14}
          className="shrink-0 text-on-surface-variant"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search films, actors…"
          aria-label="Search films and actors"
          className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/60"
        />
      </div>

      {/* Mobile icon */}
      <button
        type="button"
        aria-label="Search"
        className="glass flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-primary-container/40 md:hidden"
      >
        <Search size={16} className="text-on-surface-variant" />
      </button>
    </>
  );
}
