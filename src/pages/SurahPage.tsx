import { useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowLeft, Play, Settings } from 'lucide-react';
import { Header } from '@/components/quran/Header';
import { Footer } from '@/components/quran/Footer';
import { VerseCard } from '@/components/quran/VerseCard';
import { AudioPlayerBar } from '@/components/quran/AudioPlayerBar';
import { SettingsSheet } from '@/components/quran/SettingsSheet';
import { VerseListSkeleton } from '@/components/quran/VerseSkeleton';
import { LanguageToggle } from '@/components/quran/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getChapter, getVerses, getReciters } from '@/lib/api';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSettings } from '@/hooks/useSettings';
import { useState } from 'react';

export default function SurahPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const chapterId = parseInt(id || '1');
  const targetAyah = searchParams.get('ayah');
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToAyah = useRef(false);
  
  const { settings, setLanguage, setReciter, toggleTransliteration } = useSettings();

  // Fetch chapter info
  const { data: chapter, isLoading: chapterLoading } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => getChapter(chapterId),
    staleTime: 1000 * 60 * 60,
  });

  // Fetch all verses for the chapter
  const { data: versesData, isLoading: versesLoading } = useQuery({
    queryKey: ['verses', chapterId, settings.language, settings.reciterId],
    queryFn: () => getVerses(chapterId, settings.language, settings.reciterId, 1, 300),
    staleTime: 1000 * 60 * 30,
  });

  const verses = versesData?.verses || [];

  // Fetch reciters
  const { data: reciters = [], isLoading: recitersLoading } = useQuery({
    queryKey: ['reciters'],
    queryFn: getReciters,
    staleTime: 1000 * 60 * 60,
  });

  // Audio player
  const handleVerseChange = useCallback((verseKey: string) => {
    const verseNumber = parseInt(verseKey.split(':')[1]);
    const element = document.getElementById(`verse-${verseNumber}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const audioPlayer = useAudioPlayer({
    verses,
    onVerseChange: handleVerseChange,
  });

  // Virtual list for performance
  const rowVirtualizer = useVirtualizer({
    count: verses.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 300, // Estimated row height
    overscan: 5,
  });

  // Scroll to target ayah on load
  useEffect(() => {
    if (targetAyah && verses.length > 0 && !hasScrolledToAyah.current) {
      hasScrolledToAyah.current = true;
      const ayahNumber = parseInt(targetAyah);
      const index = verses.findIndex(v => v.verse_number === ayahNumber);
      
      if (index >= 0) {
        setTimeout(() => {
          rowVirtualizer.scrollToIndex(index, { align: 'start' });
        }, 100);
      }
    }
  }, [targetAyah, verses, rowVirtualizer]);

  const isLoading = chapterLoading || versesLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Header showSettings onSettingsClick={() => setSettingsOpen(true)} />

      <main className="flex-1 pb-32">
        {/* Surah Header */}
        <section className="bg-gradient-to-b from-emerald-light to-background py-8">
          <div className="container max-w-4xl mx-auto px-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Surahs
            </Link>

            {chapterLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-6 w-32" />
              </div>
            ) : chapter ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-semibold">
                      {chapter.id}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {chapter.name_simple}
                    </h1>
                    <span className="font-arabic text-3xl text-primary">
                      {chapter.name_arabic}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {chapter.translated_name?.name} • {chapter.verses_count} Ayat •{' '}
                    {chapter.revelation_place === 'makkah' ? 'Makiyyah' : 'Madaniyyah'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <LanguageToggle value={settings.language} onChange={setLanguage} />
                  
                  <Button
                    onClick={() => audioPlayer.playAll()}
                    disabled={verses.length === 0}
                    className="gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Play All
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Bismillah */}
        {chapter?.bismillah_pre && (
          <div className="text-center py-8">
            <p className="font-arabic text-3xl text-primary">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              In the name of Allah, the Most Gracious, the Most Merciful
            </p>
          </div>
        )}

        {/* Verses */}
        <section className="py-4">
          <div className="container max-w-4xl mx-auto px-4">
            {isLoading ? (
              <VerseListSkeleton count={5} />
            ) : (
              <div
                ref={scrollContainerRef}
                className="relative"
                style={{ height: '100%' }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const verse = verses[virtualRow.index];
                    return (
                      <div
                        key={verse.id}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <div className="py-2">
                          <VerseCard
                            verse={verse}
                            isPlaying={audioPlayer.isPlaying}
                            isActive={audioPlayer.currentVerseKey === verse.verse_key}
                            showTransliteration={settings.showTransliteration}
                            onPlay={() => audioPlayer.playVerse(verse.verse_key)}
                            onPause={audioPlayer.pause}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Audio Player Bar */}
      <AudioPlayerBar
        isVisible={audioPlayer.currentVerseKey !== null}
        isPlaying={audioPlayer.isPlaying}
        currentVerseKey={audioPlayer.currentVerseKey}
        currentTime={audioPlayer.currentTime}
        duration={audioPlayer.duration}
        volume={audioPlayer.volume}
        playbackSpeed={audioPlayer.playbackSpeed}
        chapterName={chapter?.name_simple}
        onTogglePlay={audioPlayer.togglePlay}
        onNext={audioPlayer.nextVerse}
        onPrev={audioPlayer.prevVerse}
        onSeek={audioPlayer.seekTo}
        onVolumeChange={audioPlayer.setVolume}
        onSpeedChange={audioPlayer.setPlaybackSpeed}
        onStop={audioPlayer.stop}
      />

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
