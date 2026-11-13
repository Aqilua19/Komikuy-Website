'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChapterDetail, ReaderSettingsType } from '@/types/comic';
import { getReaderSettings, saveReaderSettings } from '@/lib/client/reader-settings';
import { addHistory } from '@/lib/client/history';
import { ReaderToolbar } from './ReaderToolbar';
import { ReaderSettings } from './ReaderSettings';
import { ChapterSelector } from './ChapterSelector';
import { ChevronLeft, ChevronRight, ArrowLeft, CheckCircle2, RotateCw } from 'lucide-react';

export function Reader({ detail }: { detail: ChapterDetail }) {
  const [settings, setSettings] = useState<ReaderSettingsType>(getReaderSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Save history
    addHistory({
      slug: detail.manga_slug,
      title: detail.manga_title,
      poster: null,
      chapter_number: detail.chapter_number,
      chapter_title: detail.chapter_title,
    });
  }, [detail]);

  // Scroll listener for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft' && detail.navigation.prev) {
        window.location.href = `/manga/${detail.manga_slug}/chapter/${detail.navigation.prev.chapter_number}`;
      } else if (e.key === 'ArrowRight' && detail.navigation.next) {
        window.location.href = `/manga/${detail.manga_slug}/chapter/${detail.navigation.next.chapter_number}`;
      } else if (e.key === 'Escape') {
        setShowSettings(false);
        setShowSelector(false);
      }
    },
    [detail]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateSettings = (updated: Partial<ReaderSettingsType>) => {
    const next = saveReaderSettings(updated);
    setSettings(next);
  };

  const getBackgroundClass = () => {
    switch (settings.background) {
      case 'black':
        return 'bg-black text-neutral-100';
      case 'sepia':
        return 'bg-[#f4ecd8] text-[#2c2214]';
      case 'light':
        return 'bg-[#f8f9fa] text-neutral-900';
      default:
        return 'bg-[#0c0d0e] text-neutral-100';
    }
  };

  const getWidthClass = () => {
    switch (settings.imageWidth) {
      case 'compact':
        return 'max-w-[700px]';
      case 'wide':
        return 'max-w-[1100px]';
      case 'full':
        return 'max-w-full px-0';
      default:
        return 'max-w-[880px]';
    }
  };

  const getGapClass = () => {
    switch (settings.pageGap) {
      case 'none':
        return 'gap-0';
      case 'small':
        return 'gap-1';
      case 'large':
        return 'gap-6';
      default:
        return 'gap-2';
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col items-center select-none ${getBackgroundClass()}`}>
      {/* Scroll reading progress bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Top Toolbar */}
      <ReaderToolbar
        mangaTitle={detail.manga_title}
        mangaSlug={detail.manga_slug}
        chapterNumber={detail.chapter_number}
        prevChapter={detail.navigation.prev}
        nextChapter={detail.navigation.next}
        onOpenSettings={() => setShowSettings(true)}
        onOpenSelector={() => setShowSelector(true)}
        visible={toolbarVisible}
      />

      {/* Main Image Column */}
      <div
        className={`w-full flex flex-col items-center mt-14 mb-8 ${getWidthClass()} ${getGapClass()} transition-all duration-200`}
        onClick={() => settings.autoHideControls && setToolbarVisible(!toolbarVisible)}
      >
        {detail.images && detail.images.length > 0 ? (
          detail.images.map((img, idx) => (
            <div
              key={img.order || idx}
              className="relative w-full flex justify-center bg-black/10 min-h-[300px] sm:min-h-[500px]"
            >
              {!failedImages[img.order] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.url}
                  alt={`${detail.manga_title} - Chapter ${detail.chapter_number} - Halaman ${img.order + 1}`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => setFailedImages((prev) => ({ ...prev, [img.order]: true }))}
                  className="w-full h-auto object-contain block"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground gap-3">
                  <p className="text-xs sm:text-sm">Gambar halaman {img.order + 1} tidak dapat dimuat.</p>
                  <button
                    onClick={() => setFailedImages((prev) => ({ ...prev, [img.order]: false }))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated text-foreground rounded-lg text-xs font-semibold hover:bg-border transition-colors border border-border"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Muat Ulang</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-24 text-center text-muted-foreground">
            <p>Halaman gambar untuk chapter ini belum tersedia.</p>
          </div>
        )}

        {/* Section 93: Chapter Transition Card */}
        <div className="w-full max-w-2xl px-4 py-12 flex flex-col items-center text-center gap-6 mt-8 border-t border-border/40">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-foreground">Chapter Selesai</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Kamu telah menyelesaikan {detail.chapter_title || `Chapter ${detail.chapter_number}`} dari {detail.manga_title}.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            {detail.navigation.prev ? (
              <Link
                href={`/manga/${detail.manga_slug}/chapter/${detail.navigation.prev.chapter_number}`}
                className="flex-1 min-w-[130px] py-3 px-4 bg-surface hover:bg-surface-elevated border border-border rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </Link>
            ) : null}

            <Link
              href={`/manga/${detail.manga_slug}`}
              className="py-3 px-5 bg-surface hover:bg-surface-elevated border border-border rounded-xl text-xs sm:text-sm font-semibold transition-all text-foreground shrink-0"
            >
              Detail Komik
            </Link>

            {detail.navigation.next ? (
              <Link
                href={`/manga/${detail.manga_slug}/chapter/${detail.navigation.next.chapter_number}`}
                className="flex-1 min-w-[130px] py-3 px-4 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-95"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex-1 min-w-[130px] py-3 px-4 bg-surface-elevated border border-border rounded-xl text-xs text-muted-foreground font-medium flex items-center justify-center">
                Ini Chapter Terakhir
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <ReaderSettings
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Chapter Selector Modal */}
      {showSelector && (
        <ChapterSelector
          mangaSlug={detail.manga_slug}
          currentChapter={detail.chapter_number}
          chapters={detail.all_chapters || []}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}
