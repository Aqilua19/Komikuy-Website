import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SeriesDetailView } from '@/components/series/SeriesDetailView';
import { WEBTOON_SERIES, getSeriesBySlug } from '@/lib/comics-data';
import { comicAdapter } from '@/lib/komikcast/adapter';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) {
    const scraped = await comicAdapter.getMangaDetail(slug);
    if (!scraped) return { title: 'Komik Tidak Ditemukan — Komakuy' };
    return {
      title: `${scraped.title} — Komakuy`,
      description: scraped.synopsis || `Baca ${scraped.title} bahasa Indonesia di Komakuy.`,
    };
  }

  return {
    title: `${series.title} — Komakuy`,
    description: series.synopsis,
    openGraph: {
      title: `${series.title} — Komakuy`,
      description: series.synopsis,
      images: [series.poster],
    },
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const local = getSeriesBySlug(slug);

  let series = null;

  // Prioritize real live Komikcast data from scraper
  try {
    const scraped = await comicAdapter.getMangaDetail(slug);
    if (scraped && scraped.chapters && scraped.chapters.length > 0) {
      series = {
        id: String(scraped.id || local?.id || '1'),
        slug: scraped.slug || slug,
        title: scraped.title,
        author: scraped.author || local?.author || 'Author',
        artist: scraped.artist || local?.artist || undefined,
        poster: scraped.poster || local?.poster || '',
        banner: scraped.poster || local?.banner || undefined,
        day: local?.day || 'SEN',
        genres: scraped.genres && scraped.genres.length > 0 ? scraped.genres : (local?.genres || ['Manga']),
        status: (scraped.status as any) || local?.status || 'Ongoing',
        rating: scraped.rating || local?.rating || 9.8,
        likes: local?.likes || '1,2 jt',
        subscribers: local?.subscribers || '450 rb',
        views: scraped.views || local?.views || '8,4 jt',
        synopsis: scraped.synopsis || local?.synopsis || 'Sinopsis belum tersedia.',
        rankToday: local?.rankToday || 1,
        rankWeek: local?.rankWeek || 1,
        rankMonth: local?.rankMonth || 1,
        rankDelta: local?.rankDelta || 0,
        isUpToday: true,
        episodes: (scraped.chapters || []).map((c) => ({
          id: c.id,
          chapter_number: typeof c.chapter_number === 'string' ? parseFloat(c.chapter_number) : c.chapter_number,
          title: c.title || `Chapter ${c.chapter_number}`,
          release_date: c.release_date || 'Terbaru',
          views: c.views || '100 rb',
          likes: '25 rb',
          images: [],
        })),
      };
    }
  } catch {
    // ignore
  }

  // Fallback to local dataset if scraper detail is unavailable
  if (!series && local) {
    series = local;
  }

  if (!series) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Header />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
          <BookOpen className="w-12 h-12 text-[var(--text-muted)] mb-3" />
          <h2 className="text-xl font-bold mb-2">Komik Tidak Ditemukan</h2>
          <p className="text-[13px] text-[var(--text-muted)] mb-6 max-w-md">
            Mungkin judul yang kamu cari belum tersedia atau alamat URL salah.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-semibold rounded-[6px] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <SeriesDetailView series={series} />
      </main>

      <Footer />
    </div>
  );
}
