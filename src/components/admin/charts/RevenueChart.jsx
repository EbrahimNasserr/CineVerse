'use client';

import PropTypes from 'prop-types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS, TOOLTIP_PROPS, AXIS_PROPS } from './chartTheme';
import { ChartSkeleton } from './ChartPlaceholders';

/**
 * Dual area chart showing daily revenue ($) and booking count
 * over the last 7 days.
 *
 * Expected data shape (from buildRevenueSeries):
 *   [{ day: "Mon 7", revenue: 120.00, bookings: 4 }, ...]
 */
export function RevenueChart({ data, isLoading }) {
  if (isLoading) return <ChartSkeleton />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={CHART_COLORS.crimson} stopOpacity={0.35} />
            <stop offset="95%" stopColor={CHART_COLORS.crimson} stopOpacity={0}    />
          </linearGradient>
          <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={CHART_COLORS.sky} stopOpacity={0.35} />
            <stop offset="95%" stopColor={CHART_COLORS.sky} stopOpacity={0}    />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          vertical={false}
        />

        <XAxis dataKey="day" {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} width={40} />

        <Tooltip {...TOOLTIP_PROPS} />

        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: CHART_COLORS.muted }}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue ($)"
          stroke={CHART_COLORS.crimson}
          strokeWidth={2}
          fill="url(#gradRevenue)"
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="bookings"
          name="Bookings"
          stroke={CHART_COLORS.sky}
          strokeWidth={2}
          fill="url(#gradBookings)"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

RevenueChart.propTypes = {
  data:      PropTypes.arrayOf(
    PropTypes.shape({
      day:      PropTypes.string.isRequired,
      revenue:  PropTypes.number.isRequired,
      bookings: PropTypes.number.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
};
