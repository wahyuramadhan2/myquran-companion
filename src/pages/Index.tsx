import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { Header } from '@/components/quran/Header';
import { Footer } from '@/components/quran/Footer';
import { ChapterList } from '@/components/quran/ChapterList';
import { SearchInput } from '@/components/quran/SearchInput';
import { SettingsSheet } from '@/components/quran/SettingsSheet';
import { LanguageToggle } from '@/components/quran/LanguageToggle';
import { ReciterSelect } from '@/components/quran/ReciterSelect';
import { getChapters, getReciters } from '@/lib/api';
import { useSettings } from '@/hooks/useSettings';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const { settings, setLanguage, setReciter, toggleTransliteration } = useSettings();

  const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ['chapters'],
    queryFn: getChapters,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: reciters = [], isLoading: recitersLoading } = useQuery({
    queryKey: ['reciters'],
    queryFn: getReciters,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header showSettings onSettingsClick={() => setSettingsOpen(true)} />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-emerald-light to-background">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6 emerald-glow">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Al-Qur'an al-Kareem
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Read the Holy Quran with audio recitation, translation, and word-by-word analysis
            </p>

            {/* Quick Settings */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <LanguageToggle value={settings.language} onChange={setLanguage} />
              <ReciterSelect
                reciters={reciters}
                value={settings.reciterId}
                onChange={setReciter}
                isLoading={recitersLoading}
              />
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by surah name or number..."
              />
            </div>
          </div>
        </section>

        {/* Chapters List */}
        <section className="py-8">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {searchQuery ? 'Search Results' : 'All Surahs'}
              {!chaptersLoading && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({chapters.length} surahs)
                </span>
              )}
            </h2>
            
            <ChapterList
              chapters={chapters}
              searchQuery={searchQuery}
              isLoading={chaptersLoading}
            />
          </div>
        </section>
      </main>

      <Footer />

      <SettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        reciters={reciters}
        recitersLoading={recitersLoading}
        onLanguageChange={setLanguage}
        onReciterChange={setReciter}
        onTransliterationToggle={toggleTransliteration}
      />
    </div>
  );
}
