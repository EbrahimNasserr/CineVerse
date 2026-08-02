'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { href: '/movies', label: 'Explore' },
  { href: '/movies', label: 'Genres' },
  { href: '/movies', label: 'Theaters' },
  { href: '/movies', label: 'Offers' },
];

export function Navbar() {
  const navRef = useRef(null);
  const innerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);
  const [padding, setPadding] = useState(28);

  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
  }, []);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const progress = Math.min(1, y / 100);
      setPadding(28 - progress * 16);
      setScrolled(y > 20);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header
      ref={navRef}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-opacity duration-700 ease-out-expo',
        ready ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0',
        scrolled && 'nav-scrolled'
      )}
    >
      <div className="nav-bg">
        <nav
          ref={innerRef}
          className="mx-auto flex max-w-content items-center justify-between px-6 lg:px-10"
          style={{ paddingTop: padding, paddingBottom: padding }}
        >
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-display text-2xl font-black tracking-tight lg:text-3xl">
              <span className="text-primary-container">Cine</span>
              <span className="text-on-surface">Verse</span>
            </span>
          </Link>

          <div className="hidden items-center gap-9 text-sm text-on-surface-variant lg:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="group relative transition-colors hover:text-on-surface"
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary-container transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="glass hidden w-56 items-center gap-2 rounded-full px-4 py-2 md:flex lg:w-64">
              <Search size={14} className="shrink-0 text-on-surface-variant" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search films, actors…"
                aria-label="Search films and actors"
                className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/60"
              />
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="glass relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-primary-container/40"
            >
              <Bell size={16} className="text-on-surface-variant" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-container" />
            </button>

            <Link
              href="/login"
              aria-label="Account"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-gold to-crimson-dark text-xs font-bold text-obsidian"
            >
              AR
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
