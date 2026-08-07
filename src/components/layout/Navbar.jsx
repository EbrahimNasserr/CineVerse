"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Bell, Search, Menu, X, LogIn } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { UserMenu } from "@/components/layout/UserMenu";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { logout } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/releases", label: "Releases" },
  { href: "/contact", label: "Contact" },
  // { href: "/bookings", label: "Bookings" },
];

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------
export function Navbar() {
  const navRef = useRef(null);
  const innerRef = useRef(null);
  const closeBtnRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);
  const [padding, setPadding] = useState(28);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const user = useSelector((s) => s.auth.user);

  // Animate in on first render
  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
  }, []);

  // Shrink on scroll
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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll + Escape while sidebar is open
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
          "fixed left-0 right-0 top-0 z-50 transition-all duration-700 ease-out-expo",
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
            {/* ── Logo ── */}
            <Link href="/" className="shrink-0" aria-label="CineVerse home">
              <Image
                src="/logo.png"
                alt="CineVerse logo"
                width={32}
                height={32}
                className="w-9 object-cover sm:w-10"
                priority
              />
            </Link>

            {/* ── Desktop nav links ── */}
            <DesktopNav pathname={pathname} />

            {/* ── Right-side actions ── */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <SearchBar />
              <NotificationBell />
              <AuthControl user={user} />

              {/* Hamburger — mobile & tablet */}
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
        pathname={pathname}
        user={user}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// DesktopNav
// ---------------------------------------------------------------------------
function DesktopNav({ pathname }) {
  return (
    <div className="hidden items-center gap-9 text-sm text-on-surface-variant lg:flex">
      {NAV_LINKS.map(({ href, label }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative transition-colors duration-200 hover:text-on-surface",
              isActive ? "text-on-surface" : "text-on-surface-variant",
            )}
          >
            {label}
            {/* animated underline */}
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-px bg-primary-container transition-all duration-500",
                isActive ? "w-full" : "w-0 group-hover:w-full",
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchBar
// ---------------------------------------------------------------------------
function SearchBar() {
  return (
    <>
      {/* Desktop search input */}
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

      {/* Mobile search icon */}
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

// ---------------------------------------------------------------------------
// NotificationBell
// ---------------------------------------------------------------------------
function NotificationBell() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="glass relative hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-primary-container/40 sm:flex"
    >
      <Bell size={16} className="text-on-surface-variant" />
      {/* unread indicator */}
      <span
        aria-hidden="true"
        className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-container"
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// AuthControl — UserMenu when logged in, Sign In link when not
// ---------------------------------------------------------------------------
function AuthControl({ user }) {
  if (user) return <UserMenu />;

  return (
    <Link
      href="/login"
      className={cn(
        "hidden h-9 items-center gap-2 rounded-full sm:flex",
        "border border-white/10 bg-white/5 px-4",
        "text-sm font-medium text-on-surface",
        "transition-all duration-200 hover:border-white/20 hover:bg-white/10",
      )}
    >
      <LogIn size={14} aria-hidden="true" />
      Sign In
    </Link>
  );
}

// ---------------------------------------------------------------------------
// MobileSidebar
// ---------------------------------------------------------------------------
function MobileSidebar({ open, onClose, closeBtnRef, pathname, user }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  if (!mounted) return null;

  const handleLogout = () => {
    onClose();
    dispatch(logout());
    router.push("/");
  };

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
          "glass absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col",
          "border-l border-white/10 shadow-2xl",
          "transition-transform duration-500 ease-out-expo",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
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
        <div className="px-5 py-4">
          <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5">
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
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5 px-3">
          {NAV_LINKS.map(({ href, label }, i) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
                className={cn(
                  "rounded-xl px-4 py-3 text-base transition-all duration-500 ease-out-expo",
                  "flex items-center justify-between",
                  open
                    ? "translate-x-0 opacity-100"
                    : "translate-x-6 opacity-0",
                  isActive
                    ? "bg-white/8 font-medium text-on-surface"
                    : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
                )}
              >
                {label}
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer — user section */}
        <div className="mt-auto border-t border-white/10 px-5 py-5">
          {user ? (
            <div className="flex flex-col gap-3">
              {/* Identity */}
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-on-surface">
                    {user.firstName
                      ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
                      : (user.username ?? "My Account")}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Quick links */}
              <div className="flex gap-2">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
                >
                  Profile
                </Link>
                <Link
                  href="/bookings"
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
                >
                  Bookings
                </Link>
                <Link
                  href="/settings"
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
                >
                  Settings
                </Link>
              </div>

              {/* Sign out */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-crimson-dark/30 bg-crimson-dark/10 py-2.5 text-sm font-medium text-crimson-dark transition-colors hover:bg-crimson-dark/20"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-white/10"
            >
              <LogIn size={15} aria-hidden="true" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
