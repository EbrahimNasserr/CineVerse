"use client";

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export function CancelModal({ bookingNumber, onConfirm, onDismiss, isLoading }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-md"
    >
      <div className="glass w-full max-w-sm rounded-xl p-lg flex flex-col gap-md">
        <h2 id="cancel-title" className="font-display text-title-xl">
          Cancel booking?
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          You are about to cancel{' '}
          <span className="font-medium text-on-surface">{bookingNumber}</span>.
          If you paid, a refund will be initiated per our refund policy.
        </p>
        <div className="flex gap-sm">
          <Button
            variant="primary"
            className="flex-1 bg-crimson/80"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? <Spinner size={16} /> : 'Yes, cancel'}
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onDismiss}>
            Keep it
          </Button>
        </div>
      </div>
    </div>
  );
}
