import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';

export const Input = forwardRef(function Input({ label, error, className, id, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-label-caps text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={cn(
          'rounded border border-white/[0.08] bg-surface-container px-sm py-xs text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-crimson',
          error && 'border-error',
          className
        )}
        {...props}
      />
      {error && <span className="text-body-sm text-error">{error}</span>}
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
};
