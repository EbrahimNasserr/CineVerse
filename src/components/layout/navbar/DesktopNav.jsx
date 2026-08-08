"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { NAV_LINKS } from "./navLinks";

export function DesktopNav({ pathname }) {
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
