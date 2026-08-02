import PropTypes from 'prop-types';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export function BookingSummary({ movieTitle, showtimeLabel, seatLabels = [], total = 0 }) {
  return (
    <div className="glass rounded-lg border border-white/[0.08] p-md">
      <h3 className="mb-sm font-display text-title-lg">{movieTitle}</h3>
      <p className="text-body-sm text-on-surface-variant">{showtimeLabel}</p>
      <div className="my-sm h-px bg-white/[0.08]" />
      <p className="text-body-sm">
        Seats: <span className="text-on-surface">{seatLabels.join(', ') || '—'}</span>
      </p>
      <div className="mt-sm flex items-center justify-between text-title-lg">
        <span>Total</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

BookingSummary.propTypes = {
  movieTitle: PropTypes.string,
  showtimeLabel: PropTypes.string,
  seatLabels: PropTypes.arrayOf(PropTypes.string),
  total: PropTypes.number,
};
