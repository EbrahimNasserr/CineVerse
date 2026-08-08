"use client";

import { CheckCircle } from 'lucide-react';

export function ConfirmationBanner({ bookingNumber }) {
  return (
    <div
      role="status"
      className="flex items-center gap-sm rounded-lg border border-teal/30 bg-teal/10 px-md py-sm text-teal"
    >
      <CheckCircle size={20} className="shrink-0" />
      <div>
        <p className="font-medium">Booking confirmed!</p>
        <p className="text-body-sm">
          Your booking <span className="font-bold">{bookingNumber}</span> is confirmed.
          A confirmation email has been sent to you.
        </p>
      </div>
    </div>
  );
}
