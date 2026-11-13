'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { readWatchlist, removeFromWatchlist, subscribeWatchlist, getEmptyWatchlist } from '@/lib/anime/watchlist';

export default function AnimeWatchlistPage() {
  const items = useSyncExternalStore(
    subscribeWatchlist,
    readWatchlist,
    getEmptyWatchlist
  );
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Breadcrumb & Title */}
      <div className="space-y-2 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link href="/anime" className="hover:text-[var(--foreground)]">Anime</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">Watchlist</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
              <i className="fa-solid fa-bookmark text-[var(--primary)] text-xl" />
              Watchlist Anime
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Daftar anime yang kamu simpan untuk ditonton nanti. Tersimpan di perangkat ini.
            </p>
          </div>
          {mounted && items.length > 0 && (
            <span className="text-xs text-[var(--muted-foreground)] font-medium">
              {items.length} anime tersimpan
            </span>
          )}
        </div>
      </div>

      {!mounted ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-[var(--border)] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-2xl text-[var(--muted-foreground)]">
            <i className="fa-regular fa-bookmark" />
          </div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">Watchlist Masih Kosong</h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm">
            Kamu belum menyimpan anime apapun. Jelajahi katalog anime dan klik ikon bookmark untuk menyimpannya ke sini.
          </p>
          <Link
            href="/anime"
            className="press-soft inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-[var(--primary-foreground)] shadow-xs hover:opacity-90 transition-opacity"
          >
            <i className="fa-solid fa-tv" />
            <span>Jelajahi Anime</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.animeId}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <Link href={`/anime/${item.animeId}`} className="block relative aspect-[2/3] w-full bg-neutral-900">
                <img
                  src={item.poster}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              </Link>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFromWatchlist(item.animeId)}
                aria-label="Hapus dari watchlist"
                title="Hapus dari watchlist"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/75 text-white/80 hover:text-red-400 flex items-center justify-center backdrop-blur-xs border border-white/10 transition-colors shadow-xs"
              >
                <i className="fa-solid fa-trash text-[11px]" />
              </button>

              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <Link
                  href={`/anime/${item.animeId}`}
                  className="line-clamp-2 text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors"
                >
                  {item.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
