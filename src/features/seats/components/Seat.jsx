import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';

/**
 * Visual states:
 *   available  — teal border, transparent fill
 *   available (VIP) — gold border, transparent fill
 *   held       — amber/gold fill, semi-transparent (someone else is holding it)
 *   selected   — crimson fill (current user's selection)
 *   occupied   — low-opacity grey, no border, non-interactive
 */
export function Seat({ status = 'available', isVip = false, onClick, label }) {
  const isOccupied = status === 'occupied';
  const isSelected = status === 'selected';
  const isHeld     = status === 'held';

  return (
    <button
      type="button"
      disabled={isOccupied || isHeld}
      onClick={onClick}
      aria-label={`Seat ${label}${isHeld ? ' (held)' : isOccupied ? ' (occupied)' : ''}`}
      aria-pressed={isSelected}
      className={cn(
        'h-7 w-7 rounded-sm text-[10px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson',
        // occupied
        isOccupied && 'cursor-not-allowed border-0 bg-white/10 text-white/20',
        // held by someone else
        isHeld && 'cursor-not-allowed border border-gold/30 bg-gold/20 text-gold/60',
        // selected by current user
        isSelected && 'border-0 bg-crimson text-white shadow-glow',
        // available standard
        !isOccupied && !isHeld && !isSelected && !isVip &&
          'border border-teal bg-transparent text-on-surface hover:bg-teal/10',
        // available VIP
        !isOccupied && !isHeld && !isSelected && isVip &&
          'border border-gold bg-transparent text-on-surface hover:bg-gold/10',
      )}
    >
      {label}
    </button>
  );
}

Seat.propTypes = {
  status:  PropTypes.oneOf(['available', 'selected', 'occupied', 'held']),
  isVip:   PropTypes.bool,
  onClick: PropTypes.func,
  label:   PropTypes.string.isRequired,
};
