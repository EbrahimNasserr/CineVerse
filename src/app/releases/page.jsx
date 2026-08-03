import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  PlayCircle,
  Sparkles,
  Ticket,
} from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";

const spotlightRelease = {
  title: "Velora: The Last Signal",
  tagline: "A neon-drenched sci-fi odyssey arriving this season",
  date: "September 19",
  genres: ["Sci-Fi", "Thriller", "IMAX"],
  runtime: "2h 11m",
  posterUrl: "https://picsum.photos/seed/velora-neon/900/1200",
  synopsis:
    "A rogue signal awakens a forgotten network, drawing a grief-stricken pilot into a battle for the future of the stars.",
};

const upcomingReleases = [
  {
    title: "Midnight Orchard",
    date: "Aug 29",
    status: "Advance Screening",
    genres: ["Drama", "Mystery"],
    blurb:
      "A lyrical thriller about memory, inheritance, and the secrets hidden beneath a weathered estate.",
    accent: "from-crimson/25 to-crimson/5",
  },
  {
    title: "Echoes of Summer",
    date: "Sep 06",
    status: "Trailer Live",
    genres: ["Romance", "Festival"],
    blurb:
      "A sun-kissed story of second chances, told across one unforgettable coastal weekend.",
    accent: "from-gold/20 to-gold/5",
  },
  {
    title: "Neon Harbor",
    date: "Sep 27",
    status: "Early Access",
    genres: ["Action", "Crime"],
    blurb:
      "When the city slips into blackout, one courier becomes the last line of defense.",
    accent: "from-teal/20 to-teal/5",
  },
  {
    title: "Sable Veil",
    date: "Oct 10",
    status: "Booking Soon",
    genres: ["Fantasy", "Adventure"],
    blurb:
      "An enchanted heist unfolds as a young thief uncovers a map to a hidden kingdom.",
    accent: "from-slate-500/20 to-slate-400/5",
  },
];

const releaseTimeline = [
  {
    phase: "VIP Preview",
    date: "Aug 24",
    detail: "First look and red carpet access",
  },
  {
    phase: "Official Trailer",
    date: "Sep 01",
    detail: "New clips and exclusive behind-the-scenes",
  },
  {
    phase: "Opening Weekend",
    date: "Sep 19",
    detail: "Priority booking unlocks for members",
  },
  {
    phase: "Extended Run",
    date: "Oct 03",
    detail: "Late-night screenings and special events",
  },
];

export default function ReleasesPage() {
  return (
    <div className="flex flex-col gap-6 py-6 md:py-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-crimson/20 via-obsidian to-slate-900/70 p-6 md:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,57,70,0.26),transparent_42%)]" />
        <div className="absolute -right-10 top-10 h-56 w-56 rounded-full bg-crimson/20 blur-3xl" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal as="div" className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              <Sparkles size={13} />
              Upcoming cinematic drops
            </div>
            <h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Releases that feel like events before the first frame.
            </h1>
            <p className="mt-4 max-w-xl text-base text-on-surface-variant sm:text-lg">
              Explore the next wave of premieres, watch the momentum build, and
              reserve your spot before the crowd arrives.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-full px-5 py-3">
                Reserve premiere access
              </Button>
              <Link
                href="/movies"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-on-surface transition-all hover:border-primary/40 hover:bg-white/[0.06]"
              >
                Browse current films
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: "4 featured drops", icon: CalendarDays },
                { label: "Priority preview access", icon: Ticket },
                { label: "2 special screenings", icon: Clock3 },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="glass flex items-center gap-2 rounded-full px-3 py-2 text-sm text-on-surface-variant"
                >
                  <Icon size={14} className="text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="div" className="relative">
            <div className="release-card glass relative overflow-hidden rounded-[1.75rem] border border-white/10 p-4 shadow-2xl shadow-crimson/10">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.10)_0%,transparent_32%,rgba(255,255,255,0.04)_100%)]" />
              <div className="relative overflow-hidden rounded-[1.3rem]">
                <Image
                  src={spotlightRelease.posterUrl}
                  alt={spotlightRelease.title}
                  width={900}
                  height={1200}
                  className="h-[420px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
                    <PlayCircle size={14} />
                    Spotlight release
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    {spotlightRelease.title}
                  </h2>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {spotlightRelease.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-on-surface-variant">
                    {spotlightRelease.genres.map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                    <span>{spotlightRelease.date}</span>
                    <span>{spotlightRelease.runtime}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="glass rounded-[1.75rem] border border-white/[0.08] p-6 md:p-8">
          <SectionHeading
            eyebrow="Coming soon"
            title="The next arrivals"
            accent="gold"
            sectionNum="04"
          />

          <div className="flex flex-col gap-4">
            {upcomingReleases.map((release, index) => (
              <Reveal key={release.title} delay={index * 70}>
                <article className="release-card group rounded-[1.3rem] border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-500 hover:bg-white/[0.05]">
                  <div
                    className={`rounded-[1rem] border border-white/10 bg-gradient-to-br ${release.accent} p-4`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                          {release.status}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-semibold text-white">
                          {release.title}
                        </h3>
                      </div>
                      <div className="rounded-full border border-white/10 bg-obsidian/70 px-3 py-1 text-sm font-medium text-on-surface-variant">
                        {release.date}
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-on-surface-variant">
                      {release.blurb}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {release.genres.map((genre) => (
                        <span
                          key={genre}
                          className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-on-surface-variant"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass rounded-[1.75rem] border border-white/[0.08] p-6 md:p-8">
            <SectionHeading
              eyebrow="Release rhythm"
              title="Your timeline"
              accent="teal"
              sectionNum="05"
            />

            <div className="space-y-4">
              {releaseTimeline.map((item, index) => (
                <Reveal key={item.phase} delay={index * 60}>
                  <div className="flex gap-3 rounded-[1rem] border border-white/[0.06] bg-white/[0.03] p-4">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_6px_rgba(230,57,70,0.16)]" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">{item.phase}</p>
                        <span className="text-xs uppercase tracking-[0.2em] text-gold">
                          {item.date}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-br from-teal/15 via-obsidian to-crimson/10 p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(111,216,200,0.2),transparent_42%)]" />
              <div className="relative z-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-teal">
                  Members-only perk
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                  Be first in line for immersive premieres.
                </h3>
                <p className="mt-3 text-sm text-on-surface-variant">
                  Unlock early access, curated reminders, and a smoother
                  checkout experience for every launch week.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button className="rounded-full px-4 py-2.5">
                    Join the waitlist
                  </Button>
                  <Link
                    href="/login"
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-white/[0.06]"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
