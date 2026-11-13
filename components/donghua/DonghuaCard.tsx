'use client';

import { useState } from 'react';
import Link from 'next/link';
import { donghuaHref } from '@/lib/donghua/client';
import { FALLBACK_POSTER_URI, sanitizePosterUrl } from '@/lib/ui-formatters';

export interface DonghuaCardItem {
  title: string;
  type?: string;
  headline?: string;
  status?: string;
  eps?: number | null;
  thumbnail: string;
  slug: string;
}

export function DonghuaCard({ card, priority = false }: { card: DonghuaCardItem; priority?: boolean }) {
  const [imgSrc, setImgSrc] = useState(sanitizePosterUrl(card.thumbnail));
  const href = donghuaHref(card.slug);

  const metaParts: string[] = [];
  if (card.eps != null) metaParts.push(`Ep ${card.eps}`);
  if (card.status) metaParts.push(card.status);
  if (card.type) metaParts.push(card.type);
  const metaLine = metaParts.join(' · ') || 'Donghua';

  return (
    <Link
      href={href}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-lg"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={card.title || card.headline || 'Donghua Poster'}
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(FALLBACK_POSTER_URI)}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        />
      </div>

      <div className="pt-2 space-y-0.5">
        <h3 className="line-clamp-2 text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug">
          {card.title || card.headline}
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] truncate tabular-nums">
          {metaLine}
        </p>
      </div>
    </Link>
  );
}
