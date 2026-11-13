'use client';

import { Suspense, use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { batchQuery } from '@/lib/anime/queries';
import { ErrorState } from '@/components/common/ErrorState';

function BatchContent({ params }: { params: Promise<{ batchId: string }> }) {
  const resolvedParams = use(params);
  const batchId = resolvedParams.batchId;

  const { data, isPending, isError, error, refetch } = useQuery(batchQuery(batchId));

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4 animate-pulse">
        <div className="h-48 w-full rounded-2xl bg-[var(--border)]" />
        <div className="h-32 w-full rounded-2xl bg-[var(--border)]" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          message={
            error instanceof Error ? error.message : 'Gagal memuat file batch download.'
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const batch = data.data;
  const formats = batch.downloadUrl?.formats ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
        <Link href="/anime" className="hover:text-[var(--foreground)]">Anime</Link>
        <span>/</span>
        {batch.animeId && (
          <>
            <Link href={`/anime/${batch.animeId}`} className="hover:text-[var(--foreground)]">
              Detail Anime
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--foreground)] font-medium">Batch Download</span>
      </div>

      {/* Header Info Card */}
      <div className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs items-start">
        {batch.poster && (
          <img
            src={batch.poster}
            alt={batch.title}
            referrerPolicy="no-referrer"
            className="w-24 sm:w-28 aspect-[2/3] object-cover rounded-xl bg-neutral-900 border border-[var(--border)] shrink-0"
          />
        )}
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)] border border-[var(--primary)]/20">
            <i className="fa-solid fa-file-zipper" />
            <span>Paket Batch Episode Lengkap</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">
            {batch.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)] pt-1">
            {batch.type && <span>Tipe: {batch.type}</span>}
            {batch.episodes && <span>Total: {batch.episodes} Episode</span>}
            {batch.duration && <span>Durasi: {batch.duration}</span>}
            {batch.score && <span>Skor: {batch.score}</span>}
          </div>

          {batch.animeId && (
            <div className="pt-2">
              <Link
                href={`/anime/${batch.animeId}`}
                className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
              >
                ← Kembali ke halaman anime
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Download Formats & Links */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
          <i className="fa-solid fa-download text-[var(--primary)] text-base" />
          <h2 className="font-display text-lg font-bold text-[var(--foreground)]">
            Pilihan Unduhan Batch
          </h2>
        </div>

        {formats.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--muted-foreground)] rounded-xl border border-[var(--border)] bg-[var(--card)]">
            Tautan batch download belum tersedia untuk judul ini.
          </div>
        ) : (
          <div className="space-y-4">
            {formats.map((fmt, fIdx) => (
              <div
                key={fIdx}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <h3 className="font-semibold text-sm text-[var(--foreground)] uppercase tracking-wider">
                    Format: {fmt.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {fmt.qualities.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="rounded-xl bg-[var(--background)] p-3 border border-[var(--border)] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--foreground)]">
                          {q.title}
                        </span>
                        {q.size && (
                          <span className="text-[11px] font-medium text-[var(--muted-foreground)] bg-[var(--card)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                            {q.size}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {q.urls.map((u, uIdx) => (
                          <a
                            key={uIdx}
                            href={u.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="press-soft inline-flex items-center gap-1 rounded-lg bg-[var(--secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--secondary-foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors shadow-xs"
                          >
                            <i className="fa-solid fa-cloud-arrow-down text-[11px]" />
                            <span>{u.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function BatchDownloadPage({ params }: { params: Promise<{ batchId: string }> }) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[var(--muted-foreground)]">Memuat paket batch...</div>}>
      <BatchContent params={params} />
    </Suspense>
  );
}
