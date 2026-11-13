'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { AnimeCardData } from '@/lib/anime/anime-types';
import { FALLBACK_POSTER_URI, sanitizePosterUrl } from '@/lib/ui-formatters';

export function AnimeCard({
  anime,
  priority = false,
}: {
  anime: AnimeCardData;
  priority?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(sanitizePosterUrl(anime.poster));

  const metaParts: string[] = [];
  if (anime.episodes != null && anime.episodes > 0) {
    metaParts.push(`${anime.episodes} Ep`);
  } else if (anime.status) {
    metaParts.push(anime.status);
  }
  if (anime.releaseDay) {
    metaParts.push(anime.releaseDay);
  }
  if (anime.score) {
    metaParts.push(`★ ${anime.score}`);
  }
  const metaLine = metaParts.join(' · ') || 'Anime Sub Indo';

  return (
    <Link
      href={`/anime/${anime.animeId}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-lg"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={anime.title}
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(FALLBACK_POSTER_URI)}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        />
      </div>

      <div className="pt-2 space-y-0.5">
        <h3
          className="line-clamp-2 text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug"
          title={anime.title}
        >
          {anime.title}
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] truncate tabular-nums">
          {metaLine}
        </p>
      </div>
    </Link>
  );
}
