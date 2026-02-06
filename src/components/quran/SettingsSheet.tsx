import { X } from 'lucide-react';
import type { Reciter, Language, AppSettings } from '@/types/quran';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ReciterSelect } from './ReciterSelect';
import { LanguageToggle } from './LanguageToggle';

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AppSettings;
  reciters: Reciter[];
  recitersLoading: boolean;
  onLanguageChange: (language: Language) => void;
  onReciterChange: (reciterId: number) => void;
  onTransliterationToggle: () => void;
}

export function SettingsSheet({
  open,
  onOpenChange,
  settings,
  reciters,
  recitersLoading,
  onLanguageChange,
  onReciterChange,
  onTransliterationToggle,
}: SettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Language */}
          <div className="space-y-2">
            <Label>Translation Language</Label>
            <LanguageToggle
              value={settings.language}
              onChange={onLanguageChange}
            />
          </div>

          {/* Reciter */}
          <div className="space-y-2">
            <Label>Reciter</Label>
            <ReciterSelect
              reciters={reciters}
              value={settings.reciterId}
              onChange={onReciterChange}
              isLoading={recitersLoading}
            />
          </div>

          {/* Transliteration */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Transliteration</Label>
              <p className="text-xs text-muted-foreground">
                Display Latin pronunciation guide
              </p>
            </div>
            <Switch
              checked={settings.showTransliteration}
              onCheckedChange={onTransliterationToggle}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
