'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  List,
  Share2,
  X,
  Check,
  Settings2,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { WebtoonSeries } from '@/lib/comics-data';

export interface PanelImage {
  order: number;
  url: string;
  fallback_url?: string;
  alt?: string;
}

export interface WebtoonViewerProps {
  series: WebtoonSeries;
  episodeNumber: number | string;
  episodeTitle: string;
  panels: PanelImage[];
  prevEpisodeNum: number | string | null;
  nextEpisodeNum: number | string | null;
  allChapters?: { chapter_number: number | string; title: string; url?: string }[];
}

function PanelItem({
  panel,
  idx,
  seriesTitle,
}: {
  panel: PanelImage;
  idx: number;
  seriesTitle: string;
}) {
  const [src, setSrc] = useState(panel.url);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleImageError = () => {
    if (panel.fallback_url && src !== panel.fallback_url) {
      setSrc(panel.fallback_url);
    } else {
      setHasError(true);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setSrc(`${panel.url}${panel.url.includes('?') ? '&' : '?'}retry=${Date.now()}`);
    setRetryKey((k) => k + 1);
  };

  if (hasError) {
    return (
      <div className="w-full py-12 px-4 bg-zinc-900/80 text-center flex flex-col items-center justify-center border-y border-zinc-800 my-1">
        <p className="text-zinc-400 text-xs sm:text-sm mb-3">
          Gambar panel #{idx + 1} gagal dimuat dari CDN.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRetry}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
          <a
            href={panel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka Link</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-transparent flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`${src}-${retryKey}`}
        src={src}
        alt={panel.alt || `${seriesTitle} - Gambar ${idx + 1}`}
        loading={idx < 3 ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={handleImageError}
        className="w-full h-auto block select-none pointer-events-none transition-opacity duration-150"
      />
    </div>
  );
}

export function WebtoonViewer({
  series,
  episodeNumber,
  episodeTitle,
  panels,
  prevEpisodeNum,
  nextEpisodeNum,
  allChapters,
}: WebtoonViewerProps) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1284);
  const [chapterSheetOpen, setChapterSheetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  // Reader Preferences
  const [readerWidth, setReaderWidth] = useState<'normal' | 'wide' | 'full'>('normal');
  const [readerTheme, setReaderTheme] = useState<'dark' | 'black' | 'light' | 'sepia'>('dark');

  const lastScrollY = useRef(0);

  // Save to reading history in localStorage
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('komakatsu_reading_history') || '[]');
      const filtered = history.filter((h: any) => h.slug !== series.slug);
      const record = {
        slug: series.slug,
        title: series.title,
        poster: series.poster,
        chapter_number: episodeNumber,
        chapter_title: episodeTitle,
        timestamp: Date.now(),
      };
      localStorage.setItem('komakatsu_reading_history', JSON.stringify([record, ...filtered]));
    } catch {
      // ignore
    }
  }, [series, episodeNumber, episodeTitle]);

  // Handle auto-hide header and bottom bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentY / docHeight) * 100));
        setScrollProgress(progress);
      }

      if (currentY > 60) {
        if (currentY > lastScrollY.current + 10) {
          setControlsVisible(false);
        } else if (currentY < lastScrollY.current - 10) {
          setControlsVisible(true);
        }
      } else {
        setControlsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleControls = () => {
    setControlsVisible((prev) => !prev);
  };

  const handleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  // Compute container classes based on reader preferences
  const widthClasses = {
    normal: 'max-w-[760px]',
    wide: 'max-w-[920px]',
    full: 'max-w-full',
  }[readerWidth];

  const themeClasses = {
    dark: 'bg-[#121212] text-zinc-100',
    black: 'bg-[#000000] text-zinc-100',
    light: 'bg-[#ffffff] text-zinc-900',
    sepia: 'bg-[#fbf0d9] text-[#2d241e]',
  }[readerTheme];

  const chaptersList = allChapters && allChapters.length > 0
    ? allChapters
    : (series.episodes || []).map((e) => ({
        chapter_number: e.chapter_number,
        title: e.title,
        url: `/series/${series.slug}/episode/${e.chapter_number}`,
      }));

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-200 select-none`}>
      {/* Scroll Progress Bar at very top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Auto-Hiding Top Header (48px) */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-[48px] bg-black/90 backdrop-blur-md border-b border-zinc-800 transition-transform duration-200 flex items-center justify-between px-3 md:px-6 text-white ${
          controlsVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Left: Back button + Series Title */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={`/series/${series.slug}`}
            aria-label="Kembali ke detail series"
            className="w-8 h-8 flex items-center justify-center rounded-[4px] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-[14px] font-bold truncate max-w-[150px] sm:max-w-[280px]">
            {series.title}
          </span>
        </div>

        {/* Center: Episode Title */}
        <div className="hidden sm:block text-[13px] font-medium text-zinc-400 truncate max-w-[240px] text-center">
          {episodeTitle}
        </div>

        {/* Right: Quick Chapter Sheet & Settings */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="Pengaturan baca"
            className="w-8 h-8 flex items-center justify-center rounded-[4px] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChapterSheetOpen(true)}
            aria-label="Daftar chapter"
            className="w-8 h-8 flex items-center justify-center rounded-[4px] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            aria-label="Bagikan chapter"
            className="w-8 h-8 flex items-center justify-center rounded-[4px] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Reading Column */}
      <main
        className={`w-full ${widthClasses} mx-auto min-h-screen pt-[48px] pb-24 shadow-sm`}
        onClick={toggleControls}
      >
        {/* Zero-gap continuous vertical image reader */}
        <div className="w-full flex flex-col items-center">
          {panels.length > 0 ? (
            panels.map((panel, idx) => (
              <PanelItem
                key={`${panel.url}-${panel.order ?? idx}`}
                panel={panel}
                idx={idx}
                seriesTitle={series.title}
              />
            ))
          ) : (
            <div className="py-24 text-center text-zinc-500">
              <p className="text-sm">Gambar chapter sedang dimuat atau tidak tersedia.</p>
            </div>
          )}
        </div>

        {/* End of Episode Block */}
        <div
          className="p-5 sm:p-8 border-t border-zinc-800 mt-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Episode Complete Banner */}
          <div className="py-4 mb-6 border-b border-zinc-800">
            <span className="text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider">
              Akhir Dari Chapter {episodeNumber}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-1">
              {episodeTitle}
            </h2>
            <p className="text-[13px] opacity-70 mt-1">
              Disukai oleh {likeCount.toLocaleString()} pembaca
            </p>
          </div>

          {/* Primary Action: Next Episode Button */}
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            {nextEpisodeNum !== null && nextEpisodeNum !== undefined ? (
              <Link
                href={`/series/${series.slug}/episode/${nextEpisodeNum}`}
                className="h-[46px] w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[15px] font-bold rounded-[6px] flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Chapter Berikutnya (#{nextEpisodeNum})</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <div className="p-3 text-center bg-zinc-900/60 text-zinc-400 text-[13px] font-medium rounded-[6px] border border-zinc-800">
                Kamu telah membaca chapter terbaru!
              </div>
            )}

            {/* Like and Share Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex-1 h-[42px] border rounded-[6px] text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isLiked
                    ? 'border-rose-500 text-rose-500 bg-rose-500/10'
                    : 'border-zinc-800 hover:bg-zinc-800/60'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                <span>{isLiked ? 'Disukai' : 'Suka'} ({likeCount})</span>
              </button>

              <button
                onClick={handleShare}
                className="flex-1 h-[42px] border border-zinc-800 rounded-[6px] text-[13px] font-semibold hover:bg-zinc-800/60 flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Auto-Hiding Floating Bottom Bar */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 h-[52px] bg-black/90 backdrop-blur-md border-t border-zinc-800 transition-transform duration-200 flex items-center justify-between px-3 md:px-8 text-white ${
          controlsVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Prev Episode Button */}
        {prevEpisodeNum !== null && prevEpisodeNum !== undefined ? (
          <Link
            href={`/series/${series.slug}/episode/${prevEpisodeNum}`}
            aria-label="Chapter sebelumnya"
            className="flex items-center gap-1 px-3 py-1.5 rounded-[4px] text-[13px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </Link>
        ) : (
          <span className="px-3 py-1.5 text-[13px] text-zinc-600 flex items-center gap-1 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </span>
        )}

        {/* Center Actions: List, Like, Comments */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setChapterSheetOpen(true)}
            aria-label="Daftar chapter"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[13px] font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <List className="w-4 h-4" />
            <span className="text-[12px]">Ch. {episodeNumber}</span>
          </button>

          <button
            onClick={handleLike}
            aria-label="Sukai chapter ini"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[13px] font-semibold transition-colors ${
              isLiked ? 'text-rose-500' : 'text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span className="text-[12px]">{likeCount}</span>
          </button>
        </div>

        {/* Next Episode Button */}
        {nextEpisodeNum !== null && nextEpisodeNum !== undefined ? (
          <Link
            href={`/series/${series.slug}/episode/${nextEpisodeNum}`}
            aria-label="Chapter berikutnya"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-[4px] text-[13px] font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="px-3.5 py-1.5 text-[13px] text-zinc-600 flex items-center gap-1 cursor-not-allowed">
            <span className="hidden sm:inline">Terbaru</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </footer>

      {/* Reader Settings Modal */}
      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="w-full max-w-[420px] bg-zinc-900 rounded-t-[12px] sm:rounded-[8px] border border-zinc-800 p-5 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <h3 className="text-[15px] font-bold">Pengaturan Pembaca</h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lebar Baca */}
            <div className="mb-5">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block mb-2">
                Lebar Tampilan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'wide', 'full'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setReaderWidth(w)}
                    className={`py-2 text-xs font-semibold rounded capitalize border transition-colors ${
                      readerWidth === w
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                        : 'border-zinc-800 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {w === 'normal' ? 'Standar' : w === 'wide' ? 'Lebar' : 'Penuh'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tema Latar */}
            <div>
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block mb-2">
                Warna Latar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'dark', label: 'Gelap', bg: 'bg-[#121212]' },
                  { id: 'black', label: 'Pekat', bg: 'bg-[#000000]' },
                  { id: 'sepia', label: 'Sepia', bg: 'bg-[#fbf0d9] text-zinc-900' },
                  { id: 'light', label: 'Terang', bg: 'bg-[#ffffff] text-zinc-900' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setReaderTheme(t.id as any)}
                    className={`py-2 text-xs font-semibold rounded border transition-colors ${t.bg} ${
                      readerTheme === t.id
                        ? 'ring-2 ring-[var(--accent)] border-transparent'
                        : 'border-zinc-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Drawer */}
      {chapterSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setChapterSheetOpen(false)}
        >
          <div
            className="w-full max-w-[500px] max-h-[75vh] bg-zinc-900 rounded-t-[12px] sm:rounded-[8px] border border-zinc-800 flex flex-col overflow-hidden text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <h3 className="text-[14px] font-bold">
                Daftar Chapter ({chaptersList.length})
              </h3>
              <button
                onClick={() => setChapterSheetOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800 p-2">
              {chaptersList.map((ch: any) => {
                const isCurrent = String(ch.chapter_number) === String(episodeNumber);
                const targetUrl = ch.url || `/series/${series.slug}/episode/${ch.chapter_number}`;
                return (
                  <Link
                    key={ch.id || ch.chapter_number}
                    href={targetUrl}
                    onClick={() => setChapterSheetOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-[4px] transition-colors ${
                      isCurrent
                        ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-bold'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[12px] opacity-60 w-12 flex-shrink-0">
                        Ch. {ch.chapter_number}
                      </span>
                      <span className="text-[13px] truncate">{ch.title}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[var(--accent)] text-white rounded-[2px]">
                        Dibaca
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
