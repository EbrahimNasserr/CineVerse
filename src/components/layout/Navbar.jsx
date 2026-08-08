"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DesktopNav } from "./navbar/DesktopNav";
import { SearchBar } from "./navbar/SearchBar";
import { NotificationBell } from "./navbar/NotificationBell";
import { AuthControl } from "./navbar/AuthControl";
import { MobileSidebar } from "./navbar/MobileSidebar";

export function Navbar() {
  const navRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);
  const [padding, setPadding] = useState(28);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const user = useSelector((s) => s.auth.user);

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
  }, []);

  // Shrink nav on scroll
  useEffect(() => {
    const update = () => {
      const progress = Math.min(1, window.scrollY / 100);
      setPadding(28 - progress * 16);
      setScrolled(window.scrollY > 20);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll + Escape key while sidebar is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
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
            className="mx-auto flex max-w-content items-center justify-between px-4 sm:px-6 lg:px-10"
            style={{ paddingTop: padding, paddingBottom: padding }}
          >
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

            <DesktopNav pathname={pathname} />

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <SearchBar />
              <NotificationBell />
              <AuthControl user={user} />

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
        pathname={pathname}
        user={user}
      />
    </>
  );
}
