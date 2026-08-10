/**
 * Shared design tokens for all admin Recharts components.
 * Mirrors the obsidian/crimson theme from globals.css.
 */

export const CHART_COLORS = {
  crimson: '#e63946',
  sky:     '#38bdf8',
  emerald: '#34d399',
  amber:   '#fbbf24',
  violet:  '#a78bfa',
  rose:    '#fb7185',
  grid:    'rgba(255,255,255,0.06)',
  muted:   'rgba(255,255,255,0.45)',
};

export const STATUS_COLORS = {
  confirmed: CHART_COLORS.emerald,
  pending:   CHART_COLORS.amber,
  cancelled: CHART_COLORS.rose,
};

/** Drop-in props for every <Tooltip /> in Recharts. */
export const TOOLTIP_PROPS = {
  contentStyle: {
    background:   '#13161e',
    border:       '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    fontSize:     '12px',
    color:        '#fff',
  },
  itemStyle:  { color: '#fff' },
  labelStyle: { color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  cursor:     { fill: 'rgba(255,255,255,0.04)' },
};

/** Shared axis / tick props. */
export const AXIS_PROPS = {
  tick:      { fill: CHART_COLORS.muted, fontSize: 11 },
  axisLine:  false,
  tickLine:  false,
};
