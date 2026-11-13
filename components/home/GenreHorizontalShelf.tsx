import { WebtoonSeries } from '@/lib/comics-data';
import { ComicCard } from '@/components/comic/ComicCard';
import { SectionTitle } from '@/components/common/SectionTitle';

interface GenreHorizontalShelfProps {
  title: string;
  genreSlug: string;
  series: WebtoonSeries[];
}

export function GenreHorizontalShelf({
  title,
  genreSlug,
  series,
}: GenreHorizontalShelfProps) {
  if (series.length === 0) return null;

  return (
    <section className="w-full" aria-label={title}>
      <SectionTitle
        title={title}
        seeAllHref={`/genre?g=${encodeURIComponent(genreSlug)}`}
      />

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {series.map((item) => (
          <div key={item.id} className="shrink-0 w-36 sm:w-40 md:w-44">
            <ComicCard series={item} showUpBadge={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
