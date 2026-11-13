'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { searchQuery } from '@/lib/anime/queries';
import { AnimeListRow } from '@/components/anime/AnimeListRow';
import { ErrorState } from '@/components/common/ErrorState';

function SearchAnimeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') ?? '';
  const [prevQuery, setPrevQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  if (initialQuery !== prevQuery) {
    setPrevQuery(initialQuery);
    setSearchTerm(initialQuery);
  }

  const activeTerm = initialQuery.trim();
  const { data, isPending, isError, error, refetch } = useQuery({
    ...searchQuery(activeTerm),
    enabled: activeTerm.length > 0,
  });

  const animeList = data?.data?.animeList ?? [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchTerm.trim();
    if (!clean) return;
    router.push(`/anime/search?q=${encodeURIComponent(clean)}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* Breadcrumb & Title */}
      <div className="space-y-2 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link href="/anime" className="hover:text-[var(--foreground)]">Anime</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">Pencarian</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <i className="fa-solid fa-magnifying-glass text-[var(--primary)] text-lg" />
          Pencarian Anime
        </h1>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari judul anime (contoh: Naruto, Solo Leveling, Bleach)..."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-3 pl-11 pr-24 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] shadow-xs outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
        />
        <i className="fa-solid fa-magnifying-glass absolute left-4 text-sm text-[var(--muted-foreground)]" />
        <button
          type="submit"
          className="press-soft absolute right-2 rounded-lg bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] shadow-xs hover:opacity-90"
        >
          Cari
        </button>
      </form>

      {/* States */}
      {!activeTerm ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] mb-3">
            <i className="fa-solid fa-film text-xl" />
          </div>
          <p className="text-sm font-medium text-[var(--foreground)]">Ketik judul anime untuk mulai mencari</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Mencari anime ongoing, tamat, dan movie dari database.
          </p>
        </div>
      ) : isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-28 rounded-xl bg-[var(--border)] animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Gagal mencari anime.'}
          onRetry={() => refetch()}
        />
      ) : animeList.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)]">
            <i className="fa-solid fa-circle-question text-xl" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Tidak ada hasil ditemukan</h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
            Tidak dapat menemukan anime dengan kata kunci &quot;{activeTerm}&quot;. Coba gunakan ejaan lain atau judul alternatif.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span>
              Ditemukan <strong className="text-[var(--foreground)]">{animeList.length}</strong> anime untuk &quot;{activeTerm}&quot;
            </span>
          </div>

          <div className="space-y-3">
            {animeList.map((anime) => (
              <AnimeListRow key={anime.animeId} anime={anime} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchAnimePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[var(--muted-foreground)]">Memuat...</div>}>
      <SearchAnimeContent />
    </Suspense>
  );
}
