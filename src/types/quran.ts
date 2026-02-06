export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Word {
  id: number;
  position: number;
  audio_url?: string;
  char_type_name: string;
  text_uthmani: string;
  text_indopak?: string;
  translation?: {
    text: string;
    language_name: string;
  };
  transliteration?: {
    text: string;
    language_name: string;
  };
}

export interface Translation {
  id: number;
  resource_id: number;
  resource_name?: string;
  text: string;
}

export interface Verse {
  id: number;
  verse_key: string;
  verse_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
  text_uthmani: string;
  text_indopak?: string;
  words?: Word[];
  translations?: Translation[];
  audio?: {
    url: string;
  };
}

export interface Reciter {
  id: number;
  reciter_name: string;
  style?: string;
  translated_name?: {
    name: string;
    language_name: string;
  };
}

export interface TranslationResource {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export type Language = 'id' | 'en' | 'nl';

export interface AppSettings {
  reciterId: number;
  language: Language;
  showTransliteration: boolean;
  playbackSpeed: number;
}
