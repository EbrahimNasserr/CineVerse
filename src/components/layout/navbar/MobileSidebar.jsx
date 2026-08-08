"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Search, X, LogIn } from "lucide-react";
import { logout } from "@/features/auth/authSlice";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils/cn";
import { NAV_LINKS } from "./navLinks";

export function MobileSidebar({ open, onClose, pathname, user }) {
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // Focus the close button when the sidebar opens
  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
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
        <SidebarHeader closeBtnRef={closeBtnRef} onClose={onClose} />
        <SidebarSearch />
        <SidebarNav pathname={pathname} open={open} onClose={onClose} />
        <SidebarFooter user={user} onClose={onClose} onLogout={handleLogout} />
      </div>
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────
function SidebarHeader({ closeBtnRef, onClose }) {
  return (
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
  );
}

// ── Search ───────────────────────────────────────────────────────────────────
function SidebarSearch() {
  return (
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
  );
}

// ── Nav links ────────────────────────────────────────────────────────────────
function SidebarNav({ pathname, open, onClose }) {
  return (
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
              open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
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
  );
}

// ── Footer (user section) ────────────────────────────────────────────────────
function SidebarFooter({ user, onClose, onLogout }) {
  return (
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
            {[
              { href: "/profile", label: "Profile" },
              { href: "/bookings", label: "Bookings" },
              { href: "/settings", label: "Settings" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={onLogout}
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
  );
}
