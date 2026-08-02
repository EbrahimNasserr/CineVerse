import Link from 'next/link';
import { Reveal } from '@/components/home/Reveal';

const NAV_ITEMS = ['Explore', 'Genres', 'Theaters', 'Trailers', 'Watchlist'];
const COMPANY_ITEMS = ['About Us', 'Careers', 'Press', 'Partnerships', 'Contact'];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-surface-container-lowest px-6 pb-8 pt-20 lg:px-10">
      <div className="mx-auto max-w-content">
        <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 block font-display text-3xl font-black tracking-tight">
              <span className="text-primary-container">Cine</span>
              <span className="text-on-surface">Verse</span>
            </Link>
            <p className="mb-6 max-w-xs text-sm font-light leading-relaxed text-on-surface-variant/60">
              The cinematic home for film lovers. Book seats, watch trailers, and follow the stories
              that move you — all in one immersive place.
            </p>
            <div className="flex items-center gap-3">
              {['Twitter', 'Instagram', 'YouTube', 'Letterboxd'].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="glass flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-primary-container/40 hover:text-primary"
                >
                  <span className="sr-only">{label}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-on-surface-variant" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant/50">
              Navigation
            </h5>
            <ul className="space-y-3 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <Link href="/movies" className="text-on-surface-variant transition-colors hover:text-on-surface">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant/50">
              Company
            </h5>
            <ul className="space-y-3 text-sm">
              {COMPANY_ITEMS.map((item) => (
                <li key={item}>
                  <Link href="#" className="text-on-surface-variant transition-colors hover:text-on-surface">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant/50">
              Get the App
            </h5>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="glass group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:border-primary-container/40"
              >
                <span className="text-xl" aria-hidden="true">
                  
                </span>
                <div className="leading-tight">
                  <div className="text-[10px] text-on-surface-variant/60">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="glass group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:border-primary-container/40"
              >
                <span className="text-xl" aria-hidden="true">
                  ▶
                </span>
                <div className="leading-tight">
                  <div className="text-[10px] text-on-surface-variant/60">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <Reveal className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 sm:flex-row">
          <p className="text-xs font-light text-on-surface-variant/50">
            © {new Date().getFullYear()} CineVerse Studios. All rights reserved. Crafted for cinephiles.
          </p>
          <div className="flex items-center gap-6 text-xs text-on-surface-variant/50">
            <Link href="#" className="transition-colors hover:text-on-surface">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-on-surface">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-on-surface">
              Cookies
            </Link>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
