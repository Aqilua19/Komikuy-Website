'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { WEBTOON_SERIES } from '@/lib/comics-data';
import { KOMAKUY_LOGO_URL, sanitizePosterUrl, FALLBACK_POSTER_URI } from '@/lib/ui-formatters';
import { AlertCircle } from 'lucide-react';

const SHOWCASE_COVERS = WEBTOON_SERIES.slice(0, 6);

export default function LoginPage() {
  const { signInWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message.includes('popup-closed-by-user')
            ? 'Proses login ditutup sebelum selesai. Silakan coba lagi.'
            : err.message
          : 'Gagal masuk dengan akun Google.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--background)] text-[var(--foreground)] transition-colors">
      {/* Top Bar */}
      <header className="w-full border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={KOMAKUY_LOGO_URL}
              alt="Komakuy"
              referrerPolicy="no-referrer"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display text-lg font-extrabold tracking-tight text-[var(--foreground)]">
              Komakuy
            </span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Editorial 2-Column Split Portal */}
      <main className="flex-1 flex items-center py-6 lg:py-8">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Sign-In & Editorial Copy */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[var(--primary)] tracking-wide">
                Komik · Anime · Donghua Sub Indo
              </p>

              <h1
                className="font-display font-extrabold tracking-tight text-[var(--foreground)] leading-[1.12]"
                style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)', textWrap: 'balance' }}
              >
                Masuk ke ruang baca dan tontonan Komakuy.
              </h1>

              <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed max-w-md">
                Lanjutkan chapter terakhir, simpan seri favorit, dan tonton update episode anime serta donghua terbaru dalam satu akun terpadu.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-500 flex items-start gap-2.5 leading-snug"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 pt-1 max-w-sm">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || !!user}
                className="press-soft w-full min-h-[48px] flex items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 py-3 px-5 font-semibold text-sm transition-opacity disabled:opacity-60 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Menghubungkan ke Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Masuk dengan Google</span>
                  </>
                )}
              </button>

              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Gunakan akun Google untuk sinkronisasi riwayat baca dan daftar simpanan lintas perangkat via Firebase Authentication.
              </p>
            </div>
          </div>

          {/* Right Column: Curated Comic Cover Mosaic */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:max-w-[540px] lg:ml-auto">
              {SHOWCASE_COVERS.map((item) => {
                const src = failedImages[item.id]
                  ? FALLBACK_POSTER_URI
                  : sanitizePosterUrl(item.poster);

                return (
                  <div key={item.id} className="space-y-1.5">
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[var(--muted-foreground)] truncate tabular-nums">
                        {item.genres[0]} · ★ {item.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="w-full border-t border-[var(--border)] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]">
          <p>© 2026 Komakuy. Seluruh hak cipta dilindungi.</p>
          <p>Portal Baca Komik, Anime &amp; Donghua Sub Indo</p>
        </div>
      </footer>
    </div>
  );
}
