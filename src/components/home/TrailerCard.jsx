import Image from 'next/image';
import PropTypes from 'prop-types';
import { Play, Eye } from 'lucide-react';

export function TrailerCard({ trailer, variant = 'featured' }) {
  if (variant === 'compact') {
    return (
      <div
        data-cursor="play"
        className="group flex cursor-pointer gap-4 rounded-xl glass p-3 transition-colors hover:border-primary-container/30"
      >
        <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg sm:w-40">
          <Image src={trailer.thumbnailUrl} alt="" fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/50">
            <span className="btn-crimson flex h-9 w-9 items-center justify-center rounded-full">
              <Play size={12} className="ml-0.5 fill-white text-white" />
            </span>
          </div>
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <h4 className="truncate font-display text-lg font-bold leading-tight">{trailer.title}</h4>
          <p className="mt-1 text-xs text-on-surface-variant/70">{trailer.length}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-on-surface-variant/50">
            <Eye size={11} />
            {trailer.views}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-cursor="play"
      className="group relative aspect-video cursor-pointer overflow-hidden rounded-2xl border border-white/10"
    >
      <Image
        src={trailer.thumbnailUrl}
        alt=""
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

      <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
        <span className="rounded bg-primary-container px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Featured
        </span>
        <span className="glass rounded px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
          4K · HDR
        </span>
      </div>

      <button
        type="button"
        aria-label={`Play trailer for ${trailer.title}`}
        className="btn-crimson absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110 lg:h-24 lg:w-24"
      >
        <span className="pulse-ring" />
        <span className="pulse-ring" />
        <Play size={28} className="ml-1.5 fill-white text-white" />
      </button>

      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Official Trailer · {trailer.length}
        </p>
        <h3 className="mb-2 font-display text-2xl font-bold lg:text-4xl">{trailer.title}</h3>
        <p className="max-w-lg text-sm font-light text-on-surface-variant">{trailer.description}</p>
      </div>
    </div>
  );
}

TrailerCard.propTypes = {
  trailer: PropTypes.shape({
    title: PropTypes.string.isRequired,
    length: PropTypes.string,
    views: PropTypes.string,
    thumbnailUrl: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(['featured', 'compact']),
};
