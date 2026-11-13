const STORAGE_KEY = "nonton-subs-v1";

export interface SubscriptionItem {
  animeId: string;
  animeTitle: string;
  subscribedAt: number;
}

const EMPTY_SUBSCRIPTIONS: SubscriptionItem[] = [];
let cachedSubscriptions: SubscriptionItem[] | null = null;

export const getEmptySubscriptions = () => EMPTY_SUBSCRIPTIONS;

export function readSubscriptions(): SubscriptionItem[] {
  if (typeof window === "undefined") return EMPTY_SUBSCRIPTIONS;
  if (cachedSubscriptions !== null) return cachedSubscriptions;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedSubscriptions = [];
      return cachedSubscriptions;
    }
    const parsed = JSON.parse(raw) as SubscriptionItem[];
    cachedSubscriptions = Array.isArray(parsed) ? parsed.sort((a, b) => b.subscribedAt - a.subscribedAt) : [];
    return cachedSubscriptions;
  } catch {
    cachedSubscriptions = [];
    return cachedSubscriptions;
  }
}

function write(items: SubscriptionItem[]) {
  if (typeof window === "undefined") return;
  cachedSubscriptions = items;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedSubscriptions));
  window.dispatchEvent(new Event("subs-updated"));
}

export function isSubscribed(animeId: string) {
  return readSubscriptions().some((item) => item.animeId === animeId);
}

export function addSubscription(animeId: string, animeTitle: string) {
  if (typeof window === "undefined") return;
  const items = readSubscriptions().filter((entry) => entry.animeId !== animeId);
  write([{ animeId, animeTitle, subscribedAt: Date.now() }, ...items]);
}

export function removeSubscription(animeId: string) {
  write(readSubscriptions().filter((entry) => entry.animeId !== animeId));
}

export function subscribeSubscriptions(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    cachedSubscriptions = null;
    callback();
  };
  window.addEventListener("subs-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("subs-updated", handler);
    window.removeEventListener("storage", handler);
  };
}
