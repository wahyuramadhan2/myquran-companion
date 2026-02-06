import type { AppSettings, Language } from '@/types/quran';

const SETTINGS_KEY = 'quran-web-settings';

const DEFAULT_SETTINGS: AppSettings = {
  reciterId: 7, // Mishary Rashid Alafasy
  language: 'en',
  showTransliteration: true,
  playbackSpeed: 1,
};

export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<AppSettings>): void {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function setLanguage(language: Language): void {
  saveSettings({ language });
}

export function setReciter(reciterId: number): void {
  saveSettings({ reciterId });
}

export function setPlaybackSpeed(speed: number): void {
  saveSettings({ playbackSpeed: speed });
}

export function toggleTransliteration(): void {
  const current = getSettings();
  saveSettings({ showTransliteration: !current.showTransliteration });
}
