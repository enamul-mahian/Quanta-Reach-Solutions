// =========================================================================
// MetaFore Technologies - Application Providers Wrapper
// =========================================================================

import React, { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders কম্পোনেন্টটি পুরো অ্যাপ্লিকেশনকে প্রয়োজনীয় কনটেক্সট দিয়ে মুড়িয়ে রাখে।
 * HelmetProvider: ডাইনামিক এসইও (SEO) মেটা ট্যাগ যুক্ত করার জন্য।
 * ThemeProvider: ডার্ক/লাইট থিম ম্যানেজমেন্টের জন্য।
 * LanguageProvider: ইংরেজি/বাংলা ভাষা ম্যানেজমেন্টের জন্য।
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};