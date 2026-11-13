'use client';

import { Suspense, use, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { animeDetailQuery } from '@/lib/anime/queries';
import { readHistory, subscribeHistory, getEmptyHistory } from '@/lib/anime/history';
import { WatchlistButton } from '@/components/anime/WatchlistButton';
import { SubscribeButton } from '@/components/anime/SubscribeButton';
import { EpisodeDownloadButton } from '@/components/anime/EpisodeDownloadButton';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { ErrorState } from '@/components/common/ErrorState';

const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450" fill="%231a1a24"><rect width="300" height="450"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="16">No Poster</text></svg>';

function AnimeDetailContent({ params }: { params: Promise<{ animeId: string }> }) {
  const resolvedParams = use(params);
  const animeId = resolvedParams.animeId;

  const { data, isPending, isError, error, refetch } = useQuery(animeDetailQuery(animeId));
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [failedPoster, setFailedPoster] = useState(false);

  const allHistory = useSyncExternalStore(
    subscribeHistory,
    readHistory,
    getEmptyHistory
  );
  const continueItem = allHistory.find((item) => item.animeId === animeId) ?? null;

  const anime = data?.data;
  const posterSrc = failedPoster ? PLACEHOLDER_IMG : anime?.poster || PLACEHOLDER_IMG;

  if (isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 animate-pulse">
        <div className="h-64 sm:h-80 w-full rounded-2xl bg-[var(--border)]" />
        <div className="space-y-4">
          <div className="h-8 w-1/2 rounded bg-[var(--border)]" />
          <div className="h-24 w-full rounded bg-[var(--border)]" />
        </div>
      </div>
    );
  }

  if (isError || !anime) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          message={error instanceof Error ? error.message : 'Gagal memuat detail anime.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const episodes = anime.episodeList ?? [];

  // 7.9 Rule: firstEpisode by smallest eps
  const firstEpisode = episodes.length > 0
    ? episodes.reduce((earliest, episode) => (episode.eps < earliest.eps ? episode : earliest), episodes[0]!)
    : null;

  const continueEpisode = continueItem
    ? episodes.find((episode) => episode.episodeId === continueItem.episodeId)
    : undefined;

  const primaryTarget = continueEpisode ?? firstEpisode;
  const primaryLabel = continueEpisode
    ? `Lanjut Eps ${continueEpisode.eps}`
    : firstEpisode
      ? `Tonton Episode ${firstEpisode.eps}`
      : null;

  const isCompleted = /tamat|complete/i.test(anime.status ?? '');
  const batchId = anime.batch?.batchId ?? null;

  // Filter episodes for list
  const filteredEpisodes = episodeSearch.trim()
    ? episodes.filter((ep) =>
        ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) ||
        String(ep.eps).includes(episodeSearch.trim())
      )
    : episodes;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
        <Link href="/anime" className="hover:text-[var(--foreground)]">Anime</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium truncate">{anime.title}</span>
      </div>

      {/* Hero Section with Backdrop */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-neutral-950 shadow-xl">
        {/* Backdrop image */}
        <div className="absolute inset-0 z-0">
          <img
            src={posterSrc || anime.poster || PLACEHOLDER_IMG}
            alt={anime.title}
            referrerPolicy="no-referrer"
            onError={() => setFailedPoster(true)}
            className="h-full w-full object-cover object-center blur-2xl opacity-25 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/90 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          {/* Poster (2:3 ratio) */}
          <div className="relative aspect-[2/3] w-36 sm:w-48 lg:w-56 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-neutral-900 mx-auto md:mx-0">
            <img
              src={posterSrc || anime.poster || PLACEHOLDER_IMG}
              alt={anime.title}
              referrerPolicy="no-referrer"
              onError={() => setFailedPoster(true)}
              className="h-full w-full object-cover"
            />
            {anime.score && (
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-xs font-bold text-amber-400 backdrop-blur-xs border border-white/10">
                <i className="fa-solid fa-star text-[11px]" />
                <span>{anime.score}</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4 text-center md:text-left min-w-0">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                    isCompleted
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {anime.status || (isCompleted ? 'Completed' : 'Ongoing')}
                </span>
                {anime.type && (
                  <span className="rounded-full bg-[var(--secondary)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--secondary-foreground)]">
                    {anime.type}
                  </span>
                )}
                {anime.episodes && (
                  <span className="rounded-full bg-[var(--secondary)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--secondary-foreground)]">
                    {anime.episodes} Episode
                  </span>
                )}
                {anime.duration && (
                  <span className="rounded-full bg-[var(--secondary)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--secondary-foreground)]">
                    {anime.duration}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight">
                {anime.title}
              </h1>
              {anime.japanese && (
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 italic">
                  {anime.japanese}
                </p>
              )}
            </div>

            {/* Meta Info Grid */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-[var(--muted-foreground)]">
              {anime.studios && (
                <div>
                  <span className="text-[var(--foreground)] font-medium">Studio:</span> {anime.studios}
                </div>
              )}
              {anime.aired && (
                <div>
                  <span className="text-[var(--foreground)] font-medium">Tayang:</span> {anime.aired}
                </div>
              )}
              {anime.views && (
                <div>
                  <span className="text-[var(--foreground)] font-medium">Tayang:</span> {anime.views}
                </div>
              )}
            </div>

            {/* Genre Chips */}
            {anime.genreList && anime.genreList.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-1.5 pt-1">
                {anime.genreList.map((g) => (
                  <Link
                    key={g.genreId}
                    href={`/anime/genre/${g.genreId}?page=1`}
                    className="press-soft rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {g.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-3">
              {primaryTarget && primaryLabel && (
                <Link
                  href={`/anime/watch/${primaryTarget.episodeId}`}
                  className="press-soft inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-[var(--primary-foreground)] shadow-md hover:opacity-90 transition-opacity"
                >
                  <i className="fa-solid fa-play" />
                  <span>{primaryLabel}</span>
                </Link>
              )}

              <WatchlistButton
                animeId={animeId}
                title={anime.title}
                poster={anime.poster}
              />

              <SubscribeButton
                animeId={animeId}
                animeTitle={anime.title}
              />

              {batchId && (
                <Link
                  href={`/anime/batch/${batchId}`}
                  className="press-soft inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
                >
                  <i className="fa-solid fa-file-zipper text-[var(--primary)]" />
                  <span>Batch Download</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis Section (Collapsible) */}
      {anime.synopsis && anime.synopsis.paragraphs && anime.synopsis.paragraphs.length > 0 && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 shadow-xs space-y-3">
          <h2 className="font-display text-base sm:text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
            <i className="fa-solid fa-align-left text-[var(--primary)]" />
            Sinopsis
          </h2>
          <div
            className={`space-y-2.5 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed transition-all ${
              !isSynopsisExpanded ? 'line-clamp-4' : ''
            }`}
          >
            {anime.synopsis.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
          {anime.synopsis.paragraphs.join(' ').length > 250 && (
            <button
              type="button"
              onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
              className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>{isSynopsisExpanded ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya'}</span>
              <i className={`fa-solid fa-chevron-${isSynopsisExpanded ? 'up' : 'down'} text-[10px]`} />
            </button>
          )}
        </section>
      )}

      {/* Episode List Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-list-ol text-[var(--primary)] text-base" />
            <h2 className="font-display text-lg font-bold text-[var(--foreground)]">
              Daftar Episode ({episodes.length})
            </h2>
          </div>

          {episodes.length > 10 && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={episodeSearch}
                onChange={(e) => setEpisodeSearch(e.target.value)}
                placeholder="Cari episode..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-1.5 pl-8 pr-3 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none focus:border-[var(--primary)]"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-[11px] text-[var(--muted-foreground)]" />
            </div>
          )}
        </div>

        {episodes.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--muted-foreground)] rounded-xl border border-[var(--border)] bg-[var(--card)]">
            Episode belum tersedia untuk anime ini.
          </div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--muted-foreground)] rounded-xl border border-[var(--border)] bg-[var(--card)]">
            Tidak ada episode yang cocok dengan pencarian &quot;{episodeSearch}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredEpisodes.map((ep) => {
              const isWatched = continueItem?.episodeId === ep.episodeId;

              return (
                <div
                  key={ep.episodeId}
                  className={`group flex items-center justify-between gap-2 rounded-xl border p-2.5 transition-all ${
                    isWatched
                      ? 'border-[var(--primary)]/40 bg-[var(--primary)]/5'
                      : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)] hover:border-[var(--primary)]/30'
                  }`}
                >
                  <Link
                    href={`/anime/watch/${ep.episodeId}`}
                    className="flex items-center gap-2.5 flex-1 min-w-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] flex items-center justify-center text-xs font-bold shrink-0 transition-colors">
                      {ep.eps}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {ep.title}
                      </h4>
                      {isWatched && (
                        <span className="text-[10px] text-[var(--primary)] font-medium">
                          Terakhir ditonton
                        </span>
                      )}
                    </div>
                  </Link>

                  <EpisodeDownloadButton episode={ep} batchId={batchId} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recommendations Section */}
      {anime.recommendedAnimeList && anime.recommendedAnimeList.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-thumbs-up text-[var(--primary)] text-base" />
            <h2 className="font-display text-lg font-bold text-[var(--foreground)]">
              Rekomendasi Anime Serupa
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {anime.recommendedAnimeList.map((rec) => (
              <AnimeCard key={rec.animeId} anime={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function AnimeDetailPage({ params }: { params: Promise<{ animeId: string }> }) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[var(--muted-foreground)]">Memuat...</div>}>
      <AnimeDetailContent params={params} />
    </Suspense>
  );
}
