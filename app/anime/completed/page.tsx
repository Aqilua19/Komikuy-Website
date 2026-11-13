'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { completedQuery } from '@/lib/anime/queries';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { ErrorState } from '@/components/common/ErrorState';

function CompletedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawPage = searchParams.get('page');
  const page = Math.max(1, Number(rawPage) || 1);

  const { data, isPending, isError, error, refetch } = useQuery(completedQuery(page));

  const animeList = data?.data?.animeList ?? [];
  const pagination = data?.pagination;
  const hasNext = pagination?.hasNextPage ?? (pagination?.totalPages ? page < pagination.totalPages : animeList.length >= 10);
  const totalPages = pagination?.totalPages;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Breadcrumb & Title */}
      <div className="space-y-2 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link href="/anime" className="hover:text-[var(--foreground)]">Anime</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">Anime Tamat</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-blue-500 text-lg" />
            Anime Tamat (Completed)
          </h1>
          <span className="text-xs text-[var(--muted-foreground)]">
            Halaman {page}{totalPages ? ` dari ${totalPages}` : ''}
          </span>
        </div>
      </div>

      {isPending ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 18 }).map((_, idx) => (
            <div key={idx} className="aspect-[2/3] rounded-xl bg-[var(--border)] animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Gagal memuat anime tamat.'}
          onRetry={() => refetch()}
        />
      ) : animeList.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--muted-foreground)]">
          Tidak ada anime tamat ditemukan di halaman ini.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {animeList.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-3 pt-6 pb-10">
            <button
              onClick={() => router.push(`/anime/completed?page=${page - 1}`)}
              disabled={page <= 1}
              className="press-soft flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] disabled:opacity-40 disabled:pointer-events-none hover:bg-[var(--accent)]"
            >
              <i className="fa-solid fa-chevron-left text-[10px]" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs font-medium text-[var(--muted-foreground)] px-2">
              Halaman {page}
            </span>

            <button
              onClick={() => router.push(`/anime/completed?page=${page + 1}`)}
              disabled={!hasNext}
              className="press-soft flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] disabled:opacity-40 disabled:pointer-events-none hover:bg-[var(--accent)]"
            >
              <span>Berikutnya</span>
              <i className="fa-solid fa-chevron-right text-[10px]" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function CompletedPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[var(--muted-foreground)]">Memuat...</div>}>
      <CompletedContent />
    </Suspense>
  );
}
