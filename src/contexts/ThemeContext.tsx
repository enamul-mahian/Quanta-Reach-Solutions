// =========================================================================
// MetaFore Technologies - Theme Context Provider
// =========================================================================

import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // লোকাল স্টোরেজ থেকে সেভ করা থিম চেক করা, না থাকলে আমাদের প্রজেক্টের ডিফল্ট 'dark' থিম সেট করা
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('metafore_theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme as Theme;
    }
    return 'dark'; // মেটাফোর টেকনোলজিসের ব্র্যান্ড আইডেন্টিটি অনুযায়ী ডিফল্ট ডার্ক থিম
  });

  // থিম টগল করার ফাংশন
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // থিম পরিবর্তন হলে তা স্টোরেজে সেভ করা এবং HTML ক্লাসে 'dark' ক্লাস যুক্ত বা রিমুভ করা (Tailwind-এর জন্য)
  useEffect(() => {
    localStorage.setItem('metafore_theme', theme);
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};