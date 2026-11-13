'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { readHistory, removeHistory, clearHistory, subscribeHistory, getEmptyHistory, type HistoryItem } from '@/lib/anime/history';

function getDayGroupLabel(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const itemDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const diffDays = Math.round((startOfToday - itemDay) / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  if (diffDays >= 2 && diffDays <= 6) return `${diffDays} hari lalu`;

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default function AnimeHistoryPage() {
  const items = useSyncExternalStore(
    subscribeHistory,
    readHistory,
    getEmptyHistory
  );
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Group items by day
  const grouped = items.reduce<Record<string, HistoryItem[]>>((acc, item) => {
    const label = getDayGroupLabel(item.watchedAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});

  const groupKeys = Object.keys(grouped);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* Breadcrumb & Header */}
      <div className="space-y-2 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link href="/anime" className="hover:text-[var(--foreground)]">Anime</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">Riwayat Tontonan</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-[var(--primary)] text-xl" />
              Riwayat Tontonan Anime
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Riwayat tontonan disimpan secara lokal di browser perangkat ini (maksimum 100 episode).
            </p>
          </div>
          {mounted && items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Hapus semua riwayat tontonan anime?')) {
                  clearHistory();
                }
              }}
              className="press-soft self-start inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <i className="fa-solid fa-trash-can text-xs" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>
      </div>

      {!mounted ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-[var(--border)] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-2xl text-[var(--muted-foreground)]">
            <i className="fa-solid fa-clock-rotate-left" />
          </div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">Belum Ada Riwayat Tontonan</h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm">
            Episode anime yang kamu tonton akan otomatis tercatat di sini sehingga kamu bisa melanjutkan kapan saja.
          </p>
          <Link
            href="/anime"
            className="press-soft inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-[var(--primary-foreground)] shadow-xs hover:opacity-90 transition-opacity"
          >
            <i className="fa-solid fa-play" />
            <span>Mulai Nonton</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {groupKeys.map((groupLabel) => (
            <div key={groupLabel} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)] pb-1.5">
                {groupLabel}
              </h3>

              <div className="space-y-2.5">
                {grouped[groupLabel]?.map((item) => (
                  <div
                    key={item.episodeId}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 hover:bg-[var(--accent)] transition-all shadow-xs"
                  >
                    <Link
                      href={`/anime/watch/${item.episodeId}`}
                      className="flex flex-1 items-center gap-3 min-w-0"
                    >
                      <div className="relative aspect-[2/3] w-12 sm:w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-900">
                        <img
                          src={item.poster}
                          alt={item.animeTitle}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <i className="fa-solid fa-play text-white text-xs" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="truncate text-xs sm:text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                          {item.animeTitle}
                        </h4>
                        <p className="truncate text-xs text-[var(--muted-foreground)] mt-0.5">
                          {item.episodeTitle}
                        </p>
                        <span className="text-[10px] text-[var(--primary)] font-medium mt-1 inline-block">
                          Lanjutkan pemutaran →
                        </span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeHistory(item.episodeId)}
                      aria-label="Hapus dari riwayat"
                      title="Hapus riwayat ini"
                      className="w-8 h-8 rounded-full border border-transparent hover:border-[var(--border)] text-[var(--muted-foreground)] hover:text-red-400 flex items-center justify-center transition-colors"
                    >
                      <i className="fa-solid fa-xmark text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
