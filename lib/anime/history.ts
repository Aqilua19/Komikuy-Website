const STORAGE_KEY = "nonton-history-v1";

export interface HistoryItem {
  episodeId: string;
  animeId: string;
  animeTitle: string;
  episodeTitle: string;
  poster: string;
  watchedAt: number;
}

const EMPTY_HISTORY: HistoryItem[] = [];
let cachedHistory: HistoryItem[] | null = null;

export const getEmptyHistory = () => EMPTY_HISTORY;

export function readHistory(): HistoryItem[] {
  if (typeof window === "undefined") return EMPTY_HISTORY;
  if (cachedHistory !== null) return cachedHistory;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedHistory = [];
      return cachedHistory;
    }
    const parsed = JSON.parse(raw) as HistoryItem[];
    cachedHistory = Array.isArray(parsed) ? parsed.sort((a, b) => b.watchedAt - a.watchedAt) : [];
    return cachedHistory;
  } catch {
    cachedHistory = [];
    return cachedHistory;
  }
}

function write(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  cachedHistory = items.slice(0, 100);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedHistory));
  window.dispatchEvent(new Event("history-updated"));
}

export function saveHistory(item: HistoryItem) {
  if (typeof window === "undefined") return;
  const items = readHistory().filter((entry) => entry.episodeId !== item.episodeId);
  write([item, ...items]);
}

export function removeHistory(episodeId: string) {
  write(readHistory().filter((entry) => entry.episodeId !== episodeId));
}

export function clearHistory() {
  write([]);
}

export function subscribeHistory(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    cachedHistory = null;
    callback();
  };
  window.addEventListener("history-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("history-updated", handler);
    window.removeEventListener("storage", handler);
  };
}
