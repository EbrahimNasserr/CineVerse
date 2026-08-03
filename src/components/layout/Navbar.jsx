"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Image from "next/image.js";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/releases", label: "Releases" },
  { href: "/contact", label: "Contact" },
  { href: "/bookings", label: "Bookings" },
];

export function Navbar() {
  const navRef = useRef(null);
  const innerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);
  const [padding, setPadding] = useState(28);
  const [menuOpen, setMenuOpen] = useState(false);

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
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Lock body scroll + close on Escape while the sidebar is open
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-opacity duration-700 ease-out-expo",
          ready ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0",
          scrolled && "nav-scrolled",
        )}
      >
        <div className="nav-bg">
          <nav
            ref={innerRef}
            className="mx-auto flex max-w-content items-center justify-between px-4 sm:px-6 lg:px-10"
            style={{ paddingTop: padding, paddingBottom: padding }}
          >
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="CineVerse logo"
                width={32}
                height={32}
                className="w-9 object-cover sm:w-10"
              />
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

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
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

              {/* Mobile search trigger — shows below md where the input is hidden */}
              <button
                type="button"
                aria-label="Search"
                className="glass flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-primary-container/40 md:hidden"
              >
                <Search size={16} className="text-on-surface-variant" />
              </button>

              <button
                type="button"
                aria-label="Notifications"
                className="glass relative hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-primary-container/40 sm:flex"
              >
                <Bell size={16} className="text-on-surface-variant" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-container" />
              </button>

              <Link
                href="/login"
                aria-label="Account"
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-gold to-crimson-dark text-xs font-bold text-obsidian sm:flex"
              >
                AR
              </Link>

              {/* Hamburger — mobile & tablet only */}
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-sidebar"
                onClick={() => setMenuOpen(true)}
                className="glass flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-primary-container/40 lg:hidden"
              >
                <Menu size={16} className="text-on-surface-variant" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <MobileSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        closeBtnRef={closeBtnRef}
      />
    </>
  );
}

function MobileSidebar({ open, onClose, closeBtnRef }) {
  const [mounted, setMounted] = useState(false);

  // Keep the drawer mounted through its exit transition
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden",
        !open && "pointer-events-none",
      )}
      onTransitionEnd={() => {
        if (!open) setMounted(false);
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-obsidian/70 backdrop-blur-sm transition-opacity duration-500 ease-out-expo",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <div
        id="mobile-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "glass absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col gap-1 border-l border-white/10 px-6 py-6 shadow-2xl transition-transform duration-500 ease-out-expo",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="CineVerse logo"
            width={28}
            height={28}
            className="w-9 object-cover"
          />
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="glass flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-primary-container/40"
          >
            <X size={16} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Mobile search */}
        <div className="glass mb-6 flex items-center gap-2 rounded-full px-4 py-2.5">
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

        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }, i) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
              className={cn(
                "rounded-lg px-3 py-3 text-base text-on-surface-variant transition-all duration-500 ease-out-expo hover:bg-white/5 hover:text-on-surface",
                open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-5">
          <Link
            href="/login"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-gold to-crimson-dark text-xs font-bold text-obsidian"
          >
            AR
          </Link>
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-on-surface">My Account</span>
            <span className="text-xs text-on-surface-variant">
              View profile & bookings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
