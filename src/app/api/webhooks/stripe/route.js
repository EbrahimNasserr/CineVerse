/**
 * Next.js App Router API route — Stripe webhook handler.
 *
 * Stripe requires the raw request body for signature verification, so we
 * must NOT parse the body with Next.js's default JSON parser. We read the
 * raw bytes here and forward them to the Express backend together with the
 * stripe-signature header, which performs the actual business logic.
 *
 * If your Next.js app IS the sole backend (no separate Express server),
 * move the bookingService.handleStripeWebhook logic here instead of
 * proxying to the backend.
 */

const BACKEND_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/bookings/webhook/stripe`
    : null;

export async function POST(request) {
  // Stripe sends the raw body — we must not touch it.
  const rawBody = await request.arrayBuffer();
  const body    = Buffer.from(rawBody);

  const sig          = request.headers.get('stripe-signature');
  const contentType  = request.headers.get('content-type') ?? 'application/json';

  // ── Option A: Proxy to the Express backend ───────────────────────────────
  if (BACKEND_WEBHOOK_URL) {
    try {
      const backendResponse = await fetch(BACKEND_WEBHOOK_URL, {
        method:  'POST',
        headers: {
          'content-type':     contentType,
          'stripe-signature': sig ?? '',
        },
        body,
      });

      const data = await backendResponse.json().catch(() => ({ received: true }));

      return Response.json(data, { status: backendResponse.status });
    } catch (err) {
      console.error('[stripe-webhook] proxy error:', err);
      return Response.json(
        { success: false, message: 'Webhook proxy failed' },
        { status: 502 }
      );
    }
  }

  // ── Option B: Handle inline (standalone Next.js setup) ───────────────────
  // Requires: npm install stripe
  // Uncomment and implement if there is no separate Express backend.
  //
  // const { default: Stripe } = await import('stripe');
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });
  // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  //
  // let event;
  // try {
  //   event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  // } catch (err) {
  //   return Response.json({ success: false, message: `Webhook Error: ${err.message}` }, { status: 400 });
  // }
  //
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     // await bookingService.handlePaymentSucceeded(event.data.object);
  //     break;
  //   case 'payment_intent.payment_failed':
  //     // await bookingService.handlePaymentFailed(event.data.object);
  //     break;
  //   default:
  //     console.log(`[stripe-webhook] unhandled event type: ${event.type}`);
  // }
  //
  // return Response.json({ received: true });

  return Response.json(
    { success: false, message: 'Webhook backend URL not configured' },
    { status: 500 }
  );
}

/**
 * Stripe requires the raw body for signature verification.
 * Disable Next.js body parsing for this route.
 */
export const dynamic = 'force-dynamic';
