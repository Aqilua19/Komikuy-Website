import Link from 'next/link';
import { getGenre, safe } from '@/lib/donghua';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DonghuaCard } from '@/components/donghua/DonghuaCard';

export const dynamic = 'force-dynamic';

export default async function DonghuaGenreDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const slug = resolvedParams.slug;
  const page = Number(resolvedSearch.page || 1);

  const { data, error } = await safe(() => getGenre(slug, page));

  const genreTitle = slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 space-y-6">
        <div className="space-y-2 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Link href="/donghua/genre" className="hover:text-[var(--foreground)]">Genre</Link>
            <span>/</span>
            <span className="text-[var(--foreground)] font-medium capitalize">{genreTitle}</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Donghua Genre: {genreTitle}
          </h1>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-500 text-center">
            {error}
          </div>
        )}

        {data?.results.length === 0 ? (
          <div className="py-16 text-center text-xs text-[var(--muted-foreground)]">
            Tidak ada donghua dalam genre ini.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data?.results.map((card, idx) => (
              <DonghuaCard key={`${card.slug}-${idx}`} card={card} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 pt-6">
          {page > 1 && (
            <Link
              href={`/donghua/genre/${slug}?page=${page - 1}`}
              className="press-soft rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold hover:bg-[var(--accent)] transition-colors"
            >
              ← Sebelumnya
            </Link>
          )}
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">
            Halaman {page}
          </span>
          <Link
            href={`/donghua/genre/${slug}?page=${page + 1}`}
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
