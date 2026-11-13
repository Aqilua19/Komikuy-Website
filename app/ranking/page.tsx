'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Star, Heart } from 'lucide-react';
import { getRankedSeries, WebtoonSeries } from '@/lib/comics-data';

export default function RankingPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const ranked = getRankedSeries(period);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text)]">
            Tangga Peringkat Webtoon
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Komik paling populer berdasarkan aktivitas pembaca, like, dan langganan.
          </p>
        </div>

        {/* Period segmented control */}
        <div className="flex items-center bg-[var(--bg-subtle)] p-1 rounded-[6px] border border-[var(--border)] mb-6 max-w-sm">
          <button
            onClick={() => setPeriod('today')}
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[4px] transition-colors text-center ${
              period === 'today'
                ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[4px] transition-colors text-center ${
              period === 'week'
                ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Minggu Ini
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[4px] transition-colors text-center ${
              period === 'month'
                ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Bulan Ini
          </button>
        </div>

        {/* Full-width 1-column list with large rank numbers */}
        <div className="divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
          {ranked.map((item, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
              <Link
                key={item.id}
                href={`/series/${item.slug}`}
                className="group flex items-center gap-4 py-3.5 px-2 hover:bg-[var(--bg-subtle)] transition-colors rounded-[4px]"
              >
                {/* Large Rank Number & Delta */}
                <div className="w-12 flex flex-col items-center justify-center flex-shrink-0 text-center tabular-nums">
                  <span
                    className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-none ${
                      isTop3 ? 'text-[var(--primary)]' : 'text-[var(--text)]'
                    }`}
                  >
                    {rank < 10 ? `0${rank}` : rank}
                  </span>
                  <div className="mt-1">
                    {item.rankDelta > 0 ? (
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center justify-center">
                        ▲ {item.rankDelta}
                      </span>
                    ) : item.rankDelta < 0 ? (
                      <span className="text-[10px] font-bold text-[var(--danger)] flex items-center justify-center">
                        ▼ {Math.abs(item.rankDelta)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-faint)]">—</span>
                    )}
                  </div>
                </div>

                {/* 2:3 Cover */}
                <div className="relative w-14 aspect-[2/3] rounded-md overflow-hidden bg-[var(--bg-subtle)] flex-shrink-0 border border-[var(--border)]">
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-[var(--primary)] uppercase">
                      {item.genres[0]}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      · Update {item.day}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-[var(--text)] truncate group-hover:text-[var(--primary)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[var(--text-muted)] truncate mt-0.5">
                    {item.author}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--text-muted)] tabular-nums">
                    <div className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3 text-[var(--like)] fill-[var(--like)] flex-shrink-0" />
                      <span>{item.likes}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                      <span>{item.rating.toFixed(2)}</span>
                    </div>
                    <span>·</span>
                    <span>{item.views} views</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
