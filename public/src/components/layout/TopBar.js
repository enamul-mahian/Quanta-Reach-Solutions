import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Top Information Bar
// =========================================================================
import React from 'react';
import { Mail, Phone, Clock } from 'lucide-react';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Container } from '/src/components/common/Container.js';
import { SITE } from '/src/config/site.js';
export const TopBar = () => {
    const { t, language, setLanguage } = useLanguage();
    return (_jsx("div", { className: "bg-navy-surface border-b border-borderColor hidden lg:block py-2 relative z-50", children: _jsx(Container, { children: _jsxs("div", { className: "flex justify-between items-center text-xs text-soft-gray font-medium", children: [_jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-electric" }), _jsxs("span", { children: [t.contact.businessHours, ": 10:00 AM - 07:00 PM"] })] }), _jsxs("a", { href: `mailto:${SITE.email}`, className: "flex items-center space-x-2 hover:text-white transition-colors", children: [_jsx(Mail, { className: "w-3.5 h-3.5 text-electric" }), _jsx("span", { children: SITE.email })] }), _jsxs("a", { href: SITE.phoneHref, className: "flex items-center space-x-2 hover:text-white transition-colors", children: [_jsx(Phone, { className: "w-3.5 h-3.5 text-electric" }), _jsx("span", { children: SITE.phoneDisplay })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "uppercase tracking-wider opacity-70", children: "Language:" }), _jsxs("div", { className: "flex items-center bg-navy rounded-full border border-borderColor p-0.5", children: [_jsx("button", { onClick: () => setLanguage('en'), className: `px-3 py-1 rounded-full transition-all duration-300 ${language === 'en'
                                            ? 'bg-electric text-white shadow-premium'
                                            : 'hover:text-white'}`, "aria-label": "Switch to English", children: "EN" }), _jsx("button", { onClick: () => setLanguage('bn'), className: `px-3 py-1 rounded-full transition-all duration-300 ${language === 'bn'
                                            ? 'bg-electric text-white shadow-premium'
                                            : 'hover:text-white'}`, "aria-label": "Switch to Bengali", children: "\u09AC\u09BE\u0982\u09B2\u09BE" })] })] })] }) }) }));
};
