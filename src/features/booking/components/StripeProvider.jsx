'use client';

/**
 * Wraps children in Stripe's Elements context.
 *
 * Usage:
 *   <StripeProvider clientSecret={clientSecret}>
 *     <YourPaymentForm />
 *   </StripeProvider>
 *
 * clientSecret is the PaymentIntent client_secret returned by /initialize.
 * We defer loadStripe so the Stripe.js script is only fetched when the
 * checkout page is actually mounted.
 */

import { useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Memoised outside the component so loadStripe is called at most once.
let stripePromise = null;
function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');
  }
  return stripePromise;
}

const ELEMENTS_OPTIONS = {
  appearance: {
    theme: 'night',
    variables: {
      colorPrimary:    '#e63946', // crimson
      colorBackground: '#1a1a2e',
      colorText:       '#f1f1f1',
      borderRadius:    '6px',
    },
  },
};

export function StripeProvider({ clientSecret, children }) {
  const options = useMemo(
    () => (clientSecret ? { ...ELEMENTS_OPTIONS, clientSecret } : ELEMENTS_OPTIONS),
    [clientSecret],
  );

  return (
    <Elements stripe={getStripe()} options={options}>
      {children}
    </Elements>
  );
}
