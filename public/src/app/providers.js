import { jsx as _jsx } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Application Providers Wrapper
// =========================================================================
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '/src/contexts/ThemeContext.js';
import { LanguageProvider } from '/src/contexts/LanguageContext.js';
/**
 * AppProviders কম্পোনেন্টটি পুরো অ্যাপ্লিকেশনকে প্রয়োজনীয় কনটেক্সট দিয়ে মুড়িয়ে রাখে।
 * HelmetProvider: ডাইনামিক এসইও (SEO) মেটা ট্যাগ যুক্ত করার জন্য।
 * ThemeProvider: ডার্ক/লাইট থিম ম্যানেজমেন্টের জন্য।
 * LanguageProvider: ইংরেজি/বাংলা ভাষা ম্যানেজমেন্টের জন্য।
 */
export const AppProviders = ({ children }) => {
    return (_jsx(HelmetProvider, { children: _jsx(ThemeProvider, { children: _jsx(LanguageProvider, { children: children }) }) }));
};
