'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, X, User, Menu, Bookmark } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/components/providers/AuthProvider';
import { KOMAKUY_LOGO_URL } from '@/lib/ui-formatters';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/anime', label: 'Anime' },
  { href: '/donghua', label: 'Donghua' },
  { href: '/genre', label: 'Genre' },
  { href: '/ranking', label: 'Peringkat' },
];

const POPULAR_TERMS = [
  'Solo Leveling',
  'Omniscient Reader',
  'Lookism',
  'Estate Developer',
  'Nano Machine',
  'Aksi',
  'Romansa',
];

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="glass sticky top-0 z-40 border-b border-[var(--border)] h-16 transition-colors">
        <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Mark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 select-none whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={KOMAKUY_LOGO_URL}
              alt="Komakuy"
              referrerPolicy="no-referrer"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display text-lg font-extrabold tracking-tight text-[var(--foreground)]">
              Komakuy
            </span>
          </Link>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 h-full" aria-label="Navigasi Utama">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href + '/');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative inline-flex items-center h-full text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[var(--foreground)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--primary)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Compact Utility & Account Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Cari komik, anime, atau donghua"
              className="press-soft inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Cari judul...</span>
            </button>

            <Link
              href="/simpanan"
              aria-label="Simpanan Saya"
              className="press-soft hidden md:inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <Bookmark className="w-4 h-4" />
            </Link>

            <ThemeToggle />

            <Link
              href="/profil"
              aria-label="Profil Akun"
              className="press-soft hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Profil'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-[var(--muted-foreground)]" />
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu navigasi"
              aria-expanded={mobileMenuOpen}
              className="press-soft lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[var(--border)] bg-[var(--background)] px-4 py-3 shadow-lg">
            <nav className="grid grid-cols-3 gap-2" aria-label="Menu Mobile">
              {[...NAV_LINKS, { href: '/simpanan', label: 'Simpanan' }, { href: '/profil', label: 'Profil' }].map(
                (item) => {
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2.5 rounded-lg border text-center text-xs font-semibold whitespace-nowrap transition-colors ${
                        isActive
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                          : 'border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pencarian Komakuy"
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-start justify-center pt-10 sm:pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]"
            >
              <Search className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul komik, author, atau seri..."
                autoFocus
                className="flex-1 bg-transparent text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none text-sm font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus teks pencarian"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="press-soft rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
              >
                Cari
              </button>
            </form>

            <div className="p-4 space-y-2.5 bg-[var(--card)]">
              <p className="text-xs font-semibold text-[var(--muted-foreground)]">
                Pencarian Populer
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                    }}
                    className="press-soft rounded-md border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
