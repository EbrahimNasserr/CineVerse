import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { ArrowLeft, Star } from 'lucide-react';

export function MovieHero({ movie }) {
  const titleParts = movie.title.includes(':')
    ? movie.title.split(':')
    : [movie.title];
  const titleLead = titleParts[0].trim();
  const titleAccent = titleParts.slice(1).join(':').trim();

  return (
    <section className="relative min-h-[520px] overflow-hidden lg:min-h-[560px]">
      <div className="absolute inset-0">
        <Image
          src={movie.backdropUrl || movie.posterUrl}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="hero-vignette" />
        <div className="grain" />
      </div>

      <div className="relative z-10 mx-auto max-w-content px-6 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
        <Link
          href="/movies"
          className="mb-8 inline-flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <ArrowLeft size={16} />
          Back to Explore
        </Link>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-10">
          <div className="relative mx-auto aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-glow-lg sm:w-48 lg:mx-0 lg:w-56">
            {movie.posterUrl ? (
              <Image
                src={movie.posterUrl}
                alt={`${movie.title} poster`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 160px, 224px"
              />
            ) : (
              <div className="h-full w-full bg-surface-container-high" />
            )}
          </div>

          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="glass inline-flex items-center gap-1.5 rounded-full py-1.5 pl-2 pr-3 text-xs font-semibold">
                <span className="flex items-center gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={11} className="fill-gold text-gold" />
                  ))}
                </span>
                <span className="text-on-surface">
                  {movie.rating != null ? movie.rating.toFixed(1) : '—'}
                </span>
                <span className="text-on-surface-variant/60">· IMDb</span>
              </span>
              {movie.genres?.map((genre) => (
                <span
                  key={genre}
                  className="rounded border border-teal/30 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal"
                >
                  {genre}
                </span>
              ))}
            </div>

            <h1 className="mb-4 text-balance font-display text-4xl font-black leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
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

            <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant/80">
              {movie.director && <span>Directed by {movie.director}</span>}
              {movie.runtime && <span>{movie.runtime}</span>}
              {movie.year && <span>{movie.year}</span>}
              {movie.certification && <span>{movie.certification}</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

MovieHero.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    posterUrl: PropTypes.string,
    backdropUrl: PropTypes.string,
    rating: PropTypes.number,
    genres: PropTypes.arrayOf(PropTypes.string),
    runtime: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    certification: PropTypes.string,
    director: PropTypes.string,
  }).isRequired,
};
