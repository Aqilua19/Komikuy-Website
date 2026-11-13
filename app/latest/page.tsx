import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComicGrid } from '@/components/comic/ComicGrid';
import { Pagination } from '@/components/common/Pagination';
import { comicAdapter } from '@/lib/komikcast/adapter';
import { Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function LatestPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);

  let data: any[] = [];
  let pagination = { current_page: page, last_page: 1, per_page: 12, total: 0 };

  try {
    const result = await comicAdapter.getLatestComics(page);
    data = result.data || [];
    pagination = result.pagination || pagination;
  } catch (e) {
    console.error('Latest page error:', e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Komik Terbaru</h1>
            <p className="text-sm text-muted-foreground">Update chapter terbaru dari berbagai manga, manhwa, dan manhua.</p>
          </div>
        </div>

        <ComicGrid comics={data} />
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          baseUrl="/latest"
        />
      </main>

      <Footer />
    </div>
  );
}
