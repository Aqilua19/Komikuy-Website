const STORAGE_KEY = "nonton-watchlist-v1";

export interface WatchlistItem {
  animeId: string;
  title: string;
  poster: string;
  addedAt: number;
}

const EMPTY_WATCHLIST: WatchlistItem[] = [];
let cachedWatchlist: WatchlistItem[] | null = null;

export const getEmptyWatchlist = () => EMPTY_WATCHLIST;

export function readWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return EMPTY_WATCHLIST;
  if (cachedWatchlist !== null) return cachedWatchlist;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedWatchlist = [];
      return cachedWatchlist;
    }
    const parsed = JSON.parse(raw) as WatchlistItem[];
    cachedWatchlist = Array.isArray(parsed) ? parsed.sort((a, b) => b.addedAt - a.addedAt) : [];
    return cachedWatchlist;
  } catch {
    cachedWatchlist = [];
    return cachedWatchlist;
  }
}

function write(items: WatchlistItem[]) {
  if (typeof window === "undefined") return;
  cachedWatchlist = items;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedWatchlist));
  window.dispatchEvent(new Event("watchlist-updated"));
}

export function isInWatchlist(animeId: string) {
  return readWatchlist().some((item) => item.animeId === animeId);
}

export function addToWatchlist(animeId: string, title: string, poster: string) {
  if (typeof window === "undefined") return;
  const items = readWatchlist().filter((entry) => entry.animeId !== animeId);
  write([{ animeId, title, poster, addedAt: Date.now() }, ...items]);
}

export function removeFromWatchlist(animeId: string) {
  write(readWatchlist().filter((entry) => entry.animeId !== animeId));
}

export function toggleWatchlist(animeId: string, title: string, poster: string) {
  if (isInWatchlist(animeId)) {
    removeFromWatchlist(animeId);
    return false;
  }
  addToWatchlist(animeId, title, poster);
  return true;
}

export function subscribeWatchlist(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    cachedWatchlist = null;
    callback();
  };
  window.addEventListener("watchlist-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("watchlist-updated", handler);
    window.removeEventListener("storage", handler);
  };
}
