import { jsx as _jsx } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Language Context Provider
// =========================================================================
import React, { createContext, useState, useEffect } from 'react';
import { translations } from '/src/i18n/index.js';
export const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children }) => {
    // লোকাল স্টোরেজ থেকে সেভ করা ভাষা চেক করা, না থাকলে ব্রাউজারের ডিফল্ট ভাষা অনুযায়ী সেট করা
    const [language, setLanguageState] = useState(() => {
        const savedLang = localStorage.getItem('quantareach_lang');
        if (savedLang === 'en' || savedLang === 'bn') {
            return savedLang;
        }
        // ব্রাউজারের ভাষা যদি বাংলা হয়, তবে ডিফল্টভাবে বাংলা দেখাবে
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('bn')) {
            return 'bn';
        }
        // অন্যথায় গ্লোবাল ক্লায়েন্টদের জন্য ডিফল্ট ইংরেজি
        return 'en';
    });
    const setLanguage = (lang) => {
        setLanguageState(lang);
    };
    // ভাষা পরিবর্তন হলে তা স্টোরেজে সেভ করা এবং SEO-এর জন্য HTML lang অ্যাট্রিবিউট আপডেট করা
    useEffect(() => {
        localStorage.setItem('quantareach_lang', language);
        document.documentElement.lang = language;
    }, [language]);
    const value = {
        language,
        setLanguage,
        t: translations[language], // বর্তমান ভাষার ডিকশনারিটি পাস করা হচ্ছে
    };
    return (_jsx(LanguageContext.Provider, { value: value, children: children }));
};
