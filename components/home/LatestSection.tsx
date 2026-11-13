'use client';

import { useState } from 'react';
import { Comic } from '@/types/comic';
import { ComicCard } from '@/components/comic/ComicCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function LatestSection({ comics }: { comics: Comic[] }) {
  const [filter, setFilter] = useState<'all' | 'manhwa' | 'manga'>('all');

  if (!comics || comics.length === 0) return null;

  const filtered = comics.filter((c) => {
    if (filter === 'all') return true;
    return c.type?.toLowerCase() === filter;
  });

  const displayComics = filtered.slice(0, 12);

  return (
    <section className="mb-12">
      {/* Section Title with Arrow */}
      <div className="flex items-center justify-between mb-3">
        <Link href="/latest" className="group flex items-center gap-1.5">
          <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight group-hover:text-[#00dc64] transition-colors">
            Rilis Terbaru Hari Ini
          </h2>
          <ChevronRight className="w-5 h-5 text-foreground group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'manhwa', label: 'Manhwa' },
          { id: 'manga', label: 'Manga' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === tab.id
                ? 'bg-foreground text-background shadow-sm'
                : 'bg-surface hover:bg-surface-elevated text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2.5 sm:gap-x-3.5 gap-y-4">
        {displayComics.map((comic) => (
          <ComicCard key={comic.slug || comic.id} comic={comic} />
        ))}
      </div>
    </section>
  );
}
