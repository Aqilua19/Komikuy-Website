'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { genreListQuery } from '@/lib/anime/queries';
import { ErrorState } from '@/components/common/ErrorState';

export default function AnimeGenreListPage() {
  const { data, isPending, isError, error, refetch } = useQuery(genreListQuery());

  const genres = data?.data?.genreList ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Breadcrumb & Title */}
      <div className="space-y-2 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link href="/anime" className="hover:text-[var(--foreground)]">Anime</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">Genre</span>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-[var(--primary)] text-xl" />
            Daftar Genre Anime
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Pilih genre favorit kamu untuk menjelajahi anime berdasarkan kategori.
          </p>
        </div>
      </div>

      {isPending ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 24 }).map((_, idx) => (
            <div key={idx} className="h-14 rounded-xl bg-[var(--border)] animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Gagal memuat daftar genre anime.'}
          onRetry={() => refetch()}
        />
      ) : genres.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--muted-foreground)]">
          Genre anime tidak ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {genres.map((g) => (
            <Link
              key={g.genreId}
              href={`/anime/genre/${g.genreId}?page=1`}
              className="group press-soft flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--primary)]/50 hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all shadow-xs"
            >
              <span className="truncate">{g.title}</span>
              <i className="fa-solid fa-chevron-right text-[10px] text-[var(--muted-foreground)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
