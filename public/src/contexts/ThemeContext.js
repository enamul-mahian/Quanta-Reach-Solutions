import { jsx as _jsx } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Theme Context Provider
// =========================================================================
import React, { createContext, useState, useEffect } from 'react';
export const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }) => {
    // লোকাল স্টোরেজ থেকে সেভ করা থিম চেক করা, না থাকলে আমাদের প্রজেক্টের ডিফল্ট 'dark' থিম সেট করা
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('quantareach_theme') || localStorage.getItem('metafore_theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        return 'dark'; // Quanta Reach Solutions ব্র্যান্ড আইডেন্টিটি অনুযায়ী ডিফল্ট ডার্ক থিম
    });
    // থিম টগল করার ফাংশন
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };
    // থিম পরিবর্তন হলে তা স্টোরেজে সেভ করা এবং HTML ক্লাসে 'dark' ক্লাস যুক্ত বা রিমুভ করা (Tailwind-এর জন্য)
    useEffect(() => {
        localStorage.setItem('quantareach_theme', theme);
        localStorage.removeItem('metafore_theme');
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        }
        else {
            root.classList.remove('dark');
        }
    }, [theme]);
    const value = {
        theme,
        toggleTheme,
    };
    return (_jsx(ThemeContext.Provider, { value: value, children: children }));
};
