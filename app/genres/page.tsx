import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Compass } from 'lucide-react';

const GENRES = [
  { name: 'Action', slug: 'action', desc: 'Aksi menegangkan dan pertarungan epik' },
  { name: 'Adventure', slug: 'adventure', desc: 'Petualangan dunia baru dan dungeon' },
  { name: 'Comedy', slug: 'comedy', desc: 'Komedi segar dan humor menghibur' },
  { name: 'Drama', slug: 'drama', desc: 'Kisah emosional dan intrik mendalam' },
  { name: 'Fantasy', slug: 'fantasy', desc: 'Dunia sihir, makhluk mitologi, dan kekuatan' },
  { name: 'Romance', slug: 'romance', desc: 'Kisah cinta romantis dan slice of life' },
  { name: 'School Life', slug: 'school-life', desc: 'Kehidupan remaja sekolah sehari-hari' },
  { name: 'Martial Arts', slug: 'martial-arts', desc: 'Beladiri, kultivasi, dan persilatan' },
  { name: 'Supernatural', slug: 'supernatural', desc: 'Kekuatan gaib, hantu, dan misteri' },
  { name: 'Mystery', slug: 'mystery', desc: 'Penyelidikan kasus dan teka-teki' },
  { name: 'Horror', slug: 'horror', desc: 'Kisah menegangkan dan menyeramkan' },
  { name: 'Sci-Fi', slug: 'sci-fi', desc: 'Fiksi ilmiah, masa depan, dan teknologi' },
  { name: 'Shounen', slug: 'shounen', desc: 'Target pembaca remaja laki-laki' },
  { name: 'Seinen', slug: 'seinen', desc: 'Target pembaca dewasa muda' },
  { name: 'Slice of Life', slug: 'slice-of-life', desc: 'Kisah ringan keseharian' },
];

export default function GenresPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Daftar Genre</h1>
            <p className="text-sm text-muted-foreground">Pilih genre komik favoritmu untuk mulai membaca.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GENRES.map((g) => (
            <Link
              key={g.slug}
              href={`/genres/${g.slug}`}
              className="p-5 bg-surface hover:bg-surface-elevated border border-border rounded-xl transition-all hover:border-accent group flex flex-col justify-between gap-3 shadow-sm"
            >
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  {g.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{g.desc}</p>
              </div>
              <span className="text-xs font-medium text-accent">Jelajahi →</span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
