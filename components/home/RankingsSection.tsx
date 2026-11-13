'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { WebtoonSeries, getRankedSeries } from '@/lib/comics-data';
import { FALLBACK_POSTER_URI, formatRankNumber, sanitizePosterUrl } from '@/lib/ui-formatters';

export function RankingsSection() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [failedSlugs, setFailedSlugs] = useState<Record<string, boolean>>({});
  const ranked = getRankedSeries(period).slice(0, 10);

  const col1 = ranked.slice(0, 5);
  const col2 = ranked.slice(5, 10);

  const renderRankItem = (item: WebtoonSeries, rankIndex: number) => {
    const rank = rankIndex + 1;
    const isTop3 = rank <= 3;
    const posterSrc = failedSlugs[item.slug]
      ? FALLBACK_POSTER_URI
      : sanitizePosterUrl(item.poster);

    return (
      <Link
        key={item.id}
        href={`/series/${item.slug}`}
        className="group flex items-center gap-3.5 py-3 px-2 rounded-md hover:bg-[var(--card)] transition-colors"
      >
        {/* Tabular Rank Index */}
        <div className="w-9 flex flex-col items-center justify-center shrink-0 tabular-nums">
          <span
            className={`font-display text-lg font-extrabold tracking-tight leading-none ${
              isTop3 ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
            }`}
          >
            {formatRankNumber(rank)}
          </span>
          {item.rankDelta > 0 ? (
            <span className="text-[10px] font-semibold text-emerald-500 mt-1 leading-none">
              ▲{item.rankDelta}
            </span>
          ) : item.rankDelta < 0 ? (
            <span className="text-[10px] font-semibold text-[var(--destructive)] mt-1 leading-none">
              ▼{Math.abs(item.rankDelta)}
            </span>
          ) : (
            <span className="text-[10px] text-[var(--muted-foreground)] mt-1 leading-none">
              —
            </span>
          )}
        </div>

        {/* 2:3 Thumbnail */}
        <div className="relative w-12 aspect-[2/3] rounded-md overflow-hidden bg-[var(--muted)] shrink-0 border border-[var(--border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterSrc}
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() =>
              setFailedSlugs((prev) => ({ ...prev, [item.slug]: true }))
            }
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Unboxed Editorial Details */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] truncate tabular-nums">
            <span>{item.genres[0]}</span>
            <span aria-hidden="true"> · </span>
            <span>{item.author}</span>
            <span aria-hidden="true"> · </span>
            <span>★ {item.rating.toFixed(1)}</span>
          </p>
        </div>
      </Link>
    );
  };

  return (
    <section className="w-full" aria-label="Peringkat Teratas">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 mb-2 border-b border-[var(--border)] gap-3">
        <div className="flex items-end gap-3">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)]">
              Tangga Peringkat Populer
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Berdasarkan pembacaan aktif dan rating komunitas
            </p>
          </div>
          <Link
            href="/ranking"
            className="press-soft inline-flex items-center gap-0.5 text-xs sm:text-sm font-semibold text-[var(--primary)] hover:underline whitespace-nowrap"
          >
            <span>Semua</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Clean Segmented Period Control */}
        <div className="inline-flex items-center p-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-xs font-semibold self-start sm:self-auto">
          {[
            { key: 'today', label: 'Hari ini' },
            { key: 'week', label: 'Minggu ini' },
            { key: 'month', label: 'Bulan ini' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setPeriod(tab.key as 'today' | 'week' | 'month')}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                period === tab.key
                  ? 'bg-[var(--background)] text-[var(--foreground)] shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Editorial Chart with Hairline Dividers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div className="divide-y divide-[var(--border)]">
          {col1.map((item, idx) => renderRankItem(item, idx))}
        </div>
        <div className="divide-y divide-[var(--border)] border-t border-[var(--border)] md:border-t-0">
          {col2.map((item, idx) => renderRankItem(item, idx + 5))}
        </div>
      </div>
    </section>
  );
}
