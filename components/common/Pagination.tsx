import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function Pagination({ currentPage, lastPage, baseUrl }: {
  currentPage: number;
  lastPage: number;
  baseUrl: string;
}) {
  if (lastPage <= 1) return null;

  const createPageUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Link
        href={createPageUrl(currentPage - 1)}
        aria-disabled={currentPage <= 1}
        className={`px-3 py-2 text-sm font-medium rounded-lg border border-border flex items-center gap-1 transition-colors ${
          currentPage <= 1
            ? 'opacity-40 pointer-events-none text-muted-foreground'
            : 'hover:bg-surface-elevated text-foreground'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Sebelumnya
      </Link>

      <span className="px-4 py-2 text-sm text-muted-foreground">
        Halaman <strong className="text-foreground">{currentPage}</strong> dari {lastPage}
      </span>

      <Link
        href={createPageUrl(currentPage + 1)}
        aria-disabled={currentPage >= lastPage}
        className={`px-3 py-2 text-sm font-medium rounded-lg border border-border flex items-center gap-1 transition-colors ${
          currentPage >= lastPage
            ? 'opacity-40 pointer-events-none text-muted-foreground'
            : 'hover:bg-surface-elevated text-foreground'
        }`}
      >
        Berikutnya
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
