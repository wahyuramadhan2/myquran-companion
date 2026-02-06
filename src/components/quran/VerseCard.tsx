import { memo, useState } from 'react';
import { Play, Pause, ChevronDown, ChevronUp } from 'lucide-react';
import type { Verse } from '@/types/quran';
import { Button } from '@/components/ui/button';
import { WordByWord } from './WordByWord';
import { cn } from '@/lib/utils';

interface VerseCardProps {
  verse: Verse;
  isPlaying: boolean;
  isActive: boolean;
  showTransliteration: boolean;
  onPlay: () => void;
  onPause: () => void;
  onWordClick?: (audioUrl: string) => void;
}

export const VerseCard = memo(function VerseCard({
  verse,
  isPlaying,
  isActive,
  showTransliteration,
  onPlay,
  onPause,
  onWordClick,
}: VerseCardProps) {
  const [showWordByWord, setShowWordByWord] = useState(false);

  const translation = verse.translations?.[0]?.text || '';
  const verseNumber = verse.verse_key.split(':')[1];

  // Get transliteration from words
  const transliteration = verse.words
    ?.filter(w => w.char_type_name === 'word')
    .map(w => w.transliteration?.text)
    .filter(Boolean)
    .join(' ');

  return (
    <div
      id={`verse-${verse.verse_number}`}
      className={cn('verse-card', isActive && 'active')}
    >
      {/* Header with verse number and play button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {verseNumber}
          </span>
          <span className="text-xs text-muted-foreground">
            {verse.verse_key}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            onClick={() => setShowWordByWord(!showWordByWord)}
          >
            {showWordByWord ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="ml-1 text-xs">Word by Word</span>
          </Button>
          
          {verse.audio?.url && (
            <Button
              size="icon"
              variant={isActive ? 'default' : 'outline'}
              className={cn(
                'w-9 h-9 rounded-full',
                isActive && isPlaying && 'animate-pulse-gold'
              )}
              onClick={isPlaying && isActive ? onPause : onPlay}
            >
              {isPlaying && isActive ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Arabic Text */}
      <p className="arabic-text text-right mb-4 select-text" dir="rtl">
        {verse.text_uthmani}
      </p>

      {/* Transliteration */}
      {showTransliteration && transliteration && (
        <p className="transliteration-text text-sm mb-3">
          {transliteration}
        </p>
      )}

      {/* Translation */}
      <p
        className="translation-text text-sm"
        dangerouslySetInnerHTML={{ __html: translation }}
      />

      {/* Word by Word */}
      {showWordByWord && verse.words && (
        <WordByWord
          words={verse.words}
          onWordClick={onWordClick}
        />
      )}
    </div>
  );
});
