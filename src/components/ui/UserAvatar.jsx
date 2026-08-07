"use client";

import { cn } from "@/lib/utils/cn";

/**
 * UserAvatar
 * Renders a circular avatar with the user's initials derived from
 * firstName + lastName (or username as fallback).
 *
 * Sizes: "sm" (h-8 w-8), "md" (h-9 w-9, default), "lg" (h-11 w-11)
 */
export function UserAvatar({ user, size = "md", className }) {
  const initials = getInitials(user);

  const sizeClasses = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-11 w-11 text-sm",
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "border border-white/10 bg-gradient-to-br from-gold to-crimson-dark",
        "font-bold text-obsidian select-none",
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** Derive up to 2-letter initials from user object. */
export function getInitials(user) {
  if (!user) return "?";
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  if (user.firstName) return user.firstName[0].toUpperCase();
  if (user.username) return user.username.slice(0, 2).toUpperCase();
  if (user.email) return user.email[0].toUpperCase();
  return "?";
}
