"use client";

import { formatCurrency } from '@/lib/utils/formatCurrency';

export function PricingBreakdown({ booking }) {
  const ticketPrice = booking.ticketPrice ?? 0;
  const serviceFee  = booking.serviceFee  ?? 0;
  const total       = booking.totalAmount ?? booking.total ?? 0;
  const seatCount   = booking.seatCount   ?? 1;
  const currency    = booking.currency    ?? 'USD';

  return (
    <div className="glass rounded-lg p-md flex flex-col gap-xs text-body-sm">
      <h3 className="mb-xs font-display text-title-lg">Price Breakdown</h3>

      <div className="flex justify-between text-on-surface-variant">
        <span>{seatCount} × seat ({formatCurrency(ticketPrice)})</span>
        <span>{formatCurrency(seatCount * ticketPrice)}</span>
      </div>

      <div className="flex justify-between text-on-surface-variant">
        <span>Service fee</span>
        <span>{formatCurrency(serviceFee)}</span>
      </div>

      <div className="h-px bg-white/[0.08]" />

      <div className="flex justify-between font-medium text-on-surface">
        <span>Total ({currency})</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
