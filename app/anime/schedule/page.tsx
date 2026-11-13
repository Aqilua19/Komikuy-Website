'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { scheduleQuery } from '@/lib/anime/queries';
import { ErrorState } from '@/components/common/ErrorState';

export default function SchedulePage() {
  const { data, isPending, isError, error, refetch } = useQuery(scheduleQuery());
  const today = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          timeZone: 'Asia/Jakarta',
        }).format(new Date());
      } catch {
        return 'Senin';
      }
    },
    () => null
  );

  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const activeTab = selectedTab ?? today;

  const scheduleList = data?.data ?? [];

  // Find active schedule or fallback to first
  const currentDaySchedule = scheduleList.find(
    (s) => s.day.toLowerCase() === (activeTab || today || '').toLowerCase()
  ) || scheduleList[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Breadcrumb & Header */}
      <div className="space-y-2 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link href="/anime" className="hover:text-[var(--foreground)]">Anime</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">Jadwal Rilis</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
              <i className="fa-solid fa-calendar-days text-[var(--primary)] text-xl" />
              Jadwal Rilis Mingguan
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Waktu rilis episode anime mengikuti zona waktu WIB (Asia/Jakarta).
            </p>
          </div>
          {today && (
            <p className="text-xs font-semibold text-[var(--primary)] self-start">
              Hari ini · {today}
            </p>
          )}
        </div>
      </div>

      {isPending ? (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-9 w-24 rounded-full bg-[var(--border)] animate-pulse shrink-0" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pt-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-[var(--border)] animate-pulse" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Gagal memuat jadwal rilis.'}
          onRetry={() => refetch()}
        />
      ) : scheduleList.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--muted-foreground)]">
          Jadwal belum tersedia saat ini.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Day selection tabs */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-[var(--border)]">
            {scheduleList.map((item) => {
              const isCurrentDay = today && item.day.toLowerCase() === today.toLowerCase();
              const isSelected = activeTab ? item.day.toLowerCase() === activeTab.toLowerCase() : isCurrentDay;

              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setSelectedTab(item.day)}
                  className={`relative shrink-0 px-3.5 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'text-[var(--foreground)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <span>{item.day}</span>
                  {isCurrentDay && (
                    <span className="text-[10px] font-bold text-[var(--primary)]">
                      Hari ini
                    </span>
                  )}
                  <span className="text-[11px] text-[var(--muted-foreground)] tabular-nums">
                    ({item.anime_list?.length ?? 0})
                  </span>
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--primary)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active day anime cards */}
          {currentDaySchedule ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                  <span>Rilis {currentDaySchedule.day}</span>
                  <span className="text-xs font-normal text-[var(--muted-foreground)]">
                    ({currentDaySchedule.anime_list?.length ?? 0} anime)
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {currentDaySchedule.anime_list.map((anime) => (
                  <Link
                    key={anime.slug}
                    href={`/anime/${anime.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-xl bg-[var(--card)] border border-[var(--border)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs border border-white/10">
                          {currentDaySchedule.day}
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <h3
                        className="line-clamp-2 text-xs sm:text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug"
                        title={anime.title}
                      >
                        {anime.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
