// =========================================================================
// MetaFore Technologies - useLanguage Custom Hook
// =========================================================================

import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

/**
 * এই কাস্টম হুকটি ওয়েবসাইটের যেকোনো জায়গা থেকে বর্তমান ভাষা এবং ট্রান্সলেশন ডিকশনারি 
 * অ্যাক্সেস করতে ব্যবহার করা হবে। 
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  // যদি ভুলে LanguageProvider-এর বাইরে এই হুক ব্যবহার করা হয়, তবে একটি ওয়ার্নিং দেবে
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};