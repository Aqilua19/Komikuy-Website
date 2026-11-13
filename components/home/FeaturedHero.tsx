import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Comic } from '@/types/comic';
import { sanitizePosterUrl } from '@/lib/ui-formatters';

export function FeaturedHero({ comic }: { comic: Comic | null }) {
  if (!comic) return null;

  const targetChapter = comic.first_chapter || comic.last_chapter || { chapter_number: 1 };
  const posterUrl = sanitizePosterUrl(comic.poster);

  return (
    <section className="relative w-full rounded-xl overflow-hidden bg-[#11131A] text-white border border-[var(--border)] p-6 sm:p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3">
          <p className="text-xs font-semibold text-neutral-300 tabular-nums">
            <span className="text-[var(--primary)]">Rekomendasi</span>
            {comic.genres?.[0] ? ` · ${comic.genres[0]}` : ''}
            {comic.rating ? ` · ★ ${comic.rating.toFixed(1)}` : ''}
          </p>

          <Link href={`/manga/${comic.slug}`}>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white hover:text-[var(--primary)] transition-colors line-clamp-2 leading-tight">
              {comic.title}
            </h1>
          </Link>

          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 max-w-xl leading-relaxed">
            {comic.synopsis || 'Baca komik pilihan populer ini dengan terjemahan bahasa Indonesia terlengkap.'}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <Link
              href={`/manga/${comic.slug}/chapter/${targetChapter.chapter_number}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-semibold text-xs sm:text-sm rounded-lg transition-opacity"
            >
              <BookOpen className="w-4 h-4" />
              <span>Baca Sekarang</span>
            </Link>
            <Link
              href={`/manga/${comic.slug}`}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm rounded-lg border border-white/15 transition-colors"
            >
              Detail
            </Link>
          </div>
        </div>

        <div className="md:col-span-4 flex justify-center md:justify-end">
          <Link
            href={`/manga/${comic.slug}`}
            className="relative aspect-[2/3] w-32 sm:w-40 rounded-lg overflow-hidden border border-white/15 bg-neutral-900 shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt={comic.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
