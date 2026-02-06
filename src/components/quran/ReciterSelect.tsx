import { Mic } from 'lucide-react';
import type { Reciter } from '@/types/quran';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReciterSelectProps {
  reciters: Reciter[];
  value: number;
  onChange: (reciterId: number) => void;
  isLoading?: boolean;
}

export function ReciterSelect({
  reciters,
  value,
  onChange,
  isLoading,
}: ReciterSelectProps) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(v) => onChange(parseInt(v))}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full sm:w-[200px]">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-muted-foreground" />
          <SelectValue placeholder="Select Reciter" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {reciters.map(reciter => (
          <SelectItem key={reciter.id} value={reciter.id.toString()}>
            {reciter.reciter_name}
            {reciter.style && (
              <span className="text-muted-foreground ml-1">
                ({reciter.style})
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
