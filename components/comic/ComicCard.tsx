'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WebtoonSeries } from '@/lib/comics-data';
import { Comic } from '@/types/comic';
import {
  FALLBACK_POSTER_URI,
  formatComicCardMeta,
  sanitizePosterUrl,
} from '@/lib/ui-formatters';

interface ComicCardProps {
  series?: WebtoonSeries;
  comic?: Comic;
  showUpBadge?: boolean;
  rank?: number;
  rankDelta?: number;
}

export function ComicCard({ series, comic, showUpBadge = true, rank }: ComicCardProps) {
  const title = series?.title || comic?.title || 'Komik';
  const slug = series?.slug || comic?.slug || '';
  const initialPoster = sanitizePosterUrl(series?.poster || comic?.poster);
  const [imgSrc, setImgSrc] = useState(initialPoster);

  const rating = series?.rating || comic?.rating;
  const isUp = series?.isUpToday ?? false;
  const status = series?.status || comic?.status;
  const metaLine = formatComicCardMeta({
    chapter: comic?.last_chapter?.chapter_number,
    type: comic?.type || series?.genres?.[0],
    rating,
    status,
    author: series?.author || comic?.author,
  });

  return (
    <Link
      href={`/series/${slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-lg"
    >
      {/* 2:3 Sharp Poster Cover */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(FALLBACK_POSTER_URI)}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        />

        {/* Single Crisp Corner Indicator: Rank OR UP */}
        {rank !== undefined ? (
          <span
            className={`tabular-nums absolute left-0 top-0 px-2 py-1 text-xs font-extrabold leading-none rounded-br-lg ${
              rank <= 3
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'bg-black/80 text-white'
            }`}
          >
            #{rank}
          </span>
        ) : showUpBadge && isUp ? (
          <span className="absolute left-0 top-0 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide leading-none rounded-br-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
            UP
          </span>
        ) : null}
      </div>

      {/* Unboxed Title & Single-Line Typographic Metadata */}
      <div className="pt-2 space-y-0.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] truncate tabular-nums">
          {metaLine}
        </p>
      </div>
    </Link>
  );
}
