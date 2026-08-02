import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';

/**
 * Seat: available = transparent + teal border, selected = solid crimson,
 * occupied = low-opacity grey no border, vip = gold border.
 */
export function Seat({ status = 'available', isVip = false, onClick, label }) {
  const isOccupied = status === 'occupied';
  const isSelected = status === 'selected';

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={onClick}
      aria-label={label}
      className={cn(
        'h-7 w-7 rounded-sm text-[10px] transition-colors',
        isOccupied && 'cursor-not-allowed border-0 bg-white/10 text-white/20',
        !isOccupied && !isSelected && !isVip && 'border border-teal bg-transparent text-on-surface',
        !isOccupied && !isSelected && isVip && 'border border-gold bg-transparent text-on-surface',
        isSelected && 'border-0 bg-crimson text-white'
      )}
    >
      {label}
    </button>
  );
}

Seat.propTypes = {
  status: PropTypes.oneOf(['available', 'selected', 'occupied']),
  isVip: PropTypes.bool,
  onClick: PropTypes.func,
  label: PropTypes.string,
};
