/** Converts a Date or ISO string to a local YYYY-MM-DD key. */
export function toDateKey(dateVal) {
  const d = new Date(dateVal);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Short weekday + day label for the date strip. */
export function dateLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today    = toDateKey(new Date());
  const tomorrow = toDateKey(new Date(Date.now() + 86_400_000));

  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const day     = d;
  const month   = date.toLocaleDateString('en-US', { month: 'short' });

  if (dateKey === today)    return { top: 'Today',    bottom: `${month} ${day}` };
  if (dateKey === tomorrow) return { top: 'Tomorrow', bottom: `${month} ${day}` };
  return { top: weekday, bottom: `${month} ${day}` };
}

export const FORMAT_BADGE = {
  IMAX: 'border-gold/40 bg-gold/10 text-gold',
  '4DX': 'border-teal/40 bg-teal/10 text-teal',
  '3D':  'border-primary/30 bg-primary/10 text-primary',
  '2D':  'border-white/10 bg-white/5 text-on-surface-variant',
};
