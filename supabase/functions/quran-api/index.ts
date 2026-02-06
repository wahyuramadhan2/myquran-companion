import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory cache with TTL
const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
  
  // Clean old entries if cache gets too big
  if (cache.size > 500) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (v.expires < now) cache.delete(k);
    }
  }
}

const QURAN_API_BASE = 'https://api.quran.com/api/v4';
const AUDIO_CDN_BASE = 'https://verses.quran.com';
const WORD_AUDIO_CDN = 'https://audio.qurancdn.com';

async function fetchWithCache(url: string, cacheKey: string): Promise<unknown> {
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return cached;
  }

  console.log(`Fetching: ${url}`);
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limited. Please try again later.');
    }
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { endpoint, ...params } = body;

    let result: unknown;

    switch (endpoint) {
      case 'chapters': {
        const data = await fetchWithCache(
          `${QURAN_API_BASE}/chapters?language=en`,
          'chapters'
        ) as { chapters: unknown[] };
        result = data.chapters;
        break;
      }

      case 'chapter': {
        const { chapterId } = params;
        const data = await fetchWithCache(
          `${QURAN_API_BASE}/chapters/${chapterId}?language=en`,
          `chapter-${chapterId}`
        ) as { chapter: unknown };
        result = data.chapter;
        break;
      }

      case 'verses': {
        const { chapterId, translationId, reciterId, page = 1, perPage = 50, words = true } = params;
        
        const queryParams = new URLSearchParams({
          language: 'en',
          words: words.toString(),
          translations: translationId?.toString() || '131',
          audio: reciterId?.toString() || '7',
          word_fields: 'text_uthmani,text_indopak,audio_url',
          translation_fields: 'resource_name,language_id',
          per_page: perPage.toString(),
          page: page.toString(),
        });

        const cacheKey = `verses-${chapterId}-${translationId}-${reciterId}-${page}-${perPage}`;
        const data = await fetchWithCache(
          `${QURAN_API_BASE}/verses/by_chapter/${chapterId}?${queryParams}`,
          cacheKey
        ) as { verses: Array<{ audio?: { url?: string }; words?: Array<{ audio_url?: string }> }>; pagination: unknown };
        
        // Transform relative audio URLs to absolute URLs
        const transformedVerses = data.verses.map((verse) => ({
          ...verse,
          audio: verse.audio?.url ? {
            ...verse.audio,
            url: verse.audio.url.startsWith('http') ? verse.audio.url : `${AUDIO_CDN_BASE}/${verse.audio.url}`,
          } : verse.audio,
          words: verse.words?.map((word) => ({
            ...word,
            audio_url: word.audio_url && !word.audio_url.startsWith('http') 
              ? `${WORD_AUDIO_CDN}/${word.audio_url}` 
              : word.audio_url,
          })),
        }));
        
        result = {
          verses: transformedVerses,
          pagination: data.pagination,
        };
        break;
      }

      case 'reciters': {
        const data = await fetchWithCache(
          `${QURAN_API_BASE}/resources/recitations?language=en`,
          'reciters'
        ) as { recitations: unknown[] };
        result = data.recitations;
        break;
      }

      case 'translations': {
        const { language = 'en' } = params;
        const data = await fetchWithCache(
          `${QURAN_API_BASE}/resources/translations?language=${language}`,
          `translations-${language}`
        ) as { translations: unknown[] };
        result = data.translations;
        break;
      }

      case 'quranenc': {
        // QuranEnc fallback for Dutch translations
        const { chapterId, verseNumber, language = 'dutch' } = params;
        const langCode = language === 'dutch' ? 'dutch_abdulislam' : 
                        language === 'indonesian' ? 'indonesian_sabiq' : 'english_saheeh';
        
        const cacheKey = `quranenc-${chapterId}-${verseNumber}-${langCode}`;
        const cached = getCached<string>(cacheKey);
        if (cached) {
          result = cached;
          break;
        }

        const response = await fetch(
          `https://quranenc.com/api/v1/translation/aya/${langCode}/${chapterId}/${verseNumber}`
        );
        
        if (!response.ok) {
          throw new Error(`QuranEnc API error: ${response.status}`);
        }
        
        const data = await response.json() as { result?: { translation?: string } };
        const translation = data.result?.translation || '';
        setCache(cacheKey, translation);
        result = translation;
        break;
      }

      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
