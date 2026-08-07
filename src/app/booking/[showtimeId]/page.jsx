'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from '@/store/hooks';

import { useGetShowtimeByIdQuery } from '@/features/showtimes/showtimesApi';
import { useGetSeatMapQuery } from '@/features/seats/seatsApi';
import { useInitializeBookingMutation } from '@/features/booking/bookingApi';
import { setMaxSeats, clearSelectedSeats } from '@/features/seats/seatsSlice';
import {
  setPendingBooking,
  setBookingError,
  setCheckoutStep,
} from '@/features/booking/bookingSlice';

import { SeatMap } from '@/features/seats/components/SeatMap';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/formatCurrency';

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Service fee applied on top of the ticket price.
 * The server calculates this as subtotal × 5 %; we mirror that here for the
 * live preview.  The server value is authoritative — this is display-only.
 */
const SERVICE_FEE_RATE = 0.05;

// ─── Slot metadata bar ────────────────────────────────────────────────────────

function SlotMetaBar({ slot }) {
  const dateLabel = new Date(slot.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
    year:    'numeric',
  });

  return (
    <div className="glass flex flex-wrap items-center gap-x-md gap-y-xs rounded-lg px-md py-sm text-body-sm text-on-surface-variant">
      <span className="font-medium text-on-surface">{slot.theater}</span>
      {slot.screen && <span>· {slot.screen}</span>}
      <span>· {dateLabel}</span>
      <span>· {slot.startTime}–{slot.endTime}</span>
      {slot.language && slot.language !== 'English' && <span>· {slot.language}</span>}
      <span className="ml-auto font-medium text-on-surface">
        {slot.format}&nbsp;·&nbsp;{formatCurrency(slot.price)} / seat
      </span>
    </div>
  );
}

// ─── Seat counter ─────────────────────────────────────────────────────────────

function SeatCounter({ selected, max }) {
  return (
    <p className="text-body-sm text-on-surface-variant">
      {selected}&thinsp;/&thinsp;{max} seat{max !== 1 ? 's' : ''} selected
      {selected > 0 && selected === max && (
        <span className="ml-2 font-medium text-gold">Max reached</span>
      )}
    </p>
  );
}

// ─── Order summary sidebar ────────────────────────────────────────────────────

