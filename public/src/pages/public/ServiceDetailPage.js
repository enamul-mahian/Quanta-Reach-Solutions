import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '/src/components/common/Button.js';
import { Container } from '/src/components/common/Container.js';
import { serviceDetails } from '/src/data/publicContent.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { SITE } from '/src/config/site.js';
export const ServiceDetailPage = () => {
    const { serviceId = '' } = useParams();
    const { language } = useLanguage();
    const service = serviceDetails[serviceId];
    if (!service) {
        return (_jsx("section", { className: "min-h-screen bg-[#071426] pt-40 pb-24 text-white", children: _jsxs(Container, { className: "max-w-3xl text-center", children: [_jsx("h1", { className: "text-4xl font-black", children: language === 'en' ? 'Service not found' : 'সেবাটি পাওয়া যায়নি' }), _jsxs(Link, { to: "/services", className: "mt-8 inline-flex items-center gap-2 text-[#168BFF]", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), language === 'en' ? 'Back to services' : 'সেবাসমূহে ফিরুন'] })] }) }));
    }
    const title = service.title[language];
    return (_jsxs("main", { className: "min-h-screen bg-[#071426] pt-36 pb-24 text-white", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [title, " | ", SITE.name] }), _jsx("meta", { name: "description", content: service.summary[language] })] }), _jsxs(Container, { className: "max-w-5xl", children: [_jsxs(Link, { to: "/services", className: "mb-10 inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-[#168BFF]", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), language === 'en' ? 'All services' : 'সব সেবা'] }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-[#0D1D33]/80 p-8 shadow-2xl md:p-14", children: [_jsx("p", { className: "mb-4 font-mono text-xs uppercase tracking-[0.35em] text-[#168BFF]", children: language === 'en' ? 'Service' : 'সেবা' }), _jsx("h1", { className: "max-w-4xl text-4xl font-black tracking-tight md:text-7xl", children: title }), _jsx("p", { className: "mt-6 max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl", children: service.summary[language] }), _jsxs("div", { className: "mt-12 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]", children: [_jsx("div", { className: "space-y-6 text-base leading-8 text-white/65", children: service.body.map((paragraph) => _jsx("p", { children: paragraph[language] }, paragraph.en)) }), _jsxs("aside", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-6", children: [_jsx("h2", { className: "mb-5 font-bold", children: language === 'en' ? 'What this can include' : 'যা অন্তর্ভুক্ত হতে পারে' }), _jsx("ul", { className: "space-y-4", children: service.highlights?.map((item) => _jsxs("li", { className: "flex gap-3 text-sm text-white/60", children: [_jsx(CheckCircle2, { className: "mt-0.5 h-5 w-5 shrink-0 text-[#168BFF]" }), item[language]] }, item.en)) })] })] }), _jsxs("div", { className: "mt-12 flex flex-wrap gap-4", children: [_jsx(Link, { to: "/request-quote", children: _jsx(Button, { size: "lg", children: language === 'en' ? 'Request a Quote' : 'কোটেশন নিন' }) }), _jsx(Link, { to: "/contact", children: _jsx(Button, { size: "lg", variant: "outline", children: language === 'en' ? 'Talk to the Team' : 'টিমের সাথে কথা বলুন' }) })] })] })] })] }));
};
