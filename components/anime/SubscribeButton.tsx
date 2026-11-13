'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  isSubscribed,
  addSubscription,
  removeSubscription,
  subscribeSubscriptions,
} from '@/lib/anime/subscriptions';
import {
  requestNotificationPermission,
  subscribeToPush,
  showLocalNotification,
} from '@/lib/anime/push';

export function SubscribeButton({
  animeId,
  animeTitle,
}: {
  animeId: string;
  animeTitle: string;
}) {
  const subscribed = useSyncExternalStore(
    subscribeSubscriptions,
    () => isSubscribed(animeId),
    () => false
  );
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (subscribed) {
      removeSubscription(animeId);
      return;
    }

    setBusy(true);
    try {
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        await subscribeToPush();
        await showLocalNotification('Berlangganan aktif', {
          body: `Kamu berlangganan notifikasi untuk ${animeTitle}. Tersimpan di perangkat ini.`,
        });
      }
      addSubscription(animeId, animeTitle);
    } catch {
      addSubscription(animeId, animeTitle);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={`press-soft inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-4 py-2.5 text-xs font-semibold shadow-xs transition-colors disabled:opacity-60 ${
        subscribed
          ? 'bg-[var(--secondary)] text-[var(--secondary-foreground)]'
          : 'bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]'
      }`}
    >
      <i className={subscribed ? 'fa-solid fa-bell text-sm' : 'fa-regular fa-bell text-sm'} />
      <span>{subscribed ? 'Berlangganan' : 'Langganan Rilis'}</span>
    </button>
  );
}
