"use client";

import { Bell } from "lucide-react";

export function NotificationBell() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="glass relative hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-primary-container/40 sm:flex"
    >
      <Bell size={16} className="text-on-surface-variant" />
      <span
        aria-hidden="true"
        className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-container"
      />
    </button>
  );
}
