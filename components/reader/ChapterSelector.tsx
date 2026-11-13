'use client';

import { useState } from 'react';
import { X, Search } from 'lucide-react';
import Link from 'next/link';
import { ChapterSummary } from '@/types/comic';

export function ChapterSelector({
  mangaSlug,
  currentChapter,
  chapters,
  onClose,
}: {
  mangaSlug: string;
  currentChapter: string | number;
  chapters: ChapterSummary[];
  onClose: () => void;
}) {
  const [filter, setFilter] = useState('');

  const filtered = (chapters || []).filter((ch) => {
    const title = ch.title || `Chapter ${ch.chapter_number}`;
    return title.toLowerCase().includes(filter.toLowerCase()) || String(ch.chapter_number).includes(filter);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated">
          <h3 className="text-sm font-bold text-foreground">Daftar Chapter</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-border rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search filter input */}
        <div className="p-3 border-b border-border bg-surface">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari chapter (cth: 12)..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 divide-y divide-border/50">
          {filtered.length > 0 ? (
            filtered.map((ch, idx) => {
              const isCurrent = String(ch.chapter_number) === String(currentChapter);
              return (
                <Link
                  key={ch.id || idx}
                  href={`/manga/${mangaSlug}/chapter/${ch.chapter_number}`}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs transition-colors ${
                    isCurrent
                      ? 'bg-accent text-white font-bold'
                      : 'hover:bg-surface-elevated text-foreground font-medium'
                  }`}
                >
                  <span className="truncate">{ch.title || `Chapter ${ch.chapter_number}`}</span>
                  {isCurrent && <span className="text-[10px] uppercase tracking-wider shrink-0 ml-2">Dibaca</span>}
                </Link>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">Chapter tidak ditemukan.</p>
          )}
        </div>
      </div>
    </div>
  );
}
