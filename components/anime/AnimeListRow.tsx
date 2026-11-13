'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { AnimeCardData } from '@/lib/anime/anime-types';

const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450" fill="%231a1a24"><rect width="300" height="450"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="16">No Poster</text></svg>';

export function AnimeListRow({ anime }: { anime: AnimeCardData }) {
  const [imgSrc, setImgSrc] = useState(anime.poster || PLACEHOLDER_IMG);

  // Meta rule for search rows: status ?? latestReleaseDate ?? releaseDay
  const metaText = anime.status ?? anime.latestReleaseDate ?? anime.releaseDay ?? null;

  return (
    <Link
      href={`/anime/${anime.animeId}`}
      className="group flex gap-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 transition-all hover:bg-[var(--accent)] hover:border-[var(--primary)]/40 hover:shadow-md"
    >
      <div className="relative aspect-[2/3] w-20 sm:w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-white/5">
        <img
          src={imgSrc}
          alt={anime.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(PLACEHOLDER_IMG)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {anime.score && (
          <div className="absolute top-1 left-1 flex items-center gap-0.5 rounded bg-black/80 px-1 py-0.5 text-[10px] font-bold text-amber-400">
            <i className="fa-solid fa-star text-[9px]" />
            <span>{anime.score}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div className="space-y-1.5">
          <h4 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug">
            {anime.title}
          </h4>

          {metaText && (
            <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              <span>{metaText}</span>
              {anime.episodes ? ` • ${anime.episodes} Episode` : ''}
            </p>
          )}

          {anime.genreList && anime.genreList.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {anime.genreList.slice(0, 3).map((g) => (
                <span
                  key={g.genreId}
                  className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--secondary-foreground)]"
                >
                  {g.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center text-xs font-medium text-[var(--primary)] pt-2">
          <span>Tonton Anime</span>
          <i className="fa-solid fa-chevron-right ml-1 text-[10px] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
