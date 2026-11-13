'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FALLBACK_POSTER_URI, sanitizePosterUrl } from '@/lib/ui-formatters';

interface MediaListRowProps {
  href: string;
  poster: string | null;
  title: string;
  subtitle?: string | null;
  rating?: string | number | null;
  tag?: string | null;
}

export function MediaListRow({
  href,
  poster,
  title,
  subtitle,
  rating,
  tag,
}: MediaListRowProps) {
  const [imgSrc, setImgSrc] = useState(sanitizePosterUrl(poster));

  const metaParts: string[] = [];
  if (tag) metaParts.push(tag);
  if (rating) {
    metaParts.push(`★ ${typeof rating === 'number' ? rating.toFixed(1) : rating}`);
  }
  const metaLine = metaParts.join(' · ');

  return (
    <Link
      href={href}
      className="press-soft flex items-center gap-3.5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 hover:bg-[var(--accent)] transition-colors group"
    >
      <div className="relative h-20 w-14 rounded-md overflow-hidden bg-[var(--muted)] shrink-0 border border-[var(--border)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(FALLBACK_POSTER_URI)}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <h3 className="line-clamp-2 text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-[var(--muted-foreground)] truncate">
            {subtitle}
          </p>
        )}
        {metaLine && (
          <p className="text-xs text-[var(--muted-foreground)] tabular-nums">
            {metaLine}
          </p>
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] shrink-0" />
    </Link>
  );
}
