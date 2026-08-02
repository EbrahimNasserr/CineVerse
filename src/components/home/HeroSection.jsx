'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Info } from 'lucide-react';
import { Reveal } from './Reveal';
import { FEATURED_MOVIE } from '@/lib/constants/mockMovies';
import { useMediaQuery } from '@/hooks/useMediaQuery';

function MagneticLink({ href, className, children }) {
  const ref = useRef(null);
  const isHover = useMediaQuery('(hover: hover)');

  useEffect(() => {
    const btn = ref.current;
    if (!btn || !isHover) return undefined;

    const onMove = (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    };
    const onLeave = () => {
      btn.style.transform = 'translate(0, 0)';
    };

    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, [isHover]);

  return (
    <Link ref={ref} href={href} className={`magnetic ${className}`}>
      {children}
    </Link>
  );
}

/**
 * HeroSection — full-bleed cinematic hero matching the CineVerse landing sketch.
 */
export function HeroSection() {
  const movie = FEATURED_MOVIE;
  const bgRef = useRef(null);
  const sectionRef = useRef(null);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (reduceMotion) return undefined;

    const onScroll = () => {
      const y = window.scrollY;
      const heroHeight = sectionRef.current?.offsetHeight ?? 0;
      if (y < heroHeight && bgRef.current) {
        bgRef.current.style.transform = `translateY(${y * 0.35}px) scale(${1 + y * 0.0003})`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduceMotion]);

  const titleParts = movie.title.split(':');
  const titleLead = titleParts[0];
  const titleAccent = titleParts.slice(1).join(':').trim();

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen min-h-[680px] w-full overflow-hidden"
    >
      <div ref={bgRef} className="absolute inset-0 kenburns">
        <Image src={movie.backdropUrl} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-obsidian/40" />
        <div className="hero-vignette" />
        <div className="grain" />
      </div>

      <div className="relative z-10 mx-auto flex h-full min-h-screen min-h-[680px] max-w-content items-center px-6 lg:px-10">
        <div className="max-w-2xl">
          <Reveal className="mb-6 flex flex-wrap items-center gap-3" delay={0}>
            <span className="glass inline-flex items-center gap-1.5 rounded-full py-1.5 pl-2 pr-3 text-xs font-semibold">
              <span className="flex items-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} className="fill-gold text-gold" />
                ))}
              </span>
              <span className="text-on-surface">{movie.rating.toFixed(1)}</span>
              <span className="text-on-surface-variant/60">· IMDb</span>
            </span>
            <span className="rounded border border-teal/30 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal">
              {movie.genres.join(' · ')}
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="flicker mb-6 text-balance font-display text-6xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              {titleLead}:
              <br />
              <span className="text-gradient-crimson">{titleAccent}</span>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mb-8 max-w-xl text-balance text-base font-light leading-relaxed text-on-surface-variant lg:text-lg">
              {movie.synopsis}
            </p>
          </Reveal>

          <Reveal delay={360} className="flex flex-wrap items-center gap-4">
            <MagneticLink
              href={`/movies/${movie.id}`}
              className="btn-crimson flex items-center gap-2.5 rounded-xl px-7 py-4 text-sm font-semibold normal-case tracking-normal text-white"
            >
              <Calendar size={16} />
              Book Now
              <span className="ml-1 text-xs font-normal text-white/70">· from $14.99</span>
            </MagneticLink>
            <MagneticLink
              href={`/movies/${movie.id}`}
              className="btn-ghost flex items-center gap-2.5 rounded-xl px-7 py-4 text-sm font-semibold normal-case tracking-normal text-on-surface"
            >
              <Info size={16} />
              More Info
            </MagneticLink>
          </Reveal>

          <Reveal
            delay={480}
            className="mt-10 flex flex-wrap items-center gap-6 text-xs text-on-surface-variant/70"
          >
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary-container" />
              In theaters now
            </span>
            <span>{movie.runtime}</span>
            <span>{movie.year}</span>
            {movie.certification && <span className="hidden sm:inline">{movie.certification}</span>}
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-on-surface-variant/50 sm:flex">
        <span>Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-on-surface-variant/50 to-transparent" />
      </div>
    </section>
  );
}
