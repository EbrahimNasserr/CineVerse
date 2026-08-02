'use client';

import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Modal({ open, onClose, title, children, className }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-sm">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'glass relative w-full max-w-lg rounded-lg border border-white/[0.08] p-md',
          className
        )}
      >
        <div className="mb-sm flex items-center justify-between">
          {title ? <h2 className="text-title-lg">{title}</h2> : <span />}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-on-surface-variant hover:bg-white/[0.06]"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};
