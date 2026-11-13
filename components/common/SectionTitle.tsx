import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  iconClass?: string;
  seeAllHref?: string;
  seeAllText?: string;
  subtitle?: string;
}

export function SectionTitle({
  title,
  seeAllHref,
  seeAllText = 'Lihat semua',
  subtitle,
}: SectionTitleProps) {
  return (
    <div className="flex items-end justify-between gap-4 pb-3 mb-4 border-b border-[var(--border)]">
      <div>
        <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {seeAllHref && (
        <Link
          href={seeAllHref}
          className="press-soft inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[var(--primary)] hover:underline whitespace-nowrap shrink-0"
        >
          <span>{seeAllText}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
