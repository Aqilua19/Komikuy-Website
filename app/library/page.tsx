'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EmptyState } from '@/components/common/EmptyState';
import { LibraryItem } from '@/types/comic';
import { getLibrary, removeFromLibrary } from '@/lib/client/library';
import { Bookmark, Trash2, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { sanitizePosterUrl } from '@/lib/ui-formatters';

export default function LibraryPage() {
  const [library, setLibrary] = useState<LibraryItem[]>([]);

  useEffect(() => {
    const load = () => setLibrary(getLibrary());
    load();

    window.addEventListener('library-updated', load);
    return () => window.removeEventListener('library-updated', load);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Library Saya</h1>
            <p className="text-sm text-muted-foreground">Komik favorit yang telah kamu simpan untuk dibaca nanti.</p>
          </div>
        </div>

        {library.length === 0 ? (
          <EmptyState
            title="Library Kamu Masih Kosong"
            description="Tambahkan komik ke library dari halaman detail komik agar lebih mudah diakses."
            actionUrl="/"
            actionLabel="Jelajahi Komik"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {library.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-sm group hover:border-accent transition-all"
              >
                <div className="relative aspect-[3/4] w-full bg-surface-elevated">
                  <Image
                    src={sanitizePosterUrl(item.poster)}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => removeFromLibrary(item.slug)}
                    aria-label="Hapus dari library"
                    className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-danger text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <Link href={`/manga/${item.slug}`}>
                      <h3 className="text-base font-bold text-foreground hover:text-accent transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      Terakhir dibaca: Chapter {item.lastReadChapter.chapter_number}
                    </p>
                  </div>

                  <Link
                    href={`/manga/${item.slug}/chapter/${item.lastReadChapter.chapter_number}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2 bg-surface-elevated hover:bg-border text-foreground text-xs font-medium rounded-lg border border-border transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lanjutkan Membaca</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
