import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';

/**
 * Cinematic Immersive primary/secondary button.
 * primary: bg-crimson-gradient + shadow-glow, bold uppercase label
 * secondary: ghost style, hairline border, transparent background
 */
export function Button({ variant = 'primary', className, children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded px-sm py-xs font-body font-bold uppercase tracking-wide text-body-sm transition-transform active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-crimson-gradient text-white shadow-glow',
    secondary:
      'border border-white/[0.08] bg-transparent text-on-surface hover:bg-white/[0.04]',
  };

  return (
    <button className={cn(base, variants[variant] || variants.primary, className)} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
  children: PropTypes.node,
};
