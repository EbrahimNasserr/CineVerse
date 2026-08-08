"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { UserMenu } from "@/components/layout/UserMenu";

export function AuthControl({ user }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stable placeholder while hydrating — matches what the server renders.
  if (!mounted) {
    return (
      <div
        className="hidden h-9 w-20 rounded-full sm:block"
        aria-hidden="true"
      />
    );
  }

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
