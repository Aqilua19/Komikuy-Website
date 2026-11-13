import Link from 'next/link';
import { KOMAKUY_LOGO_URL } from '@/lib/ui-formatters';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--card)] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 text-sm text-[var(--muted-foreground)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={KOMAKUY_LOGO_URL}
                alt="Komakuy"
                referrerPolicy="no-referrer"
                className="w-6 h-6 object-contain"
              />
              <span className="font-display text-base font-extrabold text-[var(--foreground)] tracking-tight">
                Komakuy
              </span>
            </Link>
            <p className="max-w-xl text-xs leading-relaxed text-[var(--muted-foreground)]">
              Komakuy adalah portal baca komik, manhwa, manga, serta streaming anime dan donghua subtitle Indonesia. Seluruh konten terindeks secara langsung dari sumber publik pihak ketiga dan tidak dihosting di server kami.
            </p>
          </div>

          <nav className="flex flex-wrap gap-5 text-xs font-semibold" aria-label="Tautan Footer">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
              Komik
            </Link>
            <Link href="/anime" className="hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
              Anime
            </Link>
            <Link href="/donghua" className="hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
              Donghua
            </Link>
            <Link href="/genre" className="hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
              Genre
            </Link>
            <Link href="/ranking" className="hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
              Peringkat
            </Link>
            <Link href="/simpanan" className="hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
              Simpanan
            </Link>
          </nav>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]">
          <p>© 2026 Komakuy. Seluruh hak cipta dilindungi.</p>
          <p>Portal Komik, Anime &amp; Donghua Sub Indo</p>
        </div>
      </div>
    </footer>
  );
}