function OrderSummary({ selectedLabels, pricePerSeat }) {
  const seatCount  = selectedLabels.length;
  const subtotal   = seatCount * pricePerSeat;
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const total      = subtotal + serviceFee;

  return (
    <div className="glass flex flex-col gap-sm rounded-lg p-md">
      <h3 className="font-display text-title-lg">Order Summary</h3>
      <div className="h-px bg-white/[0.08]" />

      <div className="flex flex-col gap-xs text-body-sm">
        {selectedLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedLabels.map((lbl) => (
              <span
                key={lbl}
                className="rounded border border-crimson/30 bg-crimson/10 px-1.5 py-0.5 text-[11px] font-medium text-primary"
              >
                {lbl}
              </span>
            ))}
          </div>
        )}

        <SummaryRow
          label={`${seatCount} × ${formatCurrency(pricePerSeat)}`}
          value={formatCurrency(subtotal)}
        />
        <SummaryRow
          label={`Service fee (${(SERVICE_FEE_RATE * 100).toFixed(0)}%)`}
          value={formatCurrency(serviceFee)}
        />
        <div className="h-px bg-white/[0.08]" />
        <SummaryRow label="Total" value={formatCurrency(total)} bold />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold = false }) {
  return (
    <div className={`flex items-center justify-between ${bold ? 'font-medium text-on-surface' : 'text-on-surface-variant'}`}>
      <span>{label}</span>
      <span className={bold ? 'text-primary' : ''}>{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const router         = useRouter();
  const dispatch       = useDispatch();

  const selectedSeatIds = useSelector((state) => state.seats.selectedSeatIds);
  const maxSeats        = useSelector((state) => state.seats.maxSeats);
  const bookingError    = useSelector((state) => state.booking.error);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const {
    data: slotResponse,
    isLoading: slotLoading,
    isError: slotError,
  } = useGetShowtimeByIdQuery(showtimeId, { skip: !showtimeId });

  const {
    data: seatResponse,
    isLoading: seatsLoading,
  } = useGetSeatMapQuery(showtimeId, { skip: !showtimeId });

  const [initializeBooking, { isLoading: initializing }] = useInitializeBookingMutation();

  // ── Data normalisation ─────────────────────────────────────────────────────

  // GET /slots/:id  → { success: true, data: { ...slot } }
  const slot = slotResponse?.data ?? slotResponse ?? null;

  // GET /showtimes/:id/seats → { success: true, data: { seats: [...], rows: {}, summary: {} } }
  const seats     = seatResponse?.data?.seats ?? seatResponse?.seats ?? seatResponse ?? [];
  const flatSeats = Array.isArray(seats) ? seats : [];

  // Build an id → label lookup so we can send labels to /initialize.
  // Done in useMemo to avoid rebuilding on every render.
  const seatLabelById = useMemo(
    () => Object.fromEntries(flatSeats.map((s) => [s.id, s.label])),
    [flatSeats],
  );

  // The selected seat labels in insertion order — shown in the summary chips.
  const selectedLabels = selectedSeatIds.map((id) => seatLabelById[id]).filter(Boolean);

  // ── Side effects ───────────────────────────────────────────────────────────

  // Sync the seat cap from the slot's available count (capped at 10 by the slice).
  useEffect(() => {
    if (slot?.availableSeats != null) {
      dispatch(setMaxSeats(slot.availableSeats));
    }
  }, [slot?.availableSeats, dispatch]);

  // Reset stale selections whenever the user lands on a new showtime.
  useEffect(() => {
    dispatch(clearSelectedSeats());
    dispatch(setCheckoutStep('seats'));
  }, [showtimeId, dispatch]);

  // ── Continue handler ───────────────────────────────────────────────────────

  const handleContinue = async () => {
    if (!selectedSeatIds.length) return;

    try {
      dispatch(setBookingError(null));

      const result = await initializeBooking({
        slotId:        showtimeId,
        seatCount:     selectedSeatIds.length,
        // Server expects human-readable labels ("A1", "B3"), not DB ids.
        selectedSeats: selectedLabels,
        currency:      'USD',
      }).unwrap();

      // Server response: { success, booking: { _id }, payment: { clientSecret, paymentIntentId } }
      dispatch(setPendingBooking({
        bookingId:         result.booking._id,
        clientSecret:      result.payment?.clientSecret      ?? null,
        seatHoldExpiresAt: result.seatHoldExpiresAt          ?? null,
        selectedLabels:    selectedLabels,
      }));

      dispatch(setCheckoutStep('payment'));
      router.push(`/booking/${showtimeId}/checkout`);
    } catch (err) {
      dispatch(setBookingError(
        err?.data?.message ?? 'Failed to reserve seats. Please try again.',
      ));
    }
  };

  // ── Loading / error states ─────────────────────────────────────────────────

  if (slotLoading || seatsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={36} />
      </div>
    );
  }

  if (slotError || !slot) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-sm text-on-surface-variant">
        <p className="text-title-lg">Showtime not found.</p>
        <Button variant="secondary" onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const pricePerSeat = slot.price ?? 0;
  const subtotal     = selectedSeatIds.length * pricePerSeat;
  const total        = subtotal + subtotal * SERVICE_FEE_RATE;

  return (
    <section className="mx-auto max-w-7xl px-md py-28">

      {/* Slot info strip */}
      <div className="mb-md">
        <SlotMetaBar slot={slot} />
      </div>

      <div className="grid grid-cols-1 gap-lg md:grid-cols-12">

        {/* ── Seat map ── */}
        <div className="md:col-span-8">
          <div className="mb-sm flex flex-wrap items-baseline justify-between gap-xs">
            <h1 className="font-display text-headline-sm">Choose your seats</h1>
            <SeatCounter selected={selectedSeatIds.length} max={maxSeats} />
          </div>

          <SeatMap seats={flatSeats} />
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-sm md:col-span-4">
          <OrderSummary
            selectedLabels={selectedLabels}
            pricePerSeat={pricePerSeat}
          />

          {bookingError && (
            <p
              role="alert"
              className="rounded-md bg-crimson/10 px-sm py-xs text-body-sm text-crimson"
            >
              {bookingError}
            </p>
          )}

          <Button
            variant="primary"
            disabled={!selectedSeatIds.length || initializing}
            onClick={handleContinue}
          >
            {initializing ? (
              <span className="flex items-center gap-xs">
                <Spinner size={16} />
                Reserving…
              </span>
            ) : selectedSeatIds.length > 0 ? (
              `Continue — ${formatCurrency(total)}`
            ) : (
              'Select seats to continue'
            )}
          </Button>

          <p className="text-center text-[11px] text-on-surface-variant">
            Seats are held for 10 minutes after you continue.
          </p>
        </div>

      </div>
    </section>
  );
}
