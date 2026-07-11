// =========================================================================
// MetaFore Technologies - Translations Exporter
// =========================================================================

import { en } from './en';
import { bn } from './bn';
import type { Language, TranslationDictionary } from './types';

// দুটি ভাষাকে একটি অবজেক্টের মধ্যে যুক্ত করা হলো, যা পরবর্তীতে কনটেক্সট থেকে কল করা হবে
export const translations: Record<Language, TranslationDictionary> = {
  en,
  bn,
};

// টাইপগুলো অন্য ফাইলে ব্যবহারের জন্য এক্সপোর্ট করা হলো
export type { Language, TranslationDictionary };