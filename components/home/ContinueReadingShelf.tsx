'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Play } from 'lucide-react';
import { WEBTOON_SERIES } from '@/lib/comics-data';
import { FALLBACK_POSTER_URI, sanitizePosterUrl } from '@/lib/ui-formatters';

interface HistoryRecord {
  slug: string;
  chapter_number: number;
  chapter_title: string;
  timestamp: number;
}

export function ContinueReadingShelf() {
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [failedSlugs, setFailedSlugs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const stored = localStorage.getItem('komakatsu_reading_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed.slice(0, 8));
          return;
        }
      }
    } catch {}

    setHistory([
      {
        slug: 'solo-leveling',
        chapter_number: 180,
        chapter_title: 'Chapter 180: Shadow Monarch',
        timestamp: 1729700000000,
      },
      {
        slug: 'solo-swordmaster',
        chapter_number: 23,
        chapter_title: 'Chapter 23',
        timestamp: 1729600000000,
      },
    ]);
  }, []);

  if (!mounted || history.length === 0) return null;

  return (
    <section className="w-full" aria-label="Lanjut Baca">
      <div className="flex items-end justify-between pb-3 mb-4 border-b border-[var(--border)]">
        <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)]">
          Lanjut Baca
        </h2>
        <Link
          href="/simpanan"
          className="press-soft inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[var(--primary)] hover:underline whitespace-nowrap"
        >
          <span>Semua Riwayat</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {history.map((item) => {
          const series = WEBTOON_SERIES.find((s) => s.slug === item.slug);
          if (!series) return null;
          const posterSrc = failedSlugs[series.slug]
            ? FALLBACK_POSTER_URI
            : sanitizePosterUrl(series.poster);

          return (
            <Link
              key={item.slug}
              href={`/series/${series.slug}/episode/${item.chapter_number}`}
              className="group block w-32 sm:w-36 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-lg"
            >
              <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-[var(--muted)] border border-[var(--border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterSrc}
                  alt={series.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedSlugs((prev) => ({ ...prev, [series.slug]: true }))
                  }
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-9 h-9 rounded-md bg-[var(--primary)] text-white flex items-center justify-center shadow-md">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-0.5">
                <h3 className="line-clamp-1 text-xs sm:text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {series.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] tabular-nums">
                  Ch. {item.chapter_number}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
