'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDispatch, useSelector } from '@/store/hooks';
import { useGetShowtimeByIdQuery } from '@/features/showtimes/showtimesApi';
import { useConfirmBookingMutation } from '@/features/booking/bookingApi';
import {
  clearPendingBooking,
  setBookingError,
  setCheckoutStep,
  resetCheckout,
} from '@/features/booking/bookingSlice';
import { clearSelectedSeats } from '@/features/seats/seatsSlice';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PaymentMethod } from '@/features/booking/components/PaymentMethod';
import { BookingSummary } from '@/features/booking/components/BookingSummary';
import { checkoutSchema } from '@/lib/validators/checkoutSchema';
import { formatCurrency } from '@/lib/utils/formatCurrency';

const SERVICE_FEE_RATE = 0.05; // mirrors server: subtotal × 5%

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ['Seats', 'Payment', 'Confirmation'];

function StepIndicator({ current }) {
  return (
    <ol className="mb-lg flex items-center gap-0" aria-label="Checkout progress">
      {STEPS.map((label, idx) => {
        const stepIndex = idx + 1;
        const isDone    = stepIndex < current;
        const isActive  = stepIndex === current;

        return (
          <li key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className={[
                  'flex h-7 w-7 items-center justify-center rounded-full text-body-sm font-bold transition-colors',
                  isDone   ? 'bg-teal text-obsidian'        : '',
                  isActive ? 'bg-crimson text-white'        : '',
                  !isDone && !isActive ? 'bg-white/10 text-on-surface-variant' : '',
                ].join(' ')}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? '✓' : stepIndex}
              </span>
              <span className={`text-body-xs ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="mx-sm h-px w-10 bg-white/[0.12]" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ─── Seat hold countdown ──────────────────────────────────────────────────────

function HoldExpiry({ expiresAt }) {
  if (!expiresAt) return null;

  const expiryMs   = new Date(expiresAt).getTime();
  const remainingS = Math.max(0, Math.floor((expiryMs - Date.now()) / 1000));
  const minutes    = Math.floor(remainingS / 60);
  const seconds    = remainingS % 60;

  return (
    <p className="text-center text-body-xs text-gold">
      Seats held for{' '}
      <span className="font-bold tabular-nums">
        {minutes}:{String(seconds).padStart(2, '0')}
      </span>{' '}
      — complete payment before they expire.
    </p>
  );
}

// ─── Page guard — redirects back if no pending booking exists ─────────────────

function useBookingGuard(showtimeId) {
  const router          = useRouter();
  const pendingBookingId = useSelector((state) => state.booking.pendingBookingId);

  useEffect(() => {
    if (!pendingBookingId) {
      router.replace(`/booking/${showtimeId}`);
    }
  }, [pendingBookingId, router, showtimeId]);

  return pendingBookingId;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { showtimeId } = useParams();
  const router         = useRouter();
  const dispatch       = useDispatch();

  const pendingBookingId  = useBookingGuard(showtimeId);
  const seatHoldExpiresAt = useSelector((state) => state.booking.seatHoldExpiresAt);
  const clientSecret      = useSelector((state) => state.booking.clientSecret);
  const selectedSeatIds   = useSelector((state) => state.seats.selectedSeatIds);
  const selectedLabels    = useSelector((state) => state.booking.selectedLabels ?? []);
  const bookingError      = useSelector((state) => state.booking.error);

  const { data: slotData } = useGetShowtimeByIdQuery(showtimeId, { skip: !showtimeId });
  const slot = slotData?.data ?? slotData ?? null;

  const [confirmBooking, { isLoading: confirming }] = useConfirmBookingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'card' },
  });

  // Derive summary values from slot price
  const pricePerSeat = slot?.price ?? 0;
  const seatTotal    = selectedSeatIds.length * pricePerSeat;
  const serviceFee   = parseFloat((seatTotal * SERVICE_FEE_RATE).toFixed(2));
  const total        = seatTotal + serviceFee;

  const showtimeLabel = slot
    ? `${slot.theater} · ${slot.screen ?? 'Screen 1'} · ${slot.startTime}`
    : '';

  const onSubmit = async (formValues) => {
    if (!pendingBookingId) return;

    try {
      dispatch(setBookingError(null));

      // Extract the PaymentIntent ID from the client secret.
      // Format: pi_xxx_secret_yyy  →  we need "pi_xxx" only.
      const paymentIntentId = clientSecret?.split('_secret_')[0] ?? '';

      const result = await confirmBooking({
        bookingId:       pendingBookingId,
        paymentIntentId: paymentIntentId,
      }).unwrap();

      // Clean up transient state after a successful confirmation.
      dispatch(clearSelectedSeats());
      dispatch(clearPendingBooking());
      dispatch(resetCheckout());
      dispatch(setCheckoutStep('confirmation'));

      // Navigate to the confirmation page using the booking number when available.
      const bookingNumber = result?.booking?.bookingNumber;
      const bookingId     = result?.booking?._id ?? pendingBookingId;

      router.push(bookingNumber
        ? `/bookings/${bookingId}?confirmed=1`
        : `/bookings/${bookingId}?confirmed=1`
      );
    } catch (err) {
      dispatch(setBookingError(err?.data?.message ?? 'Payment failed. Please try again.'));
    }
  };

  if (!pendingBookingId) {
    // Guard is redirecting — render nothing to avoid flicker.
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-md py-28">
      <StepIndicator current={2} />

      <div className="grid grid-cols-1 gap-lg md:grid-cols-12">

        {/* ── Form ── */}
        <div className="md:col-span-7">
          <h1 className="mb-md font-display text-headline-sm">Payment Details</h1>

          <form
            id="checkout-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-sm"
          >
            <Input
              label="Full name"
              placeholder="Jane Doe"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="jane@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <PaymentMethod register={register} />
          </form>

          {bookingError && (
            <p
              role="alert"
              className="mt-sm rounded-md bg-crimson/10 px-sm py-xs text-body-sm text-crimson"
            >
              {bookingError}
            </p>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-sm md:col-span-5">
          <BookingSummary
            showtimeLabel={showtimeLabel}
            seatLabels={selectedLabels.length ? selectedLabels : selectedSeatIds}
            total={total}
          />

          <HoldExpiry expiresAt={seatHoldExpiresAt} />

          <div className="glass rounded-lg px-md py-sm text-body-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>{selectedSeatIds.length} × seat ({formatCurrency(pricePerSeat)})</span>
              <span>{formatCurrency(seatTotal)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Service fee ({(SERVICE_FEE_RATE * 100).toFixed(0)}%)</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            <div className="mt-xs flex justify-between font-medium text-on-surface">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <Button
            type="submit"
            form="checkout-form"
            variant="primary"
            disabled={confirming}
          >
            {confirming ? (
              <span className="flex items-center gap-xs">
                <Spinner size={16} />
                Processing…
              </span>
            ) : (
              `Confirm & Pay ${formatCurrency(total)}`
            )}
          </Button>

          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              dispatch(clearPendingBooking());
              router.push(`/booking/${showtimeId}`);
            }}
          >
            ← Change seats
          </Button>
        </div>

      </div>
    </section>
  );
}

