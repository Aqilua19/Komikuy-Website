'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, Calendar, Heart } from 'lucide-react';
import { ChapterSummary } from '@/types/comic';

export function ChapterList({
  mangaSlug,
  chapters,
}: {
  mangaSlug: string;
  chapters: ChapterSummary[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  if (!chapters || chapters.length === 0) {
    return <p className="text-xs text-muted-foreground py-8 text-center">Daftar episode belum tersedia.</p>;
  }

  const filtered = chapters.filter((ch) => {
    const title = ch.title || `Chapter ${ch.chapter_number}`;
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || String(ch.chapter_number).includes(searchQuery);
  });

  const sorted = [...filtered].sort((a, b) => {
    const numA = Number(a.chapter_number) || 0;
    const numB = Number(b.chapter_number) || 0;
    return sortAsc ? numA - numB : numB - numA;
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Search & Sort Controls */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari episode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-[#00dc64]"
          />
        </div>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-surface hover:bg-surface-elevated text-foreground rounded-lg border border-border transition-colors shrink-0"
        >
          <ArrowUpDown className="w-3 h-3 text-[#00dc64]" />
          <span>{sortAsc ? 'Terlama' : 'Terbaru'}</span>
        </button>
      </div>

      {/* Webtoon-style Episode Rows */}
      <div className="flex flex-col divide-y divide-border border border-border rounded-xl bg-surface overflow-hidden">
        {sorted.length === 0 ? (
          <p className="text-xs text-muted-foreground py-10 text-center">Episode tidak ditemukan.</p>
        ) : (
          sorted.map((ch, idx) => (
            <Link
              key={ch.id || idx}
              href={`/manga/${mangaSlug}/chapter/${ch.chapter_number}`}
              className="flex items-center justify-between px-3.5 py-3 hover:bg-surface-elevated transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Episode indicator badge */}
                <div className="w-9 h-9 rounded-lg bg-surface-elevated group-hover:bg-[#00dc64] text-foreground group-hover:text-white font-black text-xs flex items-center justify-center shrink-0 transition-colors">
                  #{ch.chapter_number}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-[#00dc64] transition-colors truncate">
                    {ch.title || `Episode ${ch.chapter_number}`}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                    {ch.release_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {ch.release_date}
                      </span>
                    )}
                    {ch.views && (
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500/20" />
                        {ch.views}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-muted-foreground group-hover:text-[#00dc64] shrink-0 ml-2">
                Baca ›
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
