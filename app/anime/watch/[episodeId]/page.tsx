'use client';

import { Suspense, use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { episodeQuery, streamQuery, animeDetailQuery } from '@/lib/anime/queries';
import { saveHistory } from '@/lib/anime/history';
import { VideoPlayer } from '@/components/anime/VideoPlayer';
import { EpisodeDownloadButton } from '@/components/anime/EpisodeDownloadButton';
import { ErrorState } from '@/components/common/ErrorState';

function WatchContent({ params }: { params: Promise<{ episodeId: string }> }) {
  const resolvedParams = use(params);
  const episodeId = resolvedParams.episodeId;

  const episode = useQuery(episodeQuery(episodeId));
  const server = episode.data?.data.server;
  const qualities = useMemo(() => server?.qualities ?? [], [server]);

  const preferredQuality = useMemo(() => {
    return (
      qualities.find((q) => q.title.includes('720') || q.title.includes('1080'))?.title ??
      qualities[0]?.title ??
      ''
    );
  }, [qualities]);

  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const currentQuality = selectedQuality ?? preferredQuality;

  const activeServers = useMemo(() => {
    return qualities.find((q) => q.title === currentQuality)?.serverList ?? [];
  }, [qualities, currentQuality]);

  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const currentServerId = selectedServerId ?? activeServers[0]?.serverId ?? '';

  const [copiedShare, setCopiedShare] = useState(false);

  const stream = useQuery(streamQuery(currentServerId));
  const animeId = episode.data?.data.animeId ?? '';
  const anime = useQuery({ ...animeDetailQuery(animeId), enabled: Boolean(animeId) });

  // Record viewing history
  useEffect(() => {
    if (!episode.data || !anime.data) return;
    saveHistory({
      episodeId,
      animeId: episode.data.data.animeId,
      animeTitle: anime.data.data.title,
      episodeTitle: episode.data.data.title,
      poster: anime.data.data.poster,
      watchedAt: Date.now(),
    });
  }, [episode.data, anime.data, episodeId]);

  if (episode.isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-4 animate-pulse">
        <div className="aspect-video w-full rounded-2xl bg-[var(--border)]" />
        <div className="h-8 w-2/3 rounded bg-[var(--border)]" />
      </div>
    );
  }

  if (episode.isError || !episode.data?.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          message={
            episode.error instanceof Error
              ? episode.error.message
              : 'Gagal memuat episode anime.'
          }
          onRetry={() => episode.refetch()}
        />
      </div>
    );
  }

  const epData = episode.data.data;
  const animeData = anime.data?.data;
  const episodes = animeData?.episodeList ?? [];

  // Sort episodes ascending by eps
  const sortedEpisodes = [...episodes].sort((a, b) => a.eps - b.eps);
  const activeEpisode = episodes.find((ep) => ep.episodeId === episodeId);
  const batchId = animeData?.batch?.batchId ?? null;

  // Stream URL
  const streamUrl = stream.data?.data?.url ?? null;

  // Share handler
  const handleShare = async () => {
    const shareTitle = `${animeData?.title ?? epData.title} - ${epData.title}`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Nonton ${shareTitle} di Komakuy`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled, silent
      }
    }

    if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 py-5 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] truncate">
        <Link href="/anime" className="hover:text-[var(--foreground)]">Anime</Link>
        <span>/</span>
        {animeId && (
          <>
            <Link href={`/anime/${animeId}`} className="hover:text-[var(--foreground)] truncate max-w-[200px]">
              {animeData?.title || 'Detail'}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--foreground)] font-medium truncate">{epData.title}</span>
      </div>

      {/* Video Player */}
      <div className="space-y-3">
        <VideoPlayer
          src={streamUrl}
          isLoading={stream.isPending}
          hasServers={qualities.length > 0 && activeServers.length > 0}
          onRetryServer={() => {
            // Pick next server if available
            const currentIndex = activeServers.findIndex((s) => s.serverId === currentServerId);
            if (currentIndex !== -1 && currentIndex + 1 < activeServers.length) {
              setSelectedServerId(activeServers[currentIndex + 1]?.serverId ?? '');
            } else if (activeServers.length > 1) {
              setSelectedServerId(activeServers[0]?.serverId ?? '');
            }
          }}
        />

        {/* Quality and Server Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
          <div className="space-y-2 flex-1">
            {/* Qualities tabs */}
            {qualities.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-[var(--muted-foreground)] mr-1">
                  Resolusi:
                </span>
                {qualities.map((q) => (
                  <button
                    key={q.title}
                    type="button"
                    onClick={() => {
                      setSelectedQuality(q.title);
                      setSelectedServerId(null);
                    }}
                    className={`press-soft rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      currentQuality === q.title
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs'
                        : 'border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                    }`}
                  >
                    {q.title}
                  </button>
                ))}
              </div>
            )}

            {/* Server tabs */}
            {activeServers.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-[var(--muted-foreground)] mr-1">
                  Server:
                </span>
                {activeServers.map((s) => (
                  <button
                    key={s.serverId}
                    type="button"
                    onClick={() => setSelectedServerId(s.serverId)}
                    className={`press-soft rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      currentServerId === s.serverId
                        ? 'bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--primary)]/40 font-semibold'
                        : 'border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions: Share + Download */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="press-soft flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--accent)]"
            >
              <i className="fa-solid fa-share-nodes text-xs" />
              <span>{copiedShare ? 'Tersalin!' : 'Bagikan'}</span>
            </button>

            {activeEpisode && (
              <EpisodeDownloadButton episode={activeEpisode} batchId={batchId} />
            )}
          </div>
        </div>

        {/* Prev / Next Navigation */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {epData.hasPrevEpisode && epData.prevEpisode ? (
            <Link
              href={`/anime/watch/${epData.prevEpisode.episodeId}`}
              className="press-soft flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
            >
              <i className="fa-solid fa-chevron-left text-[11px]" />
              <span className="hidden sm:inline">Episode Sebelumnya</span>
              <span className="sm:hidden">Prev Ep</span>
            </Link>
          ) : (
            <div />
          )}

          {animeId && (
            <Link
              href={`/anime/${animeId}`}
              className="press-soft flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
            >
              <i className="fa-solid fa-list text-xs" />
              <span className="hidden sm:inline">Daftar Episode</span>
            </Link>
          )}

          {epData.hasNextEpisode && epData.nextEpisode ? (
            <Link
              href={`/anime/watch/${epData.nextEpisode.episodeId}`}
              className="press-soft flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-[var(--primary-foreground)] shadow-xs hover:opacity-90 transition-opacity"
            >
              <span className="hidden sm:inline">Episode Selanjutnya</span>
              <span className="sm:hidden">Next Ep</span>
              <i className="fa-solid fa-chevron-right text-[11px]" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Episode Title & Anime Details Summary */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 shadow-xs space-y-4">
        <div>
          <h1 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)] leading-snug">
            {animeData?.title ?? epData.title}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--primary)] font-medium mt-0.5">
            {epData.title}
          </p>
        </div>

        {/* Anime Summary Row */}
        {animeData && (
          <div className="flex items-center gap-3.5 pt-3 border-t border-[var(--border)]">
            <Link href={`/anime/${animeId}`} className="shrink-0">
              <img
                src={animeData.poster}
                alt={animeData.title}
                referrerPolicy="no-referrer"
                className="h-16 w-11 rounded-lg object-cover bg-neutral-900 border border-[var(--border)]"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/anime/${animeId}`}
                className="font-semibold text-xs sm:text-sm text-[var(--foreground)] hover:text-[var(--primary)] line-clamp-1 transition-colors"
              >
                {animeData.title}
              </Link>
              <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                {animeData.synopsis?.paragraphs?.[0] || 'Tonton episode selengkapnya.'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Link
                  href={`/anime/${animeId}`}
                  className="text-[11px] font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                >
                  Lihat Info Anime Lengkap →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Episodes for quick jumping */}
      {sortedEpisodes.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
            <h3 className="font-display text-base font-bold text-[var(--foreground)] flex items-center gap-2">
              <i className="fa-solid fa-grip text-[var(--primary)] text-sm" />
              Pilih Episode ({sortedEpisodes.length})
            </h3>
            {activeEpisode && (
              <span className="text-xs text-[var(--muted-foreground)]">
                Sedang memutar: <strong>Eps {activeEpisode.eps}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-64 overflow-y-auto pr-1">
            {sortedEpisodes.map((ep) => {
              const isActive = ep.episodeId === episodeId;
              return (
                <Link
                  key={ep.episodeId}
                  href={`/anime/watch/${ep.episodeId}`}
                  className={`press-soft flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all ${
                    isActive
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs scale-105'
                      : 'border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)] text-xs font-medium'
                  }`}
                >
                  <span className="text-[10px] text-[var(--muted-foreground)] leading-none mb-0.5">
                    Ep
                  </span>
                  <span className="text-xs sm:text-sm font-bold leading-tight">
                    {ep.eps}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default function WatchEpisodePage({ params }: { params: Promise<{ episodeId: string }> }) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-[var(--muted-foreground)]">Menyiapkan episode...</div>}>
      <WatchContent params={params} />
    </Suspense>
  );
}
