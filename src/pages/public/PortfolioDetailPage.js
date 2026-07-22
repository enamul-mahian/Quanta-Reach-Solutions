import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '/src/components/common/Button.js';
import { Container } from '/src/components/common/Container.js';
import { portfolioDetails } from '/src/data/publicContent.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { SITE } from '/src/config/site.js';
export const PortfolioDetailPage = () => {
    const { slug = '' } = useParams();
    const { language } = useLanguage();
    const project = portfolioDetails[slug];
    if (!project) {
        return _jsx("section", { className: "min-h-screen bg-[#071426] pt-40 text-center text-white", children: _jsxs(Container, { children: [_jsx("h1", { className: "text-4xl font-black", children: language === 'en' ? 'Project not found' : 'প্রজেক্টটি পাওয়া যায়নি' }), _jsxs(Link, { to: "/portfolio", className: "mt-8 inline-flex items-center gap-2 text-[#168BFF]", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), language === 'en' ? 'Back to portfolio' : 'পোর্টফোলিওতে ফিরুন'] })] }) });
    }
    const title = project.title[language];
    return (_jsxs("main", { className: "min-h-screen bg-[#071426] pt-36 pb-24 text-white", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [title, " | ", SITE.name] }), _jsx("meta", { name: "description", content: project.summary[language] })] }), _jsxs(Container, { className: "max-w-6xl", children: [_jsxs(Link, { to: "/portfolio", className: "mb-10 inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-[#168BFF]", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), language === 'en' ? 'All projects' : 'সব প্রজেক্ট'] }), _jsxs("article", { className: "overflow-hidden rounded-3xl border border-white/10 bg-[#0D1D33]/75 shadow-2xl", children: [project.image && _jsx("img", { src: project.image, alt: title, className: "h-[300px] w-full object-cover md:h-[500px]" }), _jsxs("div", { className: "p-8 md:p-14", children: [_jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-[#168BFF]", children: project.meta?.[language] }), _jsx("h1", { className: "mt-4 text-4xl font-black tracking-tight md:text-7xl", children: title }), _jsx("p", { className: "mt-6 max-w-3xl text-xl leading-relaxed text-white/60", children: project.summary[language] }), _jsx("div", { className: "mt-10 max-w-4xl space-y-6 text-base leading-8 text-white/65", children: project.body.map((paragraph) => _jsx("p", { children: paragraph[language] }, paragraph.en)) }), _jsxs("div", { className: "mt-12 flex flex-wrap gap-4", children: [_jsx(Link, { to: "/request-quote", children: _jsx(Button, { size: "lg", children: language === 'en' ? 'Start a Similar Project' : 'এমন প্রজেক্ট শুরু করুন' }) }), _jsx(Link, { to: "/contact", children: _jsx(Button, { size: "lg", variant: "outline", children: language === 'en' ? 'Contact Us' : 'যোগাযোগ করুন' }) })] })] })] })] })] }));
};
