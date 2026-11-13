import Link from 'next/link';
import { getHome, safe } from '@/lib/donghua';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DonghuaCard } from '@/components/donghua/DonghuaCard';

export const dynamic = 'force-dynamic';

export default async function DonghuaHomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page || 1);

  const { data, error } = await safe(() => getHome(page));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 space-y-8">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[#11131A] text-white p-6 sm:p-10">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold text-[var(--primary)]">
              Donghua Sub Indo
            </p>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Streaming Donghua Animasi China Terbaru
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Nikmati serial donghua action, cultivation, dan fantasy subtitle Indonesia dengan pembaruan episode harian.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/donghua/genre"
                className="press-soft inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-white px-4 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <i className="fa-solid fa-list text-xs" />
                <span>Jelajahi Genre</span>
              </Link>
              <Link
                href="/donghua/search"
                className="press-soft inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <i className="fa-solid fa-magnifying-glass text-xs" />
                <span>Cari Donghua</span>
              </Link>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-red-500">{error}</p>
            {error.includes('Cloudflare') && (
              <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
                Sumber mendeteksi proteksi Cloudflare. Silakan perbarui variabel <code className="text-xs bg-black/30 px-1 py-0.5 rounded">DONGHUA_CF_COOKIE</code> dan <code className="text-xs bg-black/30 px-1 py-0.5 rounded">DONGHUA_USER_AGENT</code> di file <code className="text-xs bg-black/30 px-1 py-0.5 rounded">.env.local</code>.
              </p>
            )}
          </div>
        )}

        {/* Sections */}
        <div className="space-y-10">
          {data?.results.map((sec) => {
            const sectionTitle = sec.section
              .split('_')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');

            return (
              <section key={sec.section} className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight capitalize text-[var(--foreground)]">
                    {sectionTitle}
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {sec.cards.map((card, idx) => (
                    <DonghuaCard key={`${card.slug}-${idx}`} card={card} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 pt-6">
          {page > 1 && (
            <Link
              href={`/donghua?page=${page - 1}`}
              className="press-soft rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold hover:bg-[var(--accent)] transition-colors"
            >
              ← Sebelumnya
            </Link>
          )}
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">
            Halaman {page}
          </span>
          <Link
            href={`/donghua?page=${page + 1}`}
            className="press-soft rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold hover:bg-[var(--accent)] transition-colors"
          >
            Berikutnya →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
