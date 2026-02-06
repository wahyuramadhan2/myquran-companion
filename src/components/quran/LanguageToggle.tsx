import { Languages } from 'lucide-react';
import type { Language } from '@/types/quran';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  value: Language;
  onChange: (language: Language) => void;
}

const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'nl', label: 'Nederlands', flag: '🇳🇱' },
];

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  const current = LANGUAGES.find(l => l.value === value) || LANGUAGES[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span>{current.flag}</span>
          <Languages className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(lang => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => onChange(lang.value)}
            className={cn(
              'gap-2 cursor-pointer',
              value === lang.value && 'bg-accent'
            )}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
