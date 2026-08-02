'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) return;
    // Placeholder — wire up to a real newsletter endpoint.
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 2500);
  };

  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 lg:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative">
        <div className="mb-sm flex items-center gap-2 text-label-caps text-primary">
          <Mail size={16} />
          The Dispatch
        </div>
        <h4 className="mb-2 font-display text-2xl font-bold leading-tight">Get the weekly reel.</h4>
        <p className="mb-md text-body-sm text-on-surface-variant">
          Premieres, exclusive trailers, and members-only screenings — every Friday morning.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <Input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="gap-2 whitespace-nowrap">
            {subscribed ? (
              <>
                <Check size={14} />
                Subscribed
              </>
            ) : (
              <>
                Subscribe
                <ArrowRight size={14} />
              </>
            )}
          </Button>
        </form>
        <p className="mt-2 text-body-sm text-on-surface-variant/50">No spam. Unsubscribe with one click.</p>
      </div>
    </div>
  );
}
