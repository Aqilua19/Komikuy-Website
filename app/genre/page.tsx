'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComicCard } from '@/components/comic/ComicCard';
import { WEBTOON_SERIES, WebtoonSeries } from '@/lib/comics-data';

const GENRES = [
  'Semua',
  'Aksi',
  'Fantasi',
  'Romansa',
  'Drama',
  'Komedi',
  'Thriller',
  'Olahraga',
  'Supranatural',
  'Isekai',
  'Kehidupan Sekolah',
];

type SortType = 'popular' | 'latest' | 'likes';

function GenreContent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('g') || 'Semua';

  const [activeGenre, setActiveGenre] = useState<string>(
    GENRES.includes(initialGenre) ? initialGenre : 'Semua'
  );
  const [sortBy, setSortBy] = useState<SortType>('popular');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [loadingMore, setLoadingMore] = useState(false);

  const filtered = useMemo(() => {
    let list: WebtoonSeries[] = [...WEBTOON_SERIES];

    if (activeGenre !== 'Semua') {
      list = list.filter((s) => s.genres.includes(activeGenre));
    }

    if (sortBy === 'popular') {
      list.sort((a, b) => a.rankToday - b.rankToday);
    } else if (sortBy === 'latest') {
      list.sort((a, b) => (b.isUpToday ? 1 : 0) - (a.isUpToday ? 1 : 0));
    } else if (sortBy === 'likes') {
      list.sort((a, b) => parseFloat(b.likes.replace(',', '.')) - parseFloat(a.likes.replace(',', '.')));
    }

    return list;
  }, [activeGenre, sortBy]);

  const displayed = filtered.slice(0, visibleCount);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setLoadingMore(false);
    }, 400);
  };

  return (
    <div className="w-full">
      {/* Scrollable Genre Chips */}
      <div className="border-b border-[var(--border)] pb-3 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {GENRES.map((g) => {
            const isActive = activeGenre === g;
            return (
              <button
                key={g}
                onClick={() => {
                  setActiveGenre(g);
                  setVisibleCount(12);
                }}
                className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-full whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                  isActive
                    ? 'bg-[var(--text)] text-[var(--bg)] shadow-sm'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls & Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-[13px] text-[var(--text-muted)]">
          Menampilkan <span className="font-semibold text-[var(--text)]">{filtered.length}</span> judul
          {activeGenre !== 'Semua' && ` genre ${activeGenre}`}
        </p>

        {/* Sort Segmented Control */}
        <div className="flex items-center bg-[var(--bg-subtle)] p-0.5 rounded-[6px] border border-[var(--border)] self-start sm:self-auto">
          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1 text-[12px] font-semibold rounded-[4px] transition-colors ${
              sortBy === 'popular'
                ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Populer
          </button>
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1 text-[12px] font-semibold rounded-[4px] transition-colors ${
              sortBy === 'latest'
                ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Terbaru
          </button>
          <button
            onClick={() => setSortBy('likes')}
            className={`px-3 py-1 text-[12px] font-semibold rounded-[4px] transition-colors ${
              sortBy === 'likes'
                ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Like Terbanyak
          </button>
        </div>
      </div>

      {/* Comic Grid */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayed.map((item) => (
            <ComicCard key={item.id} series={item} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-subtle)] rounded-[6px]">
          <p className="text-[14px]">Tidak ada komik ditemukan untuk genre {activeGenre}.</p>
        </div>
      )}

      {/* Skeletons while loading more or "Muat lebih banyak" */}
      {visibleCount < filtered.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--text)] text-[13px] font-semibold rounded-[6px] transition-colors border border-[var(--border)] disabled:opacity-50"
          >
            {loadingMore ? 'Memuat komik...' : 'Muat Lebih Banyak'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function GenrePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text)]">
            Eksplorasi Genre
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Temukan ribuan chapter webtoon terbaik berdasarkan genre favoritmu.
          </p>
        </div>

        <Suspense fallback={<div className="py-12 text-center text-[var(--text-muted)]">Memuat daftar genre...</div>}>
          <GenreContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
