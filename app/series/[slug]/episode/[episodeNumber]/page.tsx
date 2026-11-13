import { WebtoonViewer } from '@/components/reader/WebtoonViewer';
import { getSeriesBySlug, WebtoonSeries } from '@/lib/comics-data';
import { comicAdapter } from '@/lib/komikcast/adapter';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; episodeNumber: string }>;
}): Promise<Metadata> {
  const { slug, episodeNumber } = await params;
  const series = getSeriesBySlug(slug);
  const title = series ? series.title : slug.replace(/-/g, ' ');
  return {
    title: `Chapter ${episodeNumber} - ${title} — Komakuy`,
    description: `Baca ${title} Chapter ${episodeNumber} online bahasa Indonesia di Komakuy.`,
  };
}

export default async function EpisodeReaderPage({
  params,
}: {
  params: Promise<{ slug: string; episodeNumber: string }>;
}) {
  const { slug, episodeNumber: epStr } = await params;
  const localSeries = getSeriesBySlug(slug);

  let chapterData = null;
  try {
    chapterData = await comicAdapter.getChapterDetail(slug, epStr);
  } catch {
    // ignore
  }

  // Construct series info
  let series: WebtoonSeries | null = localSeries || null;

  if (!series && chapterData) {
    series = {
      id: chapterData.manga_slug || slug,
      slug: chapterData.manga_slug || slug,
      title: chapterData.manga_title || slug.replace(/-/g, ' '),
      author: 'Komikcast Author',
      poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/7758.webp',
      day: 'SEN',
      genres: ['Manga', 'Aksi'],
      status: 'Ongoing',
      rating: 9.8,
      likes: '1,5 jt',
      subscribers: '540 rb',
      views: '12,8 jt',
      synopsis: '',
      rankToday: 1,
      rankWeek: 1,
      rankMonth: 1,
      rankDelta: 0,
      isUpToday: true,
      episodes: (chapterData.all_chapters || []).map((c) => ({
        id: c.id,
        chapter_number: typeof c.chapter_number === 'string' ? parseFloat(c.chapter_number) : c.chapter_number,
        title: c.title,
        release_date: c.release_date || 'Terbaru',
        views: '100 rb',
        likes: '35 rb',
        images: [],
      })),
    };
  }

  // If still no series, try getting manga detail
  if (!series) {
    try {
      const scraped = await comicAdapter.getMangaDetail(slug);
      if (scraped) {
        series = {
          id: String(scraped.id),
          slug: scraped.slug,
          title: scraped.title,
          author: scraped.author || 'Author',
          poster: scraped.poster || '',
          day: 'SEN',
          genres: scraped.genres || ['Manga'],
          status: (scraped.status as any) || 'Ongoing',
          rating: scraped.rating || 9.8,
          likes: '1,2 jt',
          subscribers: '450 rb',
          views: scraped.views || '8,4 jt',
          synopsis: scraped.synopsis || '',
          rankToday: 1,
          rankWeek: 1,
          rankMonth: 1,
          rankDelta: 0,
          isUpToday: true,
          episodes: (scraped.chapters || []).map((c) => ({
            id: c.id,
            chapter_number: typeof c.chapter_number === 'string' ? parseFloat(c.chapter_number) : c.chapter_number,
            title: c.title,
            release_date: c.release_date || 'Terbaru',
            views: '100 rb',
            likes: '25 rb',
            images: [],
          })),
        };
      }
    } catch {
      // ignore
    }
  }

  if (!series) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--bg)] text-[var(--text)]">
        <BookOpen className="w-12 h-12 text-[var(--text-muted)] mb-3" />
        <h1 className="text-xl font-bold mb-2">Chapter Tidak Ditemukan</h1>
        <p className="text-[13px] text-[var(--text-muted)] mb-4">
          Komik atau chapter ini tidak dapat ditemukan.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-[var(--accent)] text-white text-[13px] font-semibold rounded-[6px]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Determine panels from live Komikcast chapterData
  let panels = [];
  if (chapterData && chapterData.images && chapterData.images.length > 0) {
    panels = chapterData.images.map((img, i) => ({
      order: img.order !== undefined ? img.order : i + 1,
      url: img.url,
      fallback_url: img.fallback_url,
      alt: `${series.title} Chapter ${epStr} - Gambar ${i + 1}`,
    }));
  } else {
    // Fallback to local series episode panels if offline
    const epNum = parseFloat(epStr);
    const localEp = series.episodes.find((e) => e.chapter_number === epNum);
    panels = localEp?.images || [];
  }

  const episodeTitle = chapterData?.chapter_title || `Chapter ${epStr}`;
  const prevEpisodeNum = chapterData?.navigation?.prev?.chapter_number ?? null;
  const nextEpisodeNum = chapterData?.navigation?.next?.chapter_number ?? null;

  return (
    <WebtoonViewer
      series={series}
      episodeNumber={epStr}
      episodeTitle={episodeTitle}
      panels={panels}
      prevEpisodeNum={prevEpisodeNum}
      nextEpisodeNum={nextEpisodeNum}
      allChapters={chapterData?.all_chapters}
    />
  );
}
