export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Data sourced from{' '}
            <a
              href="https://quran.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Quran.com API
            </a>
            {' '}and{' '}
            <a
              href="https://quranenc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              QuranEnc
            </a>
          </p>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              English Translation: Saheeh International
            </p>
            <p>
              Indonesian Translation: Kementerian Agama Republik Indonesia
            </p>
            <p>
              Dutch Translation: Sofian S. Siregar
            </p>
          </div>

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            © {new Date().getFullYear()} Quran Web. The Quran text is sacred and
            displayed as-is from authentic sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
