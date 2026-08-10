'use client';

import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { STATUS_COLORS, CHART_COLORS } from './chartTheme';
import { ChartSkeleton, EmptyChart } from './ChartPlaceholders';

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function StatusTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const { name, value } = payload[0];
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#13161e] px-3 py-2 text-xs">
      <p className="capitalize text-on-surface-variant">{name}</p>
      <p className="font-semibold text-on-surface">{value} bookings</p>
    </div>
  );
}

/**
 * Donut chart showing the breakdown of booking statuses:
 * confirmed (emerald) · pending (amber) · cancelled (rose).
 *
 * Expected data shape (from buildStatusSeries):
 *   [{ name: 'confirmed', value: 12 }, ...]
 */
export function StatusPieChart({ data, isLoading }) {
  if (isLoading) return <ChartSkeleton />;
  if (!data.length) return <EmptyChart message="No booking data yet" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={STATUS_COLORS[entry.name] ?? CHART_COLORS.muted}
              stroke="transparent"
            />
          ))}
        </Pie>

        <Tooltip content={<StatusTooltip />} />

        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          wrapperStyle={{ fontSize: 12, color: CHART_COLORS.muted }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

StatusPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name:  PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
};
