'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

function isDirectSource(url: string) {
  return /\.(m3u8|mp4)(\?|$)/i.test(url);
}

function NativePlayer({
  src,
  onError,
}: {
  src: string;
  onError: (err: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const element = document.createElement('video-js');
    element.classList.add('vjs-big-play-centered', 'h-full', 'w-full');
    containerRef.current.appendChild(element);

    const isHls = src.includes('.m3u8');
    const player = videojs(element, {
      controls: true,
      fluid: false,
      preload: 'auto',
      playsinline: true,
      sources: [
        {
          src,
          type: isHls ? 'application/x-mpegURL' : 'video/mp4',
        },
      ],
    });

    player.on('error', () => {
      const error = player.error();
      onError(error?.message || 'Gagal memutar video dari server ini.');
    });

    playerRef.current = player;

    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, [src, onError]);

  return <div ref={containerRef} className="h-full w-full" data-vjs-player />;
}

export function VideoPlayer({
  src,
  isLoading = false,
  hasServers = true,
  onRetryServer,
}: {
  src: string | null;
  isLoading?: boolean;
  hasServers?: boolean;
  onRetryServer?: () => void;
}) {
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setPlayerError(null);
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)] bg-black shadow-lg">
      {!hasServers ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-sm text-[var(--muted-foreground)]">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <p className="font-medium text-[var(--foreground)]">Server tidak tersedia untuk episode ini</p>
          <p className="text-xs max-w-sm text-[var(--muted-foreground)]">
            Episode ini belum memiliki server video aktif dari penyedia upstream.
          </p>
        </div>
      ) : isLoading || !src ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-[var(--muted-foreground)]">
          <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[var(--primary)]" />
          <span>Menyiapkan pemutar video...</span>
        </div>
      ) : playerError ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-sm text-[var(--muted-foreground)]">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xl">
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <p className="font-medium text-[var(--foreground)]">Server ini gagal diputar, coba server lain</p>
          <p className="text-xs text-[var(--muted-foreground)]">{playerError}</p>
          {onRetryServer && (
            <button
              onClick={onRetryServer}
              className="mt-2 rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] shadow-xs hover:opacity-90"
            >
              Ganti Server Lain
            </button>
          )}
        </div>
      ) : isDirectSource(src) ? (
        <NativePlayer src={src} onError={(err) => setPlayerError(err)} />
      ) : (
        <iframe
          key={src}
          src={src}
          title="Pemutar video"
          className="h-full w-full border-0"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        />
      )}
    </div>
  );
}
