import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeClient } from '@/components/home/HomeClient';
import { WEBTOON_SERIES, getTodayKey } from '@/lib/comics-data';
import { comicAdapter } from '@/lib/komikcast/adapter';

export const revalidate = 60;

export default async function HomePage() {
  const serverToday = getTodayKey();
  let popularComics: any[] = [];
  let latestComics: any[] = [];

  try {
    const [popRes, latestRes] = await Promise.all([
      comicAdapter.getPopularComics(1).catch(() => null),
      comicAdapter.getLatestComics(1).catch(() => null),
    ]);
    if (popRes && popRes.data && popRes.data.length > 0) {
      popularComics = popRes.data;
    }
    if (latestRes && latestRes.data && latestRes.data.length > 0) {
      latestComics = latestRes.data;
    }
  } catch {
    // fallback
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <HomeClient
          initialSeries={WEBTOON_SERIES}
          popularComics={popularComics}
          latestComics={latestComics}
          serverToday={serverToday}
        />
      </main>

      <Footer />
    </div>
  );
}
