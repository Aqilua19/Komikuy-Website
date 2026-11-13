'use client';

import { ArrowLeft, Settings, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function ReaderToolbar({
  mangaTitle,
  mangaSlug,
  chapterNumber,
  prevChapter,
  nextChapter,
  onOpenSettings,
  onOpenSelector,
  visible,
}: {
  mangaTitle: string;
  mangaSlug: string;
  chapterNumber: string | number;
  prevChapter: any;
  nextChapter: any;
  onOpenSettings: () => void;
  onOpenSelector: () => void;
  visible: boolean;
}) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 bg-background/95 backdrop-blur-md border-b border-border px-4 py-2.5 flex items-center justify-between gap-4 shadow-md ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Link
          href={`/manga/${mangaSlug}`}
          aria-label="Kembali ke detail komik"
          className="p-2 hover:bg-surface-elevated rounded-xl text-foreground transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-bold text-foreground truncate">{mangaTitle}</h2>
          <span className="text-[11px] font-medium text-accent">Chapter {chapterNumber}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onOpenSelector}
          aria-label="Pilih chapter"
          className="px-2.5 py-1.5 hover:bg-surface-elevated rounded-lg text-foreground transition-colors flex items-center gap-1.5 text-xs font-semibold bg-surface border border-border"
        >
          <List className="w-4 h-4 text-accent" />
          <span className="hidden sm:inline">Pilih Chapter</span>
        </button>

        <button
          onClick={onOpenSettings}
          aria-label="Pengaturan pembaca"
          className="p-2 hover:bg-surface-elevated rounded-lg text-foreground transition-colors bg-surface border border-border"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border mx-0.5" />

        {prevChapter ? (
          <Link
            href={`/manga/${mangaSlug}/chapter/${prevChapter.chapter_number}`}
            aria-label="Chapter sebelumnya"
            className="p-2 hover:bg-surface-elevated rounded-lg text-foreground transition-colors bg-surface border border-border"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        ) : (
          <button disabled className="p-2 opacity-30 cursor-not-allowed rounded-lg text-foreground bg-surface border border-border">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {nextChapter ? (
          <Link
            href={`/manga/${mangaSlug}/chapter/${nextChapter.chapter_number}`}
            aria-label="Chapter berikutnya"
            className="p-2 hover:bg-accent hover:text-white rounded-lg text-foreground transition-colors bg-surface border border-border"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <button disabled className="p-2 opacity-30 cursor-not-allowed rounded-lg text-foreground bg-surface border border-border">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
