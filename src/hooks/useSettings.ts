import { useState, useCallback, useEffect } from 'react';
import type { AppSettings, Language } from '@/types/quran';
import { getSettings, saveSettings } from '@/lib/storage';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings);

  // Sync with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setSettings(getSettings());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const setLanguage = useCallback((language: Language) => {
    updateSettings({ language });
  }, [updateSettings]);

  const setReciter = useCallback((reciterId: number) => {
    updateSettings({ reciterId });
  }, [updateSettings]);

  const setPlaybackSpeed = useCallback((playbackSpeed: number) => {
    updateSettings({ playbackSpeed });
  }, [updateSettings]);

  const toggleTransliteration = useCallback(() => {
    updateSettings({ showTransliteration: !settings.showTransliteration });
  }, [settings.showTransliteration, updateSettings]);

  return {
    settings,
    updateSettings,
    setLanguage,
    setReciter,
    setPlaybackSpeed,
    toggleTransliteration,
  };
}
