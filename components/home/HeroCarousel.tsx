'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { WebtoonSeries } from '@/lib/comics-data';
import { FALLBACK_POSTER_URI, formatRankNumber, sanitizePosterUrl } from '@/lib/ui-formatters';

interface HeroCarouselProps {
  series: WebtoonSeries[];
}

export function HeroCarousel({ series }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedSlugs, setFailedSlugs] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const bannerItems = series.slice(0, 5);

  useEffect(() => {
    if (bannerItems.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [bannerItems.length, isPaused]);

  if (bannerItems.length === 0) return null;

  const current = bannerItems[currentIndex];
  const nextItem = bannerItems[(currentIndex + 1) % bannerItems.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  const primaryPoster = failedSlugs[current.slug]
    ? FALLBACK_POSTER_URI
    : sanitizePosterUrl(current.poster);

  const secondaryPoster = failedSlugs[nextItem.slug]
    ? FALLBACK_POSTER_URI
    : sanitizePosterUrl(nextItem.poster);

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[#11131A] text-white p-6 sm:p-8 lg:p-10 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Sorotan Utama"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Editorial Column */}
        <div className="md:col-span-7 space-y-4">
          <p className="text-xs font-semibold text-neutral-300 tabular-nums">
            <span className="text-[var(--primary)]">Pilihan Editor</span>
            <span aria-hidden="true"> · </span>
            <span>{current.genres.slice(0, 3).join(' · ')}</span>
            <span aria-hidden="true"> · </span>
            <span>★ {current.rating.toFixed(1)}</span>
          </p>

          <h1
            className="font-display font-extrabold tracking-tight text-white leading-[1.12] line-clamp-2"
            style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)', textWrap: 'balance' }}
          >
            {current.title}
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-neutral-300 line-clamp-3">
            {current.synopsis}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={`/series/${current.slug}`}
              className="press-soft inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Mulai Baca</span>
            </Link>

            <Link
              href="/donghua"
              className="press-soft inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-neutral-100 hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Jelajahi Donghua
            </Link>
          </div>

          {/* Slide Navigation */}
          <div className="pt-4 flex items-center gap-3 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Banner sebelumnya"
                className="press-soft w-8 h-8 flex items-center justify-center rounded-md border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Banner berikutnya"
                className="press-soft w-8 h-8 flex items-center justify-center rounded-md border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs font-semibold text-neutral-300 tabular-nums">
              {formatRankNumber(currentIndex + 1)} / {formatRankNumber(bannerItems.length)}
            </span>

            <div className="flex items-center gap-1.5 ml-auto">
              {bannerItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Pilih sorotan ${idx + 1}: ${item.title}`}
                  className={`h-1.5 rounded-sm transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 bg-[var(--primary)]'
                      : 'w-2.5 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Editorial Artwork Showcase */}
        <div className="md:col-span-5 flex items-center justify-center md:justify-end gap-3">
          <Link
            href={`/series/${current.slug}`}
            className="relative aspect-[2/3] w-44 sm:w-52 lg:w-56 overflow-hidden rounded-lg border border-white/15 bg-neutral-900 shadow-2xl shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryPoster}
              alt={current.title}
              referrerPolicy="no-referrer"
              onError={() =>
                setFailedSlugs((prev) => ({ ...prev, [current.slug]: true }))
              }
              className="h-full w-full object-cover"
            />
          </Link>

          {bannerItems.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label={`Berikutnya: ${nextItem.title}`}
              className="hidden sm:block relative aspect-[2/3] w-28 lg:w-32 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 opacity-65 hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={secondaryPoster}
                alt={nextItem.title}
                referrerPolicy="no-referrer"
                onError={() =>
                  setFailedSlugs((prev) => ({ ...prev, [nextItem.slug]: true }))
                }
                className="h-full w-full object-cover"
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
