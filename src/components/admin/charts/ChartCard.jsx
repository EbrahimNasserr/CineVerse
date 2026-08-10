import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';

/**
 * Consistent section wrapper for every chart on the admin dashboard.
 * Renders a title, optional subtitle, and the chart as children.
 */
export function ChartCard({ title, subtitle, children, className }) {
  return (
    <section
      className={cn(
        'flex flex-col gap-sm rounded-lg border border-white/[0.08] bg-surface-container p-md',
        className
      )}
    >
      <div>
        <h2 className="text-title-lg">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-body-sm text-on-surface-variant">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

ChartCard.propTypes = {
  title:     PropTypes.string.isRequired,
  subtitle:  PropTypes.string,
  children:  PropTypes.node.isRequired,
  className: PropTypes.string,
};
