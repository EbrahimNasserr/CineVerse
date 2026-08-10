import { Spinner } from '@/components/ui/Spinner';

/**
 * Shown inside a ChartCard while data is loading.
 * Keeps the card at a fixed height so the layout doesn't jump.
 */
export function ChartSkeleton() {
  return (
    <div className="flex h-[220px] items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}

/**
 * Shown inside a ChartCard when the API returns no usable data.
 *
 * @param {string} message - Short human-readable explanation
 */
export function EmptyChart({ message = 'No data yet' }) {
  return (
    <div className="flex h-[220px] items-center justify-center">
      <p className="text-body-sm text-on-surface-variant">{message}</p>
    </div>
  );
}
