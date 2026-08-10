'use client';

import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS, TOOLTIP_PROPS, AXIS_PROPS } from './chartTheme';
import { ChartSkeleton, EmptyChart } from './ChartPlaceholders';

/**
 * Grouped bar chart showing the top N movies ranked by booking count,
 * with a secondary revenue bar for each.
 *
 * Expected data shape (from buildMovieSeries):
 *   [{ title: 'Inception', bookings: 5, revenue: 62.50 }, ...]
 */
export function TopMoviesChart({ data, isLoading }) {
  if (isLoading) return <ChartSkeleton />;
  if (!data.length) return <EmptyChart message="No booking data yet" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 4, bottom: 28, left: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          vertical={false}
        />

        <XAxis
          dataKey="title"
          {...AXIS_PROPS}
          tick={{ ...AXIS_PROPS.tick, fontSize: 10 }}
          interval={0}
          angle={-25}
          textAnchor="end"
          height={48}
        />
        <YAxis {...AXIS_PROPS} width={32} allowDecimals={false} />

        <Tooltip {...TOOLTIP_PROPS} />

        <Legend
          iconType="square"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: CHART_COLORS.muted }}
        />

        <Bar
          dataKey="bookings"
          name="Bookings"
          fill={CHART_COLORS.violet}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="revenue"
          name="Revenue ($)"
          fill={CHART_COLORS.emerald}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

TopMoviesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title:    PropTypes.string.isRequired,
      bookings: PropTypes.number.isRequired,
      revenue:  PropTypes.number.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
};
