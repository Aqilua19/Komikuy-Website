'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tv, Film, Trophy, User } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/anime', label: 'Anime', icon: Tv },
  { href: '/donghua', label: 'Donghua', icon: Film },
  { href: '/ranking', label: 'Peringkat', icon: Trophy },
  { href: '/profil', label: 'Profil', icon: User },
];

export function BottomTabBar() {
  const pathname = usePathname();

  if (
    pathname.includes('/chapter/') ||
    pathname.includes('/episode/') ||
    pathname.includes('/watch/') ||
    pathname === '/login'
  ) {
    return null;
  }

  return (
    <nav
      className="glass lg:hidden fixed inset-x-0 bottom-0 z-40 flex h-14 border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)] select-none transition-colors"
      aria-label="Navigasi Bawah Mobile"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          tab.href === '/'
            ? pathname === '/'
            : pathname === tab.href || pathname.startsWith(tab.href + '/');

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`press-soft flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive
                ? 'text-[var(--primary)] font-semibold'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[11px] font-medium leading-none tracking-tight whitespace-nowrap">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
