import { useState, useRef } from 'react';
import type { Word } from '@/types/quran';
import { cn } from '@/lib/utils';

interface WordByWordProps {
  words: Word[];
  onWordClick?: (audioUrl: string) => void;
}

export function WordByWord({ words, onWordClick }: WordByWordProps) {
  const [playingWordId, setPlayingWordId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleWordClick = (word: Word) => {
    if (word.audio_url) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.addEventListener('ended', () => setPlayingWordId(null));
      }
      
      audioRef.current.src = word.audio_url;
      audioRef.current.play().catch(console.error);
      setPlayingWordId(word.id);
      
      onWordClick?.(word.audio_url);
    } else {
      // Just highlight if no audio
      setPlayingWordId(word.id);
      setTimeout(() => setPlayingWordId(null), 500);
    }
  };

  // Filter only actual words (not end markers)
  const actualWords = words.filter(w => w.char_type_name === 'word');

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
        Word by Word
      </p>
      
      <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
        {actualWords.map(word => (
          <button
            key={word.id}
            onClick={() => handleWordClick(word)}
            className={cn(
              'word-chip',
              playingWordId === word.id && 'playing'
            )}
          >
            <span className="font-arabic text-lg text-arabic">
              {word.text_uthmani}
            </span>
            {word.transliteration?.text && (
              <span className="text-xs text-transliteration mt-1">
                {word.transliteration.text}
              </span>
            )}
            {word.translation?.text && (
              <span className="text-xs text-muted-foreground mt-0.5">
                {word.translation.text}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
