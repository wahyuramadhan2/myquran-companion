import { useState, useRef, useCallback, useEffect } from 'react';
import type { Verse } from '@/types/quran';
import { getSettings } from '@/lib/storage';

interface UseAudioPlayerOptions {
  verses: Verse[];
  onVerseChange?: (verseKey: string) => void;
}

interface AudioPlayerState {
  isPlaying: boolean;
  currentVerseKey: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  isPlayingAll: boolean;
}

export function useAudioPlayer({ verses, onVerseChange }: UseAudioPlayerOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentVerseKey: null,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackSpeed: getSettings().playbackSpeed,
    isPlayingAll: false,
  });

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = state.volume;
      audioRef.current.playbackRate = state.playbackSpeed;

      audioRef.current.addEventListener('timeupdate', () => {
        setState(prev => ({
          ...prev,
          currentTime: audioRef.current?.currentTime || 0,
        }));
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        setState(prev => ({
          ...prev,
          duration: audioRef.current?.duration || 0,
        }));
      });

      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setState(prev => ({ ...prev, isPlaying: false }));
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handleEnded = useCallback(() => {
    setState(prev => {
      if (prev.isPlayingAll && prev.currentVerseKey) {
        const currentIndex = verses.findIndex(v => v.verse_key === prev.currentVerseKey);
        if (currentIndex < verses.length - 1) {
          const nextVerse = verses[currentIndex + 1];
          if (nextVerse.audio?.url) {
            setTimeout(() => playVerse(nextVerse.verse_key), 100);
          }
          return prev;
        }
      }
      return { ...prev, isPlaying: false, isPlayingAll: false };
    });
  }, [verses]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.removeEventListener('ended', handleEnded);
      audioRef.current.addEventListener('ended', handleEnded);
    }
  }, [handleEnded]);

  const playVerse = useCallback((verseKey: string) => {
    const verse = verses.find(v => v.verse_key === verseKey);
    if (!verse?.audio?.url || !audioRef.current) return;

    audioRef.current.src = verse.audio.url;
    audioRef.current.playbackRate = state.playbackSpeed;
    audioRef.current.play().catch(console.error);

    setState(prev => ({
      ...prev,
      isPlaying: true,
      currentVerseKey: verseKey,
    }));

    onVerseChange?.(verseKey);
  }, [verses, state.playbackSpeed, onVerseChange]);

  const playAll = useCallback((startVerseKey?: string) => {
    const startIndex = startVerseKey
      ? verses.findIndex(v => v.verse_key === startVerseKey)
      : 0;
    
    if (startIndex >= 0 && verses[startIndex]?.audio?.url) {
      setState(prev => ({ ...prev, isPlayingAll: true }));
      playVerse(verses[startIndex].verse_key);
    }
  }, [verses, playVerse]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play().catch(console.error);
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else if (state.currentVerseKey) {
      resume();
    }
  }, [state.isPlaying, state.currentVerseKey, pause, resume]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPlayingAll: false,
      currentVerseKey: null,
      currentTime: 0,
    }));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setState(prev => ({ ...prev, volume }));
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setState(prev => ({ ...prev, playbackSpeed: speed }));
  }, []);

  const nextVerse = useCallback(() => {
    if (!state.currentVerseKey) return;
    const currentIndex = verses.findIndex(v => v.verse_key === state.currentVerseKey);
    if (currentIndex < verses.length - 1) {
      playVerse(verses[currentIndex + 1].verse_key);
    }
  }, [state.currentVerseKey, verses, playVerse]);

  const prevVerse = useCallback(() => {
    if (!state.currentVerseKey) return;
    const currentIndex = verses.findIndex(v => v.verse_key === state.currentVerseKey);
    if (currentIndex > 0) {
      playVerse(verses[currentIndex - 1].verse_key);
    }
  }, [state.currentVerseKey, verses, playVerse]);

  return {
    ...state,
    playVerse,
    playAll,
    pause,
    resume,
    togglePlay,
    stop,
    seekTo,
    setVolume,
    setPlaybackSpeed,
    nextVerse,
    prevVerse,
  };
}
