import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - 404 Not Found Page
// =========================================================================
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Container } from '/src/components/common/Container.js';
import { Button } from '/src/components/common/Button.js';
export const NotFoundPage = () => {
    const { t } = useLanguage();
    return (_jsxs("div", { className: "w-full min-h-screen bg-navy flex items-center justify-center relative overflow-hidden py-20", children: [_jsx(Helmet, { children: _jsx("title", { children: "404 | Quanta Reach Solutions" }) }), _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/10 rounded-full blur-[120px] pointer-events-none" }), _jsx(Container, { className: "relative z-10 text-center", children: _jsxs("div", { className: "glass-panel p-12 rounded-3xl border-borderColor max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-[120px] md:text-[160px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-electric to-purple-accent leading-none mb-6", children: "404" }), _jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-6", children: t.common.notFound }), _jsx("p", { className: "text-soft-gray text-lg mb-10 max-w-md mx-auto", children: t.common.goBack === 'Go Back'
                                ? 'Oops! The page you are looking for does not exist or has been moved.'
                                : 'দুঃখিত! আপনি যে পেজটি খুঁজছেন তা খুঁজে পাওয়া যায়নি বা এটি সরিয়ে ফেলা হয়েছে।' }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [_jsx(Link, { to: "/", children: _jsx(Button, { size: "lg", leftIcon: _jsx(Home, { className: "w-5 h-5" }), children: t.navigation.home }) }), _jsx(Button, { variant: "secondary", size: "lg", leftIcon: _jsx(ArrowLeft, { className: "w-5 h-5" }), onClick: () => window.history.back(), children: t.common.goBack })] })] }) })] }));
};
