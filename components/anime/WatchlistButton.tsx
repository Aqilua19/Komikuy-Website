'use client';

import { useSyncExternalStore } from 'react';
import { isInWatchlist, toggleWatchlist, subscribeWatchlist } from '@/lib/anime/watchlist';

export function WatchlistButton({
  animeId,
  title,
  poster,
}: {
  animeId: string;
  title: string;
  poster: string;
}) {
  const saved = useSyncExternalStore(
    subscribeWatchlist,
    () => isInWatchlist(animeId),
    () => false
  );

  return (
    <button
      type="button"
      onClick={() => toggleWatchlist(animeId, title, poster)}
      aria-label={saved ? 'Hapus dari watchlist' : 'Simpan ke watchlist'}
      className={`press-soft inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] shadow-xs transition-colors ${
        saved
          ? 'bg-[var(--secondary)] text-[var(--secondary-foreground)]'
          : 'bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]'
      }`}
    >
      <i className={saved ? 'fa-solid fa-bookmark text-base' : 'fa-regular fa-bookmark text-base'} />
    </button>
  );
}
