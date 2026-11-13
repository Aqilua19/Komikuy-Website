'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { episodeQuery } from '@/lib/anime/queries';
import type { EpisodeListItem } from '@/lib/anime/anime-types';

export function EpisodeDownloadButton({
  episode,
  batchId,
}: {
  episode: EpisodeListItem;
  batchId?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const { data, isPending, isError } = useQuery({
    ...episodeQuery(episode.episodeId),
    enabled: open,
  });

  const formats = data?.data.downloadUrl?.formats ?? [];
  const hasFormats = formats.length > 0;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        aria-label={`Download Episode ${episode.eps}`}
        className="press-soft flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
      >
        <i className="fa-solid fa-download text-[11px]" />
        <span>Unduh</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />

          {/* Popover dropdown */}
          <div
            className="absolute right-0 bottom-full mb-2 z-50 w-72 max-h-80 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xl animate-in zoom-in-95 duration-150 text-[var(--foreground)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-2">
              <span className="text-xs font-semibold">Unduh Eps {episode.eps}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 text-xs"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {isPending ? (
              <div className="flex items-center justify-center py-6 text-xs text-[var(--muted-foreground)] gap-2">
                <i className="fa-solid fa-circle-notch fa-spin text-sm text-[var(--primary)]" />
                <span>Mengambil link unduhan...</span>
              </div>
            ) : isError || !hasFormats ? (
              <div className="py-4 text-center text-xs space-y-2">
                <p className="text-[var(--muted-foreground)]">Link unduhan belum tersedia.</p>
                {batchId && (
                  <Link
                    href={`/anime/batch/${batchId}`}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1 text-[var(--primary)] font-medium hover:underline"
                  >
                    <i className="fa-solid fa-file-zipper" />
                    <span>Unduh Versi Batch</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {formats.map((fmt, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      {fmt.title}
                    </span>
                    <div className="space-y-1.5 pl-1">
                      {fmt.qualities.map((q, qIdx) => (
                        <div key={qIdx} className="rounded-lg bg-[var(--background)] p-1.5 border border-[var(--border)]">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--foreground)] mb-1">
                            <span>{q.title}</span>
                            {q.size && <span className="text-[10px] text-[var(--muted-foreground)]">{q.size}</span>}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {q.urls.map((u, uIdx) => (
                              <a
                                key={uIdx}
                                href={u.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--secondary-foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
                              >
                                {u.title}
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
          </div>
        </>
      )}
    </div>
  );
}
