import Link from 'next/link';
import { getEpisode, safe } from '@/lib/donghua';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import DonghuaWatchClient from '@/components/donghua/DonghuaWatchClient';

export const dynamic = 'force-dynamic';

export default async function DonghuaWatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const { data, error } = await safe(() => getEpisode(slug));
  const episodeData = data?.result;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link href="/donghua" className="hover:text-[var(--foreground)]">Donghua</Link>
          <span>/</span>
          {episodeData?.root && episodeData.root !== 'unknown' && (
            <>
              <Link href={`/donghua/series/${episodeData.root}`} className="hover:text-[var(--foreground)] capitalize">
                {episodeData.root.replace(/-/g, ' ')}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[var(--foreground)] font-medium truncate">{episodeData?.name || slug}</span>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-red-500">{error}</p>
          </div>
        )}

        {episodeData && <DonghuaWatchClient episode={episodeData} />}
      </main>

      <Footer />
    </div>
  );
}
