import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

const GENRES = [
  { name: 'Action', slug: 'action', count: '1.2k' },
  { name: 'Adventure', slug: 'adventure', count: '980' },
  { name: 'Fantasy', slug: 'fantasy', count: '1.5k' },
  { name: 'Martial Arts', slug: 'martial-arts', count: '740' },
  { name: 'Comedy', slug: 'comedy', count: '650' },
  { name: 'Drama', slug: 'drama', count: '820' },
  { name: 'Romance', slug: 'romance', count: '890' },
  { name: 'School Life', slug: 'school-life', count: '510' },
  { name: 'Supernatural', slug: 'supernatural', count: '930' },
  { name: 'Mystery', slug: 'mystery', count: '420' },
  { name: 'Horror', slug: 'horror', count: '310' },
  { name: 'Sci-Fi', slug: 'sci-fi', count: '390' },
];

export function GenreSection() {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground tracking-tight">Kategori & Genre Populer</h2>
            <p className="text-xs text-muted-foreground">Temukan cerita favorit berdasarkan alur yang kamu sukai</p>
          </div>
        </div>
        <Link
          href="/genres"
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          <span>Semua Genre</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {GENRES.map((g) => (
          <Link
            key={g.slug}
            href={`/genres/${g.slug}`}
            className="px-3.5 py-3 bg-surface hover:bg-surface-elevated border border-border hover:border-accent/80 rounded-xl transition-all group flex items-center justify-between shadow-sm"
          >
            <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
              {g.name}
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-medium ml-1">
              {g.count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
