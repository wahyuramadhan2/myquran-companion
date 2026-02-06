import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AudioPlayerBarProps {
  isVisible: boolean;
  isPlaying: boolean;
  currentVerseKey: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  chapterName?: string;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onSpeedChange: (speed: number) => void;
  onStop: () => void;
}

const SPEED_OPTIONS = [0.75, 0.85, 1, 1.15, 1.25];

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayerBar({
  isVisible,
  isPlaying,
  currentVerseKey,
  currentTime,
  duration,
  volume,
  playbackSpeed,
  chapterName,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onSpeedChange,
  onStop,
}: AudioPlayerBarProps) {
  if (!isVisible) return null;

  return (
    <div className={cn('player-bar animate-slide-up', isVisible && 'block')}>
      <div className="container max-w-4xl mx-auto px-4 py-3">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-player-foreground/70 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={([value]) => onSeek(value)}
            className="flex-1"
          />
          <span className="text-xs text-player-foreground/70 w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Now playing info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-player-foreground truncate">
              {chapterName || 'Quran Web'}
            </p>
            {currentVerseKey && (
              <p className="text-xs text-player-foreground/70">
                Ayah {currentVerseKey}
              </p>
            )}
          </div>

          {/* Main controls */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9 text-player-foreground hover:bg-player-foreground/10"
              onClick={onPrev}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              className="w-12 h-12 rounded-full bg-player-foreground text-player hover:bg-player-foreground/90"
              onClick={onTogglePlay}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9 text-player-foreground hover:bg-player-foreground/10"
              onClick={onNext}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume and speed */}
          <div className="flex-1 flex items-center justify-end gap-4">
            {/* Speed */}
            <Select
              value={playbackSpeed.toString()}
              onValueChange={(v) => onSpeedChange(parseFloat(v))}
            >
              <SelectTrigger className="w-20 h-8 text-xs bg-transparent border-player-foreground/20 text-player-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPEED_OPTIONS.map(speed => (
                  <SelectItem key={speed} value={speed.toString()}>
                    {speed}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 w-32">
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-player-foreground hover:bg-player-foreground/10"
                onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => onVolumeChange(value / 100)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
