import { BookOpen, SearchX } from 'lucide-react';
import Link from 'next/link';

export function EmptyState({ title = 'Tidak ada data', description = 'Belum ada konten yang tersedia saat ini.', actionUrl, actionLabel }: {
  title?: string;
  description?: string;
  actionUrl?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-4 text-muted-foreground">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionUrl && actionLabel && (
        <Link
          href={actionUrl}
          className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
