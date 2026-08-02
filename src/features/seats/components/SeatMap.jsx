'use client';

import PropTypes from 'prop-types';
import { Seat } from './Seat';
import { SeatLegend } from './SeatLegend';
import { useDispatch, useSelector } from '@/store/hooks';
import { toggleSeat } from '@/features/seats/seatsSlice';

export function SeatMap({ seats = [] }) {
  const dispatch = useDispatch();
  const selectedSeatIds = useSelector((state) => state.seats.selectedSeatIds);

  const rows = seats.reduce((acc, seat) => {
    acc[seat.row] = acc[seat.row] || [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center gap-md">
      <div className="mb-sm h-2 w-3/4 rounded-full bg-white/10" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        {Object.entries(rows).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-1">
            <span className="w-4 text-body-sm text-on-surface-variant">{row}</span>
            {rowSeats.map((seat) => (
              <Seat
                key={seat.id}
                label={String(seat.number)}
                isVip={seat.isVip}
                status={
                  selectedSeatIds.includes(seat.id)
                    ? 'selected'
                    : seat.status === 'occupied'
                    ? 'occupied'
                    : 'available'
                }
                onClick={() => dispatch(toggleSeat(seat.id))}
              />
            ))}
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
      id: PropTypes.string.isRequired,
      row: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      status: PropTypes.string,
      isVip: PropTypes.bool,
    })
  ),
};
