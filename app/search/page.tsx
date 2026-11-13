import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { comicAdapter } from '@/lib/komikcast/adapter';
import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { sanitizePosterUrl } from '@/lib/ui-formatters';

const POPULAR_SEARCHES = ['Solo Leveling', 'Omniscient Reader', 'Lookism', 'Estate Developer', 'Nano Machine', 'Aksi', 'Romansa'];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const page = parseInt(params.page || '1', 10);

  let data: any[] = [];
  let pagination = { current_page: 1, last_page: 1, per_page: 20, total: 0 };

  if (query.trim()) {
    try {
      const result = await comicAdapter.searchComics(query, page);
      data = result.data || [];
      pagination = result.pagination || pagination;
    } catch (e) {
      console.error('Search error:', e);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text)] mb-1">
            Pencarian Webtoon
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] mb-4">
            Cari berdasarkan judul komik, genre, atau nama author.
          </p>

          <form method="GET" action="/search" className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                autoFocus={!query}
                placeholder="Ketik judul webtoon..."
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white text-[13px] font-semibold rounded-lg transition-opacity cursor-pointer"
            >
              Cari
            </button>
          </form>

          {/* Quick search buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text)]">Populer:</span>
            {POPULAR_SEARCHES.map((keyword) => (
              <Link
                key={keyword}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="px-2.5 py-1 bg-[var(--bg-subtle)] hover:border-[var(--primary)] border border-[var(--border)] rounded-md text-[var(--text)] transition-colors"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>

        {/* Results */}
        {!query.trim() ? (
          <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-subtle)] rounded-[6px] border border-[var(--border)] p-6">
            <SearchIcon className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-2" />
            <h3 className="text-[15px] font-bold text-[var(--text)] mb-1">Cari Komik Favoritmu</h3>
            <p className="text-[13px] text-[var(--text-muted)]">
              Ketikkan kata kunci di kolom pencarian atau pilih rekomendasi di atas.
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-subtle)] rounded-[6px] border border-[var(--border)] p-6">
            <h3 className="text-[15px] font-bold text-[var(--text)] mb-1">
              Tidak ada hasil untuk &ldquo;{query}&rdquo;
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mb-4">
              Coba gunakan ejaan lain atau periksa rekomendasi komik di halaman Beranda.
            </p>
            <Link
              href="/"
              className="inline-flex px-4 py-2 bg-[var(--primary)] text-white text-[13px] font-semibold rounded-lg"
            >
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div>
            <div className="pb-3 mb-3 border-b border-[var(--border)] flex items-center justify-between text-[13px] text-[var(--text-muted)]">
              <span>Hasil pencarian untuk &ldquo;{query}&rdquo;</span>
              <span className="tabular-nums">{pagination.total} judul ditemukan</span>
            </div>

            <div className="divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
              {data.map((item) => (
                <Link
                  key={item.slug || item.id}
                  href={`/series/${item.slug}`}
                  className="flex items-center gap-3.5 py-3 px-2 rounded-md hover:bg-[var(--bg-subtle)] transition-colors group"
                >
                  <div className="relative w-14 aspect-[2/3] rounded-md overflow-hidden bg-[var(--bg-subtle)] flex-shrink-0 border border-[var(--border)]">
                    <Image
                      src={sanitizePosterUrl(item.poster)}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-[var(--text)] truncate group-hover:text-[var(--primary)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-[var(--text-muted)] truncate mt-0.5">
                      {item.author || 'Author'}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--text-muted)] tabular-nums">
                      {item.genres && item.genres[0] && (
                        <span className="text-[var(--primary)] font-medium">
                          {typeof item.genres[0] === 'string' ? item.genres[0] : item.genres[0].name}
                        </span>
                      )}
                      {item.rating && (
                        <>
                          <span>·</span>
                          <span>★ {item.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
