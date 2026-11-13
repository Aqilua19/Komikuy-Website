'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HistoryItem } from '@/types/comic';
import { getHistory } from '@/lib/client/history';
import { BookOpen, ArrowRight } from 'lucide-react';
import { sanitizePosterUrl } from '@/lib/ui-formatters';

export function ContinueReading() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const load = () => setHistory(getHistory());
    load();

    window.addEventListener('history-updated', load);
    return () => window.removeEventListener('history-updated', load);
  }, []);

  if (history.length === 0) return null;

  const recents = history.slice(0, 3);

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-4 pb-3 border-b border-[var(--border)]">
        <h2 className="font-display text-lg font-bold text-[var(--foreground)]">Lanjutkan Membaca</h2>
        <Link
          href="/history"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline transition-colors"
        >
          <span>Semua Riwayat</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {recents.map((item) => (
          <div
            key={`${item.slug}-${item.chapter_number}`}
            className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3.5 flex items-center justify-between gap-3 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative aspect-[2/3] w-14 rounded-md overflow-hidden shrink-0 bg-[var(--muted)] border border-[var(--border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sanitizePosterUrl(item.poster)}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-[var(--primary)]">Terakhir Dibaca</span>
                <Link href={`/manga/${item.slug}`}>
                  <h3 className="text-sm font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs text-[var(--muted-foreground)] truncate tabular-nums">
                  {item.chapter_title || `Ch. ${item.chapter_number}`}
                </p>
              </div>
            </div>

            <Link
              href={`/manga/${item.slug}/chapter/${item.chapter_number}`}
              className="px-3 py-2 bg-[var(--primary)] hover:opacity-90 text-white rounded-md text-xs font-semibold transition-opacity shrink-0 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lanjut</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
