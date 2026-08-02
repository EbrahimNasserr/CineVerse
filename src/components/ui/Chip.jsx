import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';

/**
 * GenreChip: active = crimson gradient + glow, inactive = hairline ghost.
 */
export function Chip({ active = false, className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'rounded px-sm py-[6px] text-body-sm font-body transition-colors',
        active
          ? 'bg-crimson-gradient text-white shadow-glow'
          : 'border border-white/[0.08] bg-transparent text-on-surface-variant hover:border-white/[0.16]',
        className
      )}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  );
}

Chip.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
