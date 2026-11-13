import { Comic } from '@/types/comic';
import { ComicCard } from './ComicCard';

export function ComicGrid({
  comics,
  showRank = false,
}: {
  comics: Comic[];
  showRank?: boolean;
}) {
  if (!comics || comics.length === 0) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-2.5 sm:gap-x-3.5 gap-y-5">
      {comics.map((comic, idx) => (
        <ComicCard
          key={comic.slug || comic.id}
          comic={comic}
          rank={showRank ? idx + 1 : undefined}
        />
      ))}
    </div>
  );
}
