import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Portfolio & Case Studies Page (Premium Animated Edition)
// =========================================================================
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, ExternalLink, Filter } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Container } from '/src/components/common/Container.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { Button } from '/src/components/common/Button.js';
import { splitTextBilingual } from '/src/lib/motion.js';
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}
export const PortfolioPage = () => {
    const { t, language } = useLanguage();
    const [activeFilter, setActiveFilter] = useState('All');
    // অ্যানিমেশনের জন্য রিফ সেটআপ
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const filtersRef = useRef(null);
    const gridRef = useRef(null);
    // ফিল্টার ক্যাটাগরিগুলো (১০০% সংরক্ষিত)
    const filterCategories = [
        { id: 'All', label: { en: 'All Projects', bn: 'সব প্রজেক্ট' } },
        { id: 'Web App', label: { en: 'Web Apps', bn: 'ওয়েব অ্যাপস' } },
        { id: 'Mobile App', label: { en: 'Mobile Apps', bn: 'মোবাইল অ্যাপস' } },
        { id: 'E-commerce', label: { en: 'E-commerce', bn: 'ই-কমার্স' } },
        { id: 'Global', label: { en: 'Global Clients', bn: 'গ্লোবাল ক্লায়েন্ট' } },
        { id: 'Local', label: { en: 'Local Clients', bn: 'লোকাল ক্লায়েন্ট' } },
    ];
    // পোর্টফোলিও প্রজেক্টের সম্পূর্ণ ডামি ডেটা (১০০% সংরক্ষিত)
    const portfolioItems = [
        {
            id: 1,
            slug: 'global-fintech-dashboard',
            image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=800&auto=format&fit=crop',
            title: { en: 'Global FinTech Analytics Dashboard', bn: 'গ্লোবাল ফিনটেক অ্যানালিটিক্স ড্যাশবোর্ড' },
            category: 'Web App',
            metric: { en: '+45% User Retention', bn: '+৪৫% ইউজার রিটেনশন' },
            clientType: 'Global'
        },
        {
            id: 2,
            slug: 'enterprise-ecommerce-app',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
            title: { en: 'Enterprise E-commerce Platform', bn: 'এন্টারপ্রাইজ ই-কমার্স প্ল্যাটফর্ম' },
            category: 'E-commerce',
            metric: { en: '3x Sales Growth', bn: '৩ গুণ সেলস বৃদ্ধি' },
            clientType: 'Local'
        },
        {
            id: 3,
            slug: 'health-care-telemedicine',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
            title: { en: 'Telemedicine Mobile App', bn: 'টেলিমেডিসিন মোবাইল অ্যাপ' },
            category: 'Mobile App',
            metric: { en: '10k+ Daily Consultations', bn: 'প্রতিদিন ১০ হাজার+ পরামর্শ' },
            clientType: 'Global'
        },
        {
            id: 4,
            slug: 'real-estate-crm',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
            title: { en: 'Real Estate CRM System', bn: 'রিয়েল এস্টেট সিআরএম (CRM) সিস্টেম' },
            category: 'Web App',
            metric: { en: '60% Faster Lead Closing', bn: '৬০% দ্রুত লিড ক্লোজিং' },
            clientType: 'Local'
        },
        {
            id: 5,
            slug: 'food-delivery-network',
            image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=800&auto=format&fit=crop',
            title: { en: 'Food Delivery Network App', bn: 'ফুড ডেলিভারি নেটওয়ার্ক অ্যাপ' },
            category: 'Mobile App',
            metric: { en: '1M+ App Downloads', bn: '১ মিলিয়ন+ অ্যাপ ডাউনলোড' },
            clientType: 'Local'
        },
        {
            id: 6,
            slug: 'edtech-learning-management',
            image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop',
            title: { en: 'EdTech Learning Management', bn: 'এডটেক লার্নিং ম্যানেজমেন্ট প্ল্যাটফর্ম' },
            category: 'Web App',
            metric: { en: '99.9% Server Uptime', bn: '৯৯.৯% সার্ভার আপটাইম' },
            clientType: 'Global'
        }
    ];
    // ফিল্টার লজিক
    const filteredItems = portfolioItems.filter(item => {
        if (activeFilter === 'All')
            return true;
        if (activeFilter === 'Global' || activeFilter === 'Local')
            return item.clientType === activeFilter;
        return item.category === activeFilter;
    });
    // GSAP এনিমেশন কনফিগারেশন
    useEffect(() => {
        const ctx = gsap.context(() => {
            // ১. হিরো টাইটেল মাস্ক রিভিল (শব্দ ভাঙা রোধ করতে 'words' মোড)
            const heroTitle = heroRef.current?.querySelector('h2');
            if (heroTitle) {
                const splitData = splitTextBilingual(heroTitle.innerText, 'words', language);
                heroTitle.innerHTML = splitData.items
                    .map(item => `<span class="inline-block overflow-hidden py-1"><span class="portfolio-hero-reveal inline-block">${item}</span></span>`)
                    .join(' ');
                const revealItems = heroTitle.querySelectorAll('.portfolio-hero-reveal');
                const heroTl = gsap.timeline();
                heroTl.fromTo(revealItems, { yPercent: 100, rotateX: 45, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' });
            }
            // ২. ফিল্টার বাটনগুলোর এন্ট্রি বাউন্স এনিমেশন
            const filterBtns = filtersRef.current?.querySelectorAll('button');
            if (filterBtns) {
                gsap.fromTo(filterBtns, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(1.5)' });
            }
            // ৩. প্রজেক্ট কার্ডস রিভিল এনিমেশন (ইউজার ফিল্টার চেঞ্জ করলেও ট্রিগার হবে)
            const cards = gridRef.current?.querySelectorAll('.portfolio-card');
            if (cards && cards.length > 0) {
                gsap.fromTo(cards, { opacity: 0, y: 50, scale: 0.96 }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 80%',
                    }
                });
            }
        }, pageRef);
        return () => ctx.revert();
    }, [language, activeFilter]); // activeFilter ডিপেনডেন্সি হিসেবে রাখার ফলে ফিল্টারিং অত্যন্ত ডাইনামিক দেখাবে
    return (_jsxs("div", { ref: pageRef, className: "w-full flex flex-col bg-[#071426]", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [t.navigation.portfolio, " | Quanta Reach Solutions"] }), _jsx("meta", { name: "description", content: language === 'en' ? 'Explore our digital masterpieces and success stories.' : 'আমাদের ডিজিটাল কাজগুলোর নমুনা এবং সফলতার গল্পগুলো দেখুন।' })] }), _jsxs("section", { className: "relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/5 bg-[#0D1D33]", children: [_jsx("div", { className: "absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-accent/10 rounded-full blur-[120px] pointer-events-none" }), _jsx(Container, { className: "relative z-10 text-center max-w-4xl", children: _jsx("div", { ref: heroRef, children: _jsx(SectionHeading, { badge: t.navigation.portfolio, title: language === 'en' ? 'Our Digital Masterpieces' : 'আমাদের ডিজিটাল মাস্টারপিস', subtitle: language === 'en'
                                    ? 'Browse through our curated selection of projects that showcase our technical expertise, design thinking, and problem-solving capabilities.'
                                    : 'আমাদের সেরা কাজগুলো দেখুন, যা আমাদের কারিগরি দক্ষতা, ডিজাইন চিন্তাধারা এবং সমস্যা সমাধানের ক্ষমতা প্রমাণ করে।', className: "mx-auto" }) }) })] }), _jsx("section", { className: "py-20 lg:py-28 relative bg-[#071426]", children: _jsxs(Container, { children: [_jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between mb-12 gap-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-white/50 font-medium", children: [_jsx(Filter, { className: "w-5 h-5 text-[#168BFF]" }), _jsx("span", { children: language === 'en' ? 'Filter by:' : 'ফিল্টার করুন:' })] }), _jsx("div", { ref: filtersRef, className: "flex flex-wrap justify-center md:justify-end gap-3", children: filterCategories.map((category) => (_jsx("button", { onClick: () => setActiveFilter(category.id), className: `px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${activeFilter === category.id
                                            ? 'bg-[#168BFF] text-[#071426] border-[#168BFF] shadow-lg shadow-[#168BFF]/20'
                                            : 'bg-[#0D1D33] text-white/50 border-white/5 hover:border-[#168BFF] hover:text-white'}`, children: language === 'en' ? category.label.en : category.label.bn }, category.id))) })] }), _jsx("div", { ref: gridRef, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredItems.map((item) => (_jsxs("div", { className: "portfolio-card group relative rounded-2xl overflow-hidden bg-[#0D1D33]/50 backdrop-blur-sm border border-white/5 hover:border-[#168BFF]/30 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(22,139,255,0.08)]", children: [_jsxs("div", { className: "relative h-60 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10" }), _jsx("img", { src: item.image, alt: language === 'en' ? item.title.en : item.title.bn, className: "w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" }), _jsxs("div", { className: "absolute top-4 left-4 z-20 flex gap-2", children: [_jsx("span", { className: "px-3 py-1 text-xs font-semibold rounded-full bg-[#071426]/80 text-white backdrop-blur-md border border-white/10", children: item.category }), _jsx("span", { className: `px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md border border-white/10 ${item.clientType === 'Global' ? 'bg-[#168BFF]/80 text-white' : 'bg-purple-accent/80 text-white'}`, children: item.clientType })] })] }), _jsxs("div", { className: "p-6 flex flex-col flex-grow", children: [_jsx("h3", { className: "text-xl font-bold text-white mb-4 group-hover:text-[#168BFF] transition-colors line-clamp-2", children: language === 'en' ? item.title.en : item.title.bn }), _jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#168BFF]/10 border border-[#168BFF]/20 text-[#168BFF] mb-6 w-fit", children: [_jsx(TrendingUp, { className: "w-4 h-4 shrink-0" }), _jsx("span", { className: "font-medium text-sm", children: language === 'en' ? item.metric.en : item.metric.bn })] }), _jsxs("div", { className: "pt-6 border-t border-white/5 mt-auto flex justify-between items-center", children: [_jsxs(Link, { to: `/portfolio/${item.slug}`, className: "inline-flex items-center text-white/40 hover:text-white font-medium transition-colors text-sm", children: [t.common.readMore, _jsx(ArrowRight, { className: "w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" })] }), _jsx(Link, { to: `/portfolio/${item.slug}`, className: "w-10 h-10 rounded-full bg-[#0D1D33] border border-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#168BFF] hover:border-[#168BFF] transition-all shrink-0", "aria-label": "View Project Details", children: _jsx(ExternalLink, { className: "w-4 h-4" }) })] })] })] }, item.id))) }), filteredItems.length === 0 && (_jsx("div", { className: "text-center py-20", children: _jsx("h3", { className: "text-xl text-white/40", children: language === 'en' ? 'No projects found for this category.' : 'এই ক্যাটাগরিতে কোনো প্রজেক্ট পাওয়া যায়নি।' }) }))] }) }), _jsxs("section", { className: "py-24 relative overflow-hidden bg-[#168BFF]", children: [_jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" }), _jsxs(Container, { className: "relative z-10 text-center", children: [_jsx("h2", { className: "text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase", children: language === 'en' ? 'Let’s Build Your Success Story' : 'চলুন আপনার সফলতার গল্প তৈরি করি' }), _jsx("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: _jsx(Link, { to: "/request-quote", children: _jsx(Button, { size: "lg", className: "bg-white !text-[#168BFF] font-black uppercase tracking-widest px-12 py-6 rounded-full hover:bg-gray-100 shadow-2xl transition-all hover:scale-105 active:scale-95", rightIcon: _jsx(ArrowRight, { className: "w-6 h-6 !text-[#168BFF]" }), children: t.common.requestQuote }) }) })] })] })] }));
};
