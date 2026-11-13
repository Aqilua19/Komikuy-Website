'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { EpisodeResult } from '@/lib/donghua';

export default function DonghuaWatchClient({ episode }: { episode: EpisodeResult }) {
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const currentServer = episode.players[activeServerIndex] || episode.players[0];

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-2xl">
        {currentServer?.url ? (
          <iframe
            key={currentServer.url}
            src={currentServer.url}
            allowFullScreen
            referrerPolicy="no-referrer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="h-full w-full border-0"
            title={currentServer.name || 'Donghua Player'}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-xs text-[var(--muted-foreground)]">
            <i className="fa-solid fa-triangle-exclamation text-2xl text-amber-500" />
            <p className="font-medium text-[var(--foreground)]">Server video tidak tersedia untuk episode ini.</p>
          </div>
        )}
      </div>

      {/* Server Controls */}
      {episode.players.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[var(--muted-foreground)] mr-1 flex items-center gap-1.5">
              <i className="fa-solid fa-server text-[var(--primary)]" /> Pilih Server:
            </span>
            {episode.players.map((p, idx) => (
              <button
                key={`${p.name}-${idx}`}
                type="button"
                onClick={() => setActiveServerIndex(idx)}
                className={`press-soft rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeServerIndex === idx
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
                    : 'border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {currentServer?.url && (
            <a
              href={currentServer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="press-soft inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" />
              <span>Buka Player Eksternal</span>
            </a>
          )}
        </div>
      )}

      {/* Episode Title & Details */}
      <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-extrabold tracking-tight">{episode.name}</h1>
            {episode.rating && (
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 mt-1">
                <i className="fa-solid fa-star" />
                <span>{episode.rating}</span>
              </div>
            )}
          </div>

          {episode.root && episode.root !== 'unknown' && (
            <Link
              href={`/donghua/series/${episode.root}`}
              className="press-soft inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold hover:bg-[var(--accent)] transition-colors self-start sm:self-center"
            >
              <i className="fa-solid fa-list text-xs" />
              <span>Semua Episode</span>
            </Link>
          )}
        </div>

        {episode.genre && episode.genre.length > 0 && (
          <p className="text-xs font-semibold text-[var(--primary)]">
            {episode.genre.join(' · ')}
          </p>
        )}

        {episode.sinopsis && (
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed pt-2 border-t border-[var(--border)]">
            {episode.sinopsis}
          </p>
        )}
      </div>

      {/* Other Episodes List */}
      {episode.episode.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="font-display text-lg font-bold tracking-tight border-b border-[var(--border)] pb-3">
            Pilih Episode Lain
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {episode.episode.map((ep) => (
              <Link
                key={ep.slug}
                href={`/donghua/watch/${ep.slug}`}
                className="press-soft flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 hover:border-[var(--primary)] hover:bg-[var(--accent)] transition-colors shadow-xs"
              >
                <div className="w-12 h-16 rounded-lg bg-neutral-900 shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ep.thumbnail || episode.thumbnail || ''} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-xs font-bold text-[var(--foreground)] truncate">Ep {ep.episode}: {ep.subtitle || 'Episode'}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">{ep.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
