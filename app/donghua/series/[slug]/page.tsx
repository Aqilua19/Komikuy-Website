import Link from 'next/link';
import { getInfo, safe } from '@/lib/donghua';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function DonghuaSeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const { data, error } = await safe(() => getInfo(slug));
  const info = data?.result;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 space-y-8">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link href="/donghua" className="hover:text-[var(--foreground)]">Donghua</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium truncate">{info?.name || slug}</span>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-red-500">{error}</p>
          </div>
        )}

        {info && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-neutral-950 p-6 sm:p-8 shadow-xl">
              <div className="absolute inset-0 z-0 opacity-20 blur-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={info.thumbnail} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/80 to-transparent" />

              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                {/* Poster */}
                <div className="relative aspect-[2/3] w-36 sm:w-48 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-neutral-900 mx-auto md:mx-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={info.thumbnail} alt={info.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                  {info.rating && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-xs font-bold text-amber-400 border border-white/10">
                      <i className="fa-solid fa-star text-[11px]" />
                      <span>{info.rating}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {info.name}
                  </h1>

                  {/* Genres */}
                  {info.genre && info.genre.length > 0 && (
                    <p className="text-xs font-semibold text-[var(--primary)]">
                      {info.genre.join(' · ')}
                    </p>
                  )}

                  {/* Metadata Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                    {Object.entries(info).map(([key, val]) => {
                      if (['name', 'thumbnail', 'genre', 'rating', 'sinopsis', 'episode'].includes(key) || typeof val !== 'string') {
                        return null;
                      }
                      const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                      return (
                        <div key={key} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                          <span className="block text-[var(--muted-foreground)] text-[10px] uppercase font-semibold">{label}</span>
                          <span className="font-medium text-[var(--foreground)] mt-0.5 block truncate">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Sinopsis */}
            {info.sinopsis && info.sinopsis.paragraphs.length > 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-3">
                <h2 className="font-display text-base font-bold tracking-tight">Sinopsis</h2>
                {info.sinopsis.title && <h3 className="text-sm font-semibold text-[var(--primary)]">{info.sinopsis.title}</h3>}
                <div className="space-y-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                  {info.sinopsis.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Episode List */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold tracking-tight border-b border-[var(--border)] pb-3">
                Daftar Episode ({info.episode.length})
              </h2>

              {info.episode.length === 0 ? (
                <div className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                  Daftar episode belum tersedia.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {info.episode.map((ep) => (
                    <Link
                      key={ep.slug}
                      href={`/donghua/watch/${ep.slug}`}
                      className="press-soft flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 hover:border-[var(--primary)] hover:bg-[var(--accent)] transition-colors shadow-xs"
                    >
                      <div className="w-12 h-16 rounded-lg bg-neutral-900 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ep.thumbnail || info.thumbnail} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-xs font-bold text-[var(--foreground)] truncate">{ep.subtitle || `Episode`}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)]">{ep.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
