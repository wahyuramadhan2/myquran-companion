import { Link } from 'react-router-dom';
import { BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export function Header({ showSettings, onSettingsClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-foreground">
                Quran Web
              </h1>
              <p className="text-xs text-muted-foreground">
                Read • Listen • Learn
              </p>
            </div>
          </Link>

          {showSettings && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
