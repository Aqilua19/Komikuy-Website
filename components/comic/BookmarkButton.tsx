'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Check } from 'lucide-react';
import { Comic } from '@/types/comic';
import { addToLibrary, removeFromLibrary, isInLibrary } from '@/lib/client/library';

export function BookmarkButton({ manga }: { manga: Comic }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(isInLibrary(manga.slug));
    const handleLibraryUpdate = () => {
      setSaved(isInLibrary(manga.slug));
    };
    window.addEventListener('library-updated', handleLibraryUpdate);
    return () => window.removeEventListener('library-updated', handleLibraryUpdate);
  }, [manga.slug]);

  const toggleLibrary = () => {
    if (saved) {
      removeFromLibrary(manga.slug);
      setSaved(false);
    } else {
      addToLibrary({
        slug: manga.slug,
        title: manga.title,
        poster: manga.poster,
        lastReadChapter: manga.first_chapter || { chapter_number: 1, title: 'Chapter 1' },
      });
      setSaved(true);
    }
  };

  return (
    <button
      onClick={toggleLibrary}
      className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-xl border transition-all ${
        saved
          ? 'bg-success/10 text-success border-success/30 hover:bg-success/20'
          : 'bg-surface-elevated hover:bg-border text-foreground border-border'
      }`}
    >
      {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      <span>{saved ? 'Tersimpan di Library' : '+ Library'}</span>
    </button>
  );
}
