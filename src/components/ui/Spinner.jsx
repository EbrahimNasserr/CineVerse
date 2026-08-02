import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';

export function Spinner({ size = 24, className }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('animate-spin rounded-full border-2 border-white/[0.15] border-t-crimson', className)}
      style={{ width: size, height: size }}
    />
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};
