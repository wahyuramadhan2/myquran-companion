import { supabase } from '@/integrations/supabase/client';
import type { Chapter, Verse, Reciter, TranslationResource, Language } from '@/types/quran';

const TRANSLATION_IDS: Record<Language, number> = {
  id: 33,  // Indonesian - King Fahad Quran Complex
  en: 131, // English - Saheeh International
  nl: 144, // Dutch - Sofian S. Siregar (if available, fallback to en)
};

// Helper to call edge functions
async function callApi<T>(
  functionName: string,
  params: Record<string, string | number | boolean>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: params,
  });

  if (error) {
    console.error(`API Error (${functionName}):`, error);
    throw new Error(error.message || 'API request failed');
  }

  return data as T;
}

export async function getChapters(): Promise<Chapter[]> {
  return callApi<Chapter[]>('quran-api', { endpoint: 'chapters' });
}

export async function getChapter(id: number): Promise<Chapter> {
  return callApi<Chapter>('quran-api', { endpoint: 'chapter', chapterId: id });
}

export async function getVerses(
  chapterId: number,
  language: Language = 'en',
  reciterId: number = 7,
  page: number = 1,
  perPage: number = 50
): Promise<{ verses: Verse[]; pagination: { total_pages: number; current_page: number; total_records: number } }> {
  const translationId = TRANSLATION_IDS[language] || TRANSLATION_IDS.en;
  
  return callApi('quran-api', {
    endpoint: 'verses',
    chapterId,
    translationId,
    reciterId,
    page,
    perPage,
    words: true,
  });
}

export async function getReciters(): Promise<Reciter[]> {
  return callApi<Reciter[]>('quran-api', { endpoint: 'reciters' });
}

export async function getTranslations(language: string = 'en'): Promise<TranslationResource[]> {
  return callApi<TranslationResource[]>('quran-api', { endpoint: 'translations', language });
}

// QuranEnc fallback for Dutch translations if needed
export async function getQuranEncTranslation(
  chapterId: number,
  verseNumber: number,
  language: 'indonesian' | 'english' | 'dutch' = 'dutch'
): Promise<string> {
  return callApi<string>('quran-api', {
    endpoint: 'quranenc',
    chapterId,
    verseNumber,
    language,
  });
}
