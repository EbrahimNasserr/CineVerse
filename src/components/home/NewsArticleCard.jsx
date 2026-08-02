import Image from 'next/image';
import PropTypes from 'prop-types';

export function NewsArticleCard({ article, variant = 'secondary' }) {
  if (variant === 'feature') {
    return (
      <article
        data-cursor="view"
        className="group relative min-h-[460px] cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08]"
      >
        <Image
          src={article.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/10" />
        <div className="relative flex h-full min-h-[460px] flex-col justify-end p-8 lg:p-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded border border-gold/30 bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
              {article.tag}
            </span>
            <span className="text-xs text-on-surface-variant/60">{article.meta}</span>
          </div>
          <h3 className="mb-4 text-balance font-display text-3xl font-bold leading-[1.05] lg:text-5xl">
            {article.title}
          </h3>
          <p className="mb-5 max-w-xl font-light leading-relaxed text-on-surface-variant">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal to-crimson-dark" />
            <div>
              <p className="text-sm font-semibold">{article.author}</p>
              <p className="text-xs text-on-surface-variant/50">{article.authorRole}</p>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      data-cursor="view"
      className="group flex cursor-pointer gap-4 rounded-2xl glass p-4 transition-colors hover:border-teal/30"
    >
      <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg sm:w-32">
        <Image
          src={article.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
          {article.tag}
        </p>
        <h4 className="mb-1.5 font-display text-lg font-bold leading-tight">{article.title}</h4>
        <p className="line-clamp-2 text-xs text-on-surface-variant/60">{article.excerpt}</p>
      </div>
    </article>
  );
}

NewsArticleCard.propTypes = {
  article: PropTypes.shape({
    tag: PropTypes.string,
    meta: PropTypes.string,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    imageUrl: PropTypes.string.isRequired,
    author: PropTypes.string,
    authorRole: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(['feature', 'secondary']),
};
