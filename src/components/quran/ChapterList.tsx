import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Chapter } from '@/types/quran';
import { Skeleton } from '@/components/ui/skeleton';

interface ChapterListProps {
  chapters: Chapter[];
  searchQuery: string;
  isLoading?: boolean;
}

export function ChapterList({ chapters, searchQuery, isLoading }: ChapterListProps) {
  const navigate = useNavigate();

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    
    const query = searchQuery.toLowerCase().trim();
    const queryNum = parseInt(query);
    
    return chapters.filter(chapter => {
      if (!isNaN(queryNum) && chapter.id === queryNum) return true;
      if (chapter.name_simple.toLowerCase().includes(query)) return true;
      if (chapter.name_arabic.includes(query)) return true;
      if (chapter.translated_name?.name.toLowerCase().includes(query)) return true;
      return false;
    });
  }, [chapters, searchQuery]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="surah-card">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredChapters.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No surahs found matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {filteredChapters.map(chapter => (
        <button
          key={chapter.id}
          onClick={() => navigate(`/surah/${chapter.id}`)}
          className="surah-card text-left group"
        >
          <div className="surah-number group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
            {chapter.id}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {chapter.name_simple}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {chapter.translated_name?.name} • {chapter.verses_count} ayat
            </p>
          </div>
          
          <div className="font-arabic text-2xl text-primary opacity-80 group-hover:opacity-100 transition-opacity">
            {chapter.name_arabic}
          </div>
        </button>
      ))}
    </div>
  );
}
