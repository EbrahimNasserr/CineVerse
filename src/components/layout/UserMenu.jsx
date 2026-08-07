"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Ticket,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";
import { logout } from "@/features/auth/authSlice";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Menu item definitions
// ---------------------------------------------------------------------------
const MENU_ITEMS = [
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    description: "View and edit your account",
  },
  {
    label: "My Bookings",
    href: "/bookings",
    icon: Ticket,
    description: "See your ticket history",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Preferences & notifications",
  },
];

const ADMIN_ITEM = {
  label: "Admin Panel",
  href: "/admin/movies",
  icon: Shield,
  description: "Manage movies & showtimes",
};

// ---------------------------------------------------------------------------
// UserMenu
// ---------------------------------------------------------------------------
export function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((s) => s.auth.user);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    dispatch(logout());
    router.push("/");
  };

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : (user?.username ?? "My Account");

  const isAdmin = user?.role === "ADMIN" || user?.role === "admin";

  const allItems = isAdmin ? [ADMIN_ITEM, ...MENU_ITEMS] : MENU_ITEMS;

  return (
    <div ref={menuRef} className="relative hidden sm:block">
      {/* ---- Trigger button ---- */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open account menu"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "group flex h-9 items-center gap-2 rounded-full border pl-0.5 pr-2.5",
          "border-white/10 transition-all duration-300",
          "hover:border-white/20 hover:bg-white/5",
          open && "border-white/20 bg-white/5",
        )}
      >
        <UserAvatar user={user} size="md" />
        <ChevronDown
          size={13}
          className={cn(
            "text-on-surface-variant transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      {/* ---- Dropdown panel ---- */}
      <div
        role="menu"
        aria-label="Account menu"
        className={cn(
          // position & size
          "absolute right-0 top-[calc(100%+10px)] w-64 origin-top-right",
          // glass card
          "glass rounded-2xl border border-white/10 shadow-2xl shadow-obsidian/60",
          // enter / exit animation
          "transition-all duration-200 ease-out",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {/* User identity header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <UserAvatar user={user} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-on-surface">
              {displayName}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {user?.email ?? ""}
            </p>
            {isAdmin && (
              <span className="mt-1 inline-block rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Menu items */}
        <nav className="p-2">
          {allItems.map(({ label, href, icon: Icon, description }) => (
            <Link
              key={label}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                "transition-colors duration-150 hover:bg-white/5",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  "bg-white/5 transition-colors duration-150 group-hover:bg-primary-container/20",
                )}
              >
                <Icon
                  size={15}
                  className="text-on-surface-variant transition-colors duration-150 group-hover:text-primary-container"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-on-surface">{label}</p>
                <p className="truncate text-xs text-on-surface-variant">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-2">
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
              "transition-colors duration-150 hover:bg-crimson-dark/15",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                "bg-white/5 transition-colors duration-150 group-hover:bg-crimson-dark/20",
              )}
            >
              <LogOut
                size={15}
                className="text-on-surface-variant transition-colors duration-150 group-hover:text-crimson-dark"
              />
            </span>
            <p className="text-sm font-medium text-on-surface transition-colors duration-150 group-hover:text-crimson-dark">
              Sign Out
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
