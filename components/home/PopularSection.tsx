'use client';

import { useState } from 'react';
import { Comic } from '@/types/comic';
import { ComicCard } from '@/components/comic/ComicCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function PopularSection({ comics }: { comics: Comic[] }) {
  const [activeTab, setActiveTab] = useState<'trending' | 'popular'>('trending');

  if (!comics || comics.length === 0) return null;

  // If popular tab is selected, sort or slice slightly differently
  const displayComics = activeTab === 'trending' ? comics.slice(0, 9) : [...comics].reverse().slice(0, 9);

  return (
    <section className="mb-10">
      {/* Section Title with Arrow */}
      <div className="flex items-center justify-between mb-3">
        <Link href="/popular" className="group flex items-center gap-1.5">
          <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight group-hover:text-[#00dc64] transition-colors">
            Serial Trending & Populer
          </h2>
          <ChevronRight className="w-5 h-5 text-foreground group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'trending'
              ? 'bg-foreground text-background shadow-sm'
              : 'bg-surface hover:bg-surface-elevated text-muted-foreground'
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'popular'
              ? 'bg-foreground text-background shadow-sm'
              : 'bg-surface hover:bg-surface-elevated text-muted-foreground'
          }`}
        >
          Populer
        </button>
      </div>

      {/* 3-Column Ranked Grid (matching the Webtoon screenshot) */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2.5 sm:gap-x-3.5 gap-y-4">
        {displayComics.map((comic, idx) => (
          <ComicCard
            key={comic.slug || comic.id}
            comic={comic}
            rank={idx + 1}
            rankDelta={idx === 1 ? -1 : idx === 4 ? 15 : idx % 2 === 0 ? 1 : -1}
          />
        ))}
      </div>
    </section>
  );
}
