import Link from 'next/link';
import PropTypes from 'prop-types';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

const ACCENT_CLASSES = {
  crimson: {
    dot: 'bg-crimson',
    text: 'text-primary',
    ring: 'group-hover:border-crimson group-hover:bg-crimson/10',
  },
  gold: {
    dot: 'bg-gold',
    text: 'text-gold',
    ring: 'group-hover:border-gold group-hover:bg-gold/10',
  },
  teal: {
    dot: 'bg-teal',
    text: 'text-teal',
    ring: 'group-hover:border-teal group-hover:bg-teal/10',
  },
};

export function SectionHeading({
  eyebrow,
  title,
  accent = 'crimson',
  viewAllHref,
  viewAllLabel = 'View All',
  sectionNum,
}) {
  const colors = ACCENT_CLASSES[accent] || ACCENT_CLASSES.crimson;

  return (
    <Reveal
      as="div"
      className="relative mb-14 flex flex-wrap items-end justify-between gap-6"
    >
      {sectionNum && (
        <span
          aria-hidden="true"
          className="section-num hidden lg:block"
          style={{
            color:
              accent === 'gold'
                ? 'rgba(233,195,73,0.03)'
                : accent === 'teal'
                  ? 'rgba(111,216,200,0.03)'
                  : 'rgba(255,255,255,0.025)',
          }}
        >
          {sectionNum}
        </span>
      )}
      <div>
        <div
          className={`mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] ${colors.text}`}
        >
          <span className={`h-px w-8 ${colors.dot}`} />
          {eyebrow}
        </div>
        <h2 className="font-display text-4xl font-black tracking-tight lg:text-6xl">{title}</h2>
        <div className="underline-accent mt-4" />
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
        >
          {viewAllLabel}
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.15] transition-all ${colors.ring}`}
          >
            <ArrowRight size={12} strokeWidth={2.5} />
          </span>
        </Link>
      )}
    </Reveal>
  );
}

SectionHeading.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  accent: PropTypes.oneOf(['crimson', 'gold', 'teal']),
  viewAllHref: PropTypes.string,
  viewAllLabel: PropTypes.string,
  sectionNum: PropTypes.string,
};
