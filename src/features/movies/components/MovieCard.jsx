'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import PropTypes from 'prop-types';
import { Reveal } from '@/components/home/Reveal';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function MovieCard({ movie, index = 0 }) {
  const cardRef = useRef(null);
  const isHover = useMediaQuery('(hover: hover)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Handle both API and mock data structures
  const movieId = movie._id || movie.id;
  const posterUrl = movie.poster || movie.posterUrl;
  const movieRating = movie.imdbRating ?? movie.rating;
  const runtime = movie.duration ? `${movie.duration}m` : movie.runtime;
  
  const hasPoster = Boolean(posterUrl);
  const rating = movieRating != null ? movieRating.toFixed(1) : '—';

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !isHover || reduceMotion) return undefined;

    let raf = null;
    let tx = 0;
    let ty = 0;
    let ctx = 0;
    let cty = 0;

    const loop = () => {
      ctx += (tx - ctx) * 0.12;
      cty += (ty - cty) * 0.12;
      card.style.transform = `perspective(800px) rotateX(${ctx}deg) rotateY(${cty}deg) scale(${tx || ty ? 1.04 : 1})`;
      if (Math.abs(tx - ctx) > 0.05 || Math.abs(ty - cty) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };

    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      tx = py * -10;
      ty = px * 12;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHover, reduceMotion]);

  return (
    <Reveal delay={index * 70}>
      <Link
        ref={cardRef}
        href={`/movies/${movieId}`}
        data-cursor="view"
        className="poster-card group relative block aspect-[2/3] overflow-hidden rounded-xl border border-white/[0.08]"
      >
        {hasPoster ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 50vw, 16vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-surface-container-high" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 z-10">
          <span className="glass flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold text-gold">
            <Star size={9} className="fill-gold text-gold" />
            {rating}
          </span>
        </div>

        <div className="poster-meta absolute inset-x-0 bottom-0 z-10 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {movie.genres?.length > 0 && (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
              {movie.genres.join(' · ')}
            </p>
          )}
          <h3 className="mb-1 font-display text-lg font-bold leading-tight">{movie.title}</h3>
          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant/60">
            {runtime && <span>{runtime}</span>}
            {runtime && <span className="h-1 w-1 rounded-full bg-on-surface-variant/40" />}
            <span className="text-teal">Book</span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    // API structure uses _id, mock uses id
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    // API structure uses poster, mock uses posterUrl
    poster: PropTypes.string,
    posterUrl: PropTypes.string,
    // API structure uses imdbRating, mock uses rating
    imdbRating: PropTypes.number,
    rating: PropTypes.number,
    // API structure uses duration (minutes), mock uses runtime (formatted string)
    duration: PropTypes.number,
    runtime: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  index: PropTypes.number,
};
