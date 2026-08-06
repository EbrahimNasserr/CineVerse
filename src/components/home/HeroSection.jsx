'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Info } from 'lucide-react';
import { Reveal } from './Reveal';
import { FEATURED_MOVIE } from '@/lib/constants/mockMovies';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useGetMoviesQuery } from '@/features/movies/moviesApi';
import { Spinner } from '@/components/ui/Spinner';

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
  const bgRef = useRef(null);
  const sectionRef = useRef(null);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const { data: response, isLoading } = useGetMoviesQuery({ page: 1, limit: 100 });

  // Pick the movie with the highest imdbRating from the API, fall back to mock
  const movie = useMemo(() => {
    const apiMovies = response?.success && Array.isArray(response.data) ? response.data : [];
    if (!apiMovies.length) return FEATURED_MOVIE;

    return apiMovies.reduce((best, current) =>
      (current.imdbRating ?? 0) > (best.imdbRating ?? 0) ? current : best,
    );
  }, [response]);

  // Normalise fields — API and mock use different names
  const movieId      = movie._id   || movie.id;
  const posterUrl    = movie.poster    || movie.posterUrl    || '';
  const backdropUrl  = movie.backdrop  || movie.backdropUrl  || '';
  const rating       = movie.imdbRating ?? movie.rating;
  const synopsis     = movie.description || movie.synopsis || '';
  const runtime      = movie.duration ? `${movie.duration}m` : (movie.runtime || '');
  const releaseYear  = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : movie.year;
  const certification = movie.ageRating || movie.certification || '';

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

  const titleParts  = movie.title.split(':');
  const titleLead   = titleParts[0].trim();
  const titleAccent = titleParts.slice(1).join(':').trim();

  if (isLoading) {
    return (
      <section className="relative flex min-h-screen min-h-[680px] w-full items-center justify-center">
        <Spinner size={40} />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen min-h-[680px] w-full overflow-hidden"
    >
      <div ref={bgRef} className="absolute inset-0 kenburns">
        <Image src={backdropUrl || posterUrl} alt="" fill priority className="object-cover" />
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
              <span className="text-on-surface">{rating != null ? rating.toFixed(1) : '—'}</span>
              <span className="text-on-surface-variant/60">· IMDb</span>
            </span>
            {movie.genres?.length > 0 && (
              <span className="rounded border border-teal/30 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal">
                {movie.genres.join(' · ')}
              </span>
            )}
          </Reveal>

          <Reveal delay={120}>
            <h1 className="flicker mb-6 text-balance font-display text-6xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              {titleAccent ? (
                <>
                  {titleLead}:
                  <br />
                  <span className="text-gradient-crimson">{titleAccent}</span>
                </>
              ) : (
                movie.title
              )}
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mb-8 max-w-xl text-balance text-base font-light leading-relaxed text-on-surface-variant lg:text-lg">
              {synopsis}
            </p>
          </Reveal>

          <Reveal delay={360} className="flex flex-wrap items-center gap-4">
            <MagneticLink
              href={`/movies/${movieId}`}
              className="btn-crimson flex items-center gap-2.5 rounded-xl px-7 py-4 text-sm font-semibold normal-case tracking-normal text-white"
            >
              <Calendar size={16} />
              Book Now
              <span className="ml-1 text-xs font-normal text-white/70">· from $14.99</span>
            </MagneticLink>
            <MagneticLink
              href={`/movies/${movieId}`}
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
            {runtime    && <span>{runtime}</span>}
            {releaseYear && <span>{releaseYear}</span>}
            {certification && <span className="hidden sm:inline">{certification}</span>}
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
