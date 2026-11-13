'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { homeQuery } from '@/lib/anime/queries';
import { readHistory, subscribeHistory, getEmptyHistory } from '@/lib/anime/history';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { ErrorState } from '@/components/common/ErrorState';

export default function AnimeHomePage() {
  const { data, isPending, isError, error, refetch } = useQuery(homeQuery());
  const allHistory = useSyncExternalStore(
    subscribeHistory,
    readHistory,
    getEmptyHistory
  );
  const historyItems = allHistory.slice(0, 10);

  const ongoingList = data?.data?.ongoing?.animeList ?? [];
  const completedList = data?.data?.completed?.animeList ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-10">
      {/* Anime Hub Banner & Quick Nav */}
      <section className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[#11131A] text-white p-6 sm:p-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold text-[var(--primary)]">
            Nonton Anime Sub Indo
          </p>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Katalog Anime Lengkap &amp; Update Cepat
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Streaming episode anime ongoing mingguan, anime tamat resolusi jernih, jadwal rilis hari ini, dan batch download.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            <Link
              href="/anime/schedule"
              className="press-soft inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <i className="fa-solid fa-calendar-days" />
              <span>Jadwal Rilis</span>
            </Link>
            <Link
              href="/anime/ongoing"
              className="press-soft inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-play" />
              <span>Sedang Tayang</span>
            </Link>
            <Link
              href="/anime/completed"
              className="press-soft inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-circle-check" />
              <span>Tamat</span>
            </Link>
            <Link
              href="/anime/genre"
              className="press-soft inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-layer-group" />
              <span>Genre</span>
            </Link>
            <Link
              href="/anime/search"
              className="press-soft inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-magnifying-glass" />
              <span>Cari Anime</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Lanjutkan Nonton (from localStorage, synced with history-updated) */}
      {historyItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-[var(--primary)] text-base" />
              <h2 className="font-display text-lg font-bold text-[var(--foreground)]">
                Lanjutkan Nonton
              </h2>
            </div>
            <Link
              href="/anime/history"
              className="text-xs font-medium text-[var(--primary)] hover:underline"
            >
              Semua Riwayat
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {historyItems.map((item) => (
              <Link
                key={item.episodeId}
                href={`/anime/watch/${item.episodeId}`}
                className="group relative flex w-60 shrink-0 gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 hover:bg-[var(--accent)] hover:border-[var(--primary)]/40 transition-colors"
              >
                <div className="relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-900">
                  <img
                    src={item.poster}
                    alt={item.animeTitle}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-solid fa-play text-white text-xs" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center min-w-0">
                  <h4 className="truncate text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {item.animeTitle}
                  </h4>
                  <p className="truncate text-[11px] text-[var(--muted-foreground)]">
                    {item.episodeTitle}
                  </p>
                  <span className="mt-1 inline-flex items-center text-[10px] text-[var(--primary)] font-medium">
                    Lanjut nonton →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Content Loading / Error State */}
      {isPending ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-6 w-48 rounded bg-[var(--border)] animate-pulse" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="aspect-[2/3] rounded-xl bg-[var(--border)] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Gagal mengambil katalog anime.'}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {/* Sedang Tayang (Ongoing) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <h2 className="font-display text-lg font-bold text-[var(--foreground)]">
                Sedang Tayang (Ongoing)
              </h2>
              <Link
                href="/anime/ongoing"
                className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <i className="fa-solid fa-chevron-right text-[10px]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {ongoingList.map((anime) => (
                <AnimeCard key={anime.animeId} anime={anime} />
              ))}
            </div>
          </section>

          {/* Baru Tamat (Completed) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-blue-500 text-sm" />
                <h2 className="font-display text-lg font-bold text-[var(--foreground)]">
                  Baru Tamat (Completed)
                </h2>
              </div>
              <Link
                href="/anime/completed"
                className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <i className="fa-solid fa-chevron-right text-[10px]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {completedList.map((anime) => (
                <AnimeCard key={anime.animeId} anime={anime} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
