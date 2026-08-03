import { HeroSection } from '@/components/home/HeroSection';
import { SectionHeading } from '@/components/home/SectionHeading';
import { TrailerCard } from '@/components/home/TrailerCard';
import { MarqueeTicker } from '@/components/home/MarqueeTicker';
import { NewsArticleCard } from '@/components/home/NewsArticleCard';
import { NewsletterCard } from '@/components/home/NewsletterCard';
import { Reveal } from '@/components/home/Reveal';
import { MovieGrid } from '@/features/movies/components/MovieGrid';
import {
  MOCK_TRAILERS,
  MOCK_TRENDING_ITEMS,
  MOCK_NEWS,
} from '@/lib/constants/mockHomeContent';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Now Showing */}
      <section id="now-showing" className="relative overflow-hidden px-6 py-10 lg:px-10">
        <div className="relative mx-auto max-w-content">
          <SectionHeading
            eyebrow="Currently Playing"
            title="Now Showing"
            accent="crimson"
            viewAllHref="/movies"
            sectionNum="01"
          />
          <MovieGrid />
        </div>
      </section>

      {/* Latest Trailers */}
      <section
        id="trailers"
        className="relative overflow-hidden bg-surface-container-lowest px-6 py-10 lg:px-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-obsidian via-surface-container-lowest to-obsidian" />
        <div className="relative mx-auto max-w-content">
          <SectionHeading
            eyebrow="Fresh Reels"
            title="Latest Trailers"
            accent="gold"
            viewAllHref="/movies"
            viewAllLabel="All Trailers"
            sectionNum="02"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Reveal as="div" className="lg:col-span-8">
              <TrailerCard trailer={MOCK_TRAILERS.featured} variant="featured" />
            </Reveal>

            <div className="flex flex-col gap-4 lg:col-span-4">
              {MOCK_TRAILERS.sidebar.map((trailer, i) => (
                <Reveal key={trailer.title} delay={(i + 1) * 70}>
                  <TrailerCard trailer={trailer} variant="compact" />
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-12">
            <MarqueeTicker items={MOCK_TRENDING_ITEMS} />
          </Reveal>
        </div>
      </section>

      {/* CineNews */}
      <section id="cinews" className="relative overflow-hidden px-6 py-10 lg:px-10">
        <div className="relative mx-auto max-w-content">
          <SectionHeading
            eyebrow="The Dispatch"
            title="CineNews"
            accent="teal"
            viewAllHref="/movies"
            viewAllLabel="All Stories"
            sectionNum="03"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Reveal as="div" className="lg:col-span-7">
              <NewsArticleCard article={MOCK_NEWS.feature} variant="feature" />
            </Reveal>

            <div className="flex flex-col gap-6 lg:col-span-5">
              {MOCK_NEWS.secondary.map((article, i) => (
                <Reveal key={article.title} delay={(i + 1) * 70}>
                  <NewsArticleCard article={article} variant="secondary" />
                </Reveal>
              ))}
              <Reveal delay={(MOCK_NEWS.secondary.length + 1) * 70}>
                <NewsletterCard />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
