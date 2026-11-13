'use client';

import { HistoryItem } from '@/types/comic';

const HISTORY_KEY = 'komakatsu_history';
const MAX_HISTORY = 100;

export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading history:', e);
    return [];
  }
};

export const addHistory = (item: Omit<HistoryItem, 'timestamp'>): void => {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    // Remove existing entry for same manga & chapter or same manga
    const filtered = history.filter((i) => i.slug !== item.slug);
    
    filtered.unshift({
      ...item,
      timestamp: Date.now(),
    });

    // Limit size
    const limited = filtered.slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
    window.dispatchEvent(new Event('history-updated'));
  } catch (e) {
    console.error('Error adding history:', e);
  }
};

export const clearHistory = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event('history-updated'));
  } catch (e) {
    console.error('Error clearing history:', e);
  }
};
