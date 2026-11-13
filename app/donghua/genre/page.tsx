import Link from 'next/link';
import { listGenres, safe } from '@/lib/donghua';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function DonghuaGenresPage() {
  const { data, error } = await safe(() => listGenres());

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 space-y-6">
        <div className="space-y-2 border-b border-[var(--border)] pb-4">
          <h1 className="font-display text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-tags text-[var(--primary)]" />
            Genre Donghua
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Pilih genre animasi China favoritmu untuk mulai menonton.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data?.genres.map((g) => (
            <Link
              key={g.slug}
              href={`/donghua/genre/${g.slug}`}
              className="press-soft flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs font-semibold hover:border-[var(--primary)] hover:bg-[var(--accent)] transition-colors shadow-xs"
            >
              <span>{g.name}</span>
              <i className="fa-solid fa-chevron-right text-[10px] text-[var(--muted-foreground)]" />
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
