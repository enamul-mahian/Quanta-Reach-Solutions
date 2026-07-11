// =========================================================================
// MetaFore Technologies - useTheme Custom Hook
// =========================================================================

import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

/**
 * এই কাস্টম হুকটি ওয়েবসাইটের যেকোনো জায়গা থেকে বর্তমান থিম (light/dark) 
 * এবং থিম পরিবর্তন করার ফাংশন অ্যাক্সেস করতে ব্যবহার করা হবে। 
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // যদি ভুলে ThemeProvider-এর বাইরে এই হুক ব্যবহার করা হয়, তবে একটি ওয়ার্নিং দেবে
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};