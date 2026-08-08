"use client";

export function SynopsisSection({ movie }) {
  const runtime = movie.duration ? `${movie.duration}m` : movie.runtime;
  const year    = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : movie.year;

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-surface-container/70 p-md md:p-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Synopsis</p>
          <h2 className="mt-1 text-headline-sm">{movie.title}</h2>
        </div>
      </div>

      <p className="mt-md max-w-2xl text-body-md text-on-surface-variant">
        {movie.description || movie.synopsis}
      </p>

      <div className="mt-md grid gap-3 sm:grid-cols-3">
        <MetaTile label="Runtime" value={runtime || '—'} />
        <MetaTile label="Year"    value={year    || '—'} />
        <MetaTile label="Genres"  value={movie.genres?.join(' · ') || '—'} />
      </div>
    </section>
  );
}

function MetaTile({ label, value }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-sm">
      <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{label}</p>
      <p className="mt-1 font-display text-title-lg">{value}</p>
    </div>
  );
}
