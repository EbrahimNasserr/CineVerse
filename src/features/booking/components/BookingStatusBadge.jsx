import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';

/** Maps bookingStatus + paymentStatus values → visual badge style. */
const STATUS_STYLES = {
  // bookingStatus
  confirmed:  'bg-teal/10 text-teal border-teal/30',
  completed:  'bg-teal/10 text-teal border-teal/30',
  pending:    'bg-gold/10 text-gold border-gold/30',
  cancelled:  'bg-white/5 text-on-surface-variant border-white/10 line-through',
  // paymentStatus
  paid:       'bg-teal/10 text-teal border-teal/30',
  failed:     'bg-crimson/10 text-crimson border-crimson/30',
  refunded:   'bg-white/5 text-on-surface-variant border-white/10',
};

const STATUS_LABELS = {
  confirmed: 'Confirmed',
  completed: 'Completed',
  pending:   'Pending',
  cancelled: 'Cancelled',
  paid:      'Paid',
  failed:    'Payment Failed',
  refunded:  'Refunded',
};

export function BookingStatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] ?? 'bg-white/5 text-on-surface-variant border-white/10';
  const label = STATUS_LABELS[status]  ?? status;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-xs py-[2px] text-[11px] font-medium uppercase tracking-wide',
        style,
        className
      )}
    >
      {label}
    </span>
  );
}

BookingStatusBadge.propTypes = {
  status:    PropTypes.string.isRequired,
  className: PropTypes.string,
};
