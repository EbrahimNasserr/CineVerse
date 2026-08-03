import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/Button";

const contactPoints = [
  {
    title: "Guest support",
    detail:
      "Need help with a booking or showtime change? Our team is ready around the clock.",
    icon: Mail,
    href: "mailto:hello@cineverse.com",
  },
  {
    title: "Visit the lounge",
    detail:
      "Step into our flagship theater district for private previews and member events.",
    icon: MapPin,
    href: "https://maps.google.com",
  },
  {
    title: "Call the concierge",
    detail:
      "Speak with a cinema specialist to plan your next cinematic escape.",
    icon: Phone,
    href: "tel:+15551234567",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6 py-20 px-2 md:px-0 max-w-7xl mx-auto">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-teal/15 via-obsidian to-crimson/10 p-6 md:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(111,216,200,0.24),transparent_42%)]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal as="div" className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-teal">
              <Sparkles size={13} />
              Contact the experience
            </div>
            <h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              We’re here to make every screening feel seamless.
            </h1>
            <p className="mt-4 max-w-xl text-base text-on-surface-variant sm:text-lg">
              From booking questions to VIP access, our team helps you move from
              inspiration to ticket in just a few taps.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-full px-5 py-3">
                Start a conversation
              </Button>
              <Link
                href="/movies"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-on-surface transition-all hover:border-teal/40 hover:bg-white/[0.06]"
              >
                Explore current titles
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <Reveal as="div">
            <div className="glass rounded-[1.75rem] border border-white/[0.08] p-6 shadow-2xl shadow-teal/10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                Preferred contact
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                Need a fast answer?
              </h2>
              <p className="mt-3 text-sm text-on-surface-variant">
                Share your preference and we’ll connect you with the right
                concierge, support, or venue team.
              </p>
              <div className="mt-6 space-y-3">
                {contactPoints.map(({ title, detail, icon: Icon, href }) => (
                  <Link
                    key={title}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="release-card flex items-start gap-3 rounded-[1rem] border border-white/[0.08] bg-white/[0.03] p-4 transition-all"
                  >
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-primary">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {detail}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal
          as="div"
          className="glass rounded-[1.75rem] border border-white/[0.08] p-6 md:p-8"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
            The lounge
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white">
            Visit us for a deeper experience
          </h2>
          <p className="mt-3 text-sm text-on-surface-variant">
            Our lounge welcomes members for private screenings, exclusive first
            looks, and surprise events.
          </p>
          <div className="mt-6 rounded-[1.25rem] border border-white/[0.08] bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-teal">
                <MapPin size={16} />
              </div>
              <div>
                <p className="font-semibold text-white">CineVerse Lounge</p>
                <p className="text-sm text-on-surface-variant">
                  18 Harbor Avenue, Downtown
                </p>
              </div>
            </div>
            <div className="mt-4 h-40 rounded-[1rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(111,216,200,0.2),transparent_42%),linear-gradient(120deg,rgba(255,255,255,0.06),transparent)]" />
          </div>
        </Reveal>

        <Reveal
          as="div"
          className="glass rounded-[1.75rem] border border-white/[0.08] p-6 md:p-8"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
            Quick note
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white">
            Prefer email?
          </h2>
          <p className="mt-3 text-sm text-on-surface-variant">
            Send us your question and we’ll reply with the right next step,
            whether that’s booking help, group reservations, or accessibility
            support.
          </p>
          <div className="mt-6 rounded-[1.25rem] border border-white/[0.08] bg-gradient-to-br from-crimson/10 via-obsidian to-teal/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-primary">
                <Mail size={16} />
              </div>
              <div>
                <p className="font-semibold text-white">hello@cineverse.com</p>
                <p className="text-sm text-on-surface-variant">
                  Response within one business day
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="mailto:hello@cineverse.com"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-white/[0.06]"
              >
                Email support
              </Link>
              <Link
                href="/bookings"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-white/[0.06]"
              >
                View bookings
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
