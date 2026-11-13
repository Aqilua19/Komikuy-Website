'use client';

import { LibraryItem } from '@/types/comic';

const LIBRARY_KEY = 'komakatsu_library';

export const getLibrary = (): LibraryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading library from localStorage:', e);
    return [];
  }
};

export const isInLibrary = (slug: string): boolean => {
  const lib = getLibrary();
  return lib.some((item) => item.slug === slug);
};

export const addToLibrary = (item: Omit<LibraryItem, 'addedAt' | 'updatedAt'>): void => {
  if (typeof window === 'undefined') return;
  try {
    const lib = getLibrary();
    const existingIndex = lib.findIndex((i) => i.slug === item.slug);
    const now = Date.now();

    if (existingIndex >= 0) {
      lib[existingIndex] = {
        ...lib[existingIndex],
        ...item,
        updatedAt: now,
      };
    } else {
      lib.unshift({
        ...item,
        addedAt: now,
        updatedAt: now,
      });
    }

    localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
    window.dispatchEvent(new Event('library-updated'));
  } catch (e) {
    console.error('Error adding to library:', e);
  }
};

export const removeFromLibrary = (slug: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const lib = getLibrary();
    const filtered = lib.filter((i) => i.slug !== slug);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('library-updated'));
  } catch (e) {
    console.error('Error removing from library:', e);
  }
};
