'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Flame, Compass, Heart } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  // Hide mobile bottom nav inside chapter reader
  if (pathname?.includes('/chapter/')) return null;

  const items = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/latest', label: 'Terbaru', icon: Sparkles },
    { href: '/popular', label: 'Populer', icon: Flame },
    { href: '/genres', label: 'Genre', icon: Compass },
    { href: '/library', label: 'Favoritku', icon: Heart },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-1 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-colors ${
              isActive ? 'text-[#00dc64]' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
