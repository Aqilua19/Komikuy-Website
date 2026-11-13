'use client';

import { ReaderSettingsType } from '@/types/comic';

const SETTINGS_KEY = 'komakatsu_reader_settings';

const DEFAULT_SETTINGS: ReaderSettingsType = {
  background: 'dark',
  imageWidth: 'normal',
  pageGap: 'medium',
  autoHideControls: true,
};

export const getReaderSettings = (): ReaderSettingsType => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Error reading reader settings:', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveReaderSettings = (settings: Partial<ReaderSettingsType>): ReaderSettingsType => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const current = getReaderSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('reader-settings-updated'));
    return updated;
  } catch (e) {
    console.error('Error saving reader settings:', e);
    return DEFAULT_SETTINGS;
  }
};
