import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Container } from '/src/components/common/Container.js';
import { blogDetails } from '/src/data/publicContent.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { SITE } from '/src/config/site.js';
export const BlogDetailPage = () => {
    const { slug = '' } = useParams();
    const { language } = useLanguage();
    const post = blogDetails[slug];
    if (!post) {
        return _jsx("section", { className: "min-h-screen bg-[#071426] pt-40 text-center text-white", children: _jsxs(Container, { children: [_jsx("h1", { className: "text-4xl font-black", children: language === 'en' ? 'Article not found' : 'আর্টিকেলটি পাওয়া যায়নি' }), _jsxs(Link, { to: "/blog", className: "mt-8 inline-flex items-center gap-2 text-[#168BFF]", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), language === 'en' ? 'Back to blog' : 'ব্লগে ফিরুন'] })] }) });
    }
    const title = post.title[language];
    return (_jsxs("main", { className: "min-h-screen bg-[#071426] pt-36 pb-24 text-white", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [title, " | ", SITE.name] }), _jsx("meta", { name: "description", content: post.summary[language] })] }), _jsxs(Container, { className: "max-w-4xl", children: [_jsxs(Link, { to: "/blog", className: "mb-10 inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-[#168BFF]", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), language === 'en' ? 'All articles' : 'সব আর্টিকেল'] }), _jsxs("article", { children: [_jsx("p", { className: "font-mono text-xs uppercase tracking-[0.28em] text-[#168BFF]", children: post.meta?.[language] }), _jsx("h1", { className: "mt-5 text-4xl font-black leading-tight tracking-tight md:text-7xl", children: title }), _jsx("p", { className: "mt-6 text-xl leading-relaxed text-white/60", children: post.summary[language] }), post.image && _jsx("img", { src: post.image, alt: title, className: "my-10 h-[280px] w-full rounded-3xl object-cover md:h-[480px]" }), _jsx("div", { className: "space-y-7 text-lg leading-9 text-white/70", children: post.body.map((paragraph) => _jsx("p", { children: paragraph[language] }, paragraph.en)) }), _jsxs("div", { className: "mt-12 rounded-2xl border border-[#168BFF]/20 bg-[#168BFF]/5 p-7", children: [_jsx("p", { className: "font-semibold", children: language === 'en' ? 'Need help turning an idea into a reliable digital product?' : 'আপনার আইডিয়াকে নির্ভরযোগ্য ডিজিটাল প্রোডাক্টে রূপ দিতে সহায়তা প্রয়োজন?' }), _jsx(Link, { to: "/contact", className: "mt-3 inline-block font-bold text-[#168BFF]", children: language === 'en' ? 'Talk to Quanta Reach Solutions →' : 'Quanta Reach Solutions-এর সাথে কথা বলুন →' })] })] })] })] }));
};
