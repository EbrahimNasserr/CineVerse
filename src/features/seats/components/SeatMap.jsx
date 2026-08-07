'use client';

import PropTypes from 'prop-types';
import { Seat } from './Seat';
import { SeatLegend } from './SeatLegend';
import { useDispatch, useSelector } from '@/store/hooks';
import { toggleSeat } from '@/features/seats/seatsSlice';

/**
 * SeatMap
 *
 * Accepts the flat `seats` array from the real API response:
 *   GET /api/showtimes/:id/seats → { data: { seats: [...], rows: {}, summary: {} } }
 *
 * The parent page is responsible for unwrapping `data.seats` and passing the
 * flat array here.  Each seat object shape:
 *   { id, row, number, label, isVip, status: 'available'|'held'|'occupied' }
 *
 * Redux state stores selected seat IDs.  The Seat button's visible label is
 * `seat.number` (e.g. "1") because the row letter is already shown in the
 * row header — keeps each cell narrow enough to fit on small screens.
 */
export function SeatMap({ seats = [] }) {
  const dispatch        = useDispatch();
  const selectedSeatIds = useSelector((state) => state.seats.selectedSeatIds);

  // Group seats by row, preserving the order they arrive in from the API
  // (the API already returns them sorted by row then number).
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  if (!seats.length) {
    return (
      <p className="py-md text-center text-body-sm text-on-surface-variant">
        Seat map unavailable.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-md" role="group" aria-label="Seat map">
      {/* Screen bar */}
      <div className="flex w-full max-w-lg flex-col items-center gap-1" aria-hidden="true">
        <div className="h-1.5 w-4/5 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">Screen</span>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col gap-1 overflow-x-auto pb-1">
        {Object.entries(rows).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-1">
            {/* Row label */}
            <span className="w-5 shrink-0 text-center text-[11px] font-bold text-on-surface-variant">
              {row}
            </span>

            {rowSeats.map((seat) => {
              const isSelected = selectedSeatIds.includes(seat.id);

              // Map API status to visual status, giving priority to user selection.
              const visualStatus = isSelected
                ? 'selected'
                : seat.status === 'occupied'
                ? 'occupied'
                : seat.status === 'held'
                ? 'held'
                : 'available';

              return (
                <Seat
                  key={seat.id}
                  label={String(seat.number)}
                  isVip={seat.isVip}
                  status={visualStatus}
                  onClick={() => dispatch(toggleSeat(seat.id))}
                />
              );
            })}
          </div>
        ))}
      </div>

      <SeatLegend />
    </div>
  );
}

SeatMap.propTypes = {
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      id:     PropTypes.string.isRequired,
      row:    PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      label:  PropTypes.string.isRequired,
      status: PropTypes.oneOf(['available', 'held', 'occupied']),
      isVip:  PropTypes.bool,
    }),
  ),
};
