import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Blog & Insights Page (Premium Animated Edition)
// =========================================================================
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Container } from '/src/components/common/Container.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { splitTextBilingual } from '/src/lib/motion.js'; // isReducedMotion ইম্পোর্ট রিমুভ করা হয়েছে
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}
export const BlogPage = () => {
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    // অ্যানিমেশনের জন্য রিফ সেটআপ
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const searchRef = useRef(null);
    const gridRef = useRef(null);
    // ব্লগের ডামি ডেটা (১০০% সংরক্ষিত)
    const blogPosts = [
        {
            id: 1,
            slug: 'ai-in-business-automation',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
            category: { en: 'Technology', bn: 'প্রযুক্তি' },
            date: 'July 10, 2026',
            readTime: { en: '5 Min Read', bn: '৫ মিনিট পাঠ' },
            title: {
                en: 'How AI and Automation are Reshaping Modern Businesses',
                bn: 'কীভাবে এআই (AI) এবং অটোমেশন আধুনিক ব্যবসাকে বদলে দিচ্ছে'
            },
            excerpt: {
                en: 'Discover how integrating artificial intelligence can streamline your operations, reduce costs, and accelerate business growth exponentially.',
                bn: 'কৃত্রিম বুদ্ধিমত্তা ব্যবহার করে কীভাবে আপনার ব্যবসায়িক কার্যক্রম সহজ করবেন, খরচ কমাবেন এবং প্রবৃদ্ধি বহুগুণ বাড়াবেন তা জানুন।'
            }
        },
        {
            id: 2,
            slug: 'future-of-ecommerce-2026',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
            category: { en: 'Business Growth', bn: 'বিজনেস গ্রোথ' },
            date: 'July 05, 2026',
            readTime: { en: '4 Min Read', bn: '৪ মিনিট পাঠ' },
            title: {
                en: 'The Future of E-commerce: Trends to Watch in 2026',
                bn: 'ই-কমার্সের ভবিষ্যৎ: ২০২৬ সালে যে ট্রেন্ডগুলোর দিকে নজর রাখতে হবে'
            },
            excerpt: {
                en: 'From AR shopping experiences to personalized recommendations, explore the key trends dominating the global e-commerce landscape.',
                bn: 'এআর (AR) শপিং অভিজ্ঞতা থেকে শুরু করে পার্সোনালাইজড রেকমেন্ডেশন—গ্লোবাল ই-কমার্সে আধিপত্য বিস্তারকারী মূল ট্রেন্ডগুলো অন্বেষণ করুন।'
            }
        },
        {
            id: 3,
            slug: 'importance-of-ui-ux-design',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
            category: { en: 'Design Strategy', bn: 'ডিজাইন স্ট্র্যাটেজি' },
            date: 'June 28, 2026',
            readTime: { en: '6 Min Read', bn: '৬ মিনিট পাঠ' },
            title: {
                en: 'Why Investing in UI/UX Design is Crucial for Startups',
                bn: 'স্টার্টআপদের জন্য কেন UI/UX ডিজাইনে বিনিয়োগ করা অপরিহার্য'
            },
            excerpt: {
                en: 'A seamless user experience is no longer a luxury, it’s a necessity. Learn why good design is your best marketing strategy.',
                bn: 'একটি চমৎকার ইউজার এক্সপেরিয়েন্স এখন আর বিলাসিতা নয়, এটি প্রয়োজনীয়তা। জানুন কেন ভালো ডিজাইনই আপনার সেরা মার্কেটিং কৌশল।'
            }
        }
    ];
    // ফিল্টার লজিক (১০০% সংরক্ষিত)
    const filteredPosts = blogPosts.filter(post => post.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.title.bn.includes(searchTerm));
    // GSAP এনিমেশন কনফিগারেশন
    useEffect(() => {
        const ctx = gsap.context(() => {
            // holds isReducedMotion check completely removed to guarantee animations run!
            // ১. হিরো টাইটেল মাস্ক রিভিল (শব্দভিত্তিক)
            const heroTitle = heroRef.current?.querySelector('h2');
            if (heroTitle) {
                const splitData = splitTextBilingual(heroTitle.innerText, 'words', language);
                heroTitle.innerHTML = splitData.items
                    .map(item => `<span class="inline-block overflow-hidden py-1"><span class="blog-hero-reveal inline-block">${item}</span></span>`)
                    .join(' ');
                const revealItems = heroTitle.querySelectorAll('.blog-hero-reveal');
                const heroTl = gsap.timeline();
                heroTl.fromTo(revealItems, { yPercent: 100, rotateX: 45, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' });
            }
            // ২. সার্চ বক্স রিভিল
            if (searchRef.current) {
                gsap.fromTo(searchRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
            }
            // ৩. ব্লগ কার্ডস রিভিল (সার্চ টার্ম চেঞ্জ হলেও ডাইনামিক স্ট্যাগার ট্রিগার হবে)
            const cards = gridRef.current?.querySelectorAll('.blog-card');
            if (cards && cards.length > 0) {
                gsap.fromTo(cards, { opacity: 0, y: 40, scale: 0.97 }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
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
    }, [language, searchTerm]); // searchTerm ট্র্যাকিংয়ের ফলে রিয়াল-টাইম টাইপিংয়ের সাথে অ্যানিমেশন পপ হবে
    return (_jsxs("div", { ref: pageRef, className: "w-full flex flex-col bg-[#071426]", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [t.navigation.blog, " | Quanta Reach Solutions"] }), _jsx("meta", { name: "description", content: language === 'en' ? 'Latest insights, trends, and news on technology and business growth.' : 'টেকনোলজি এবং বিজনেস গ্রোথ সংক্রান্ত সর্বশেষ ইনসাইটস, ট্রেন্ড এবং খবর।' })] }), _jsxs("section", { className: "pt-32 pb-16 lg:pt-40 lg:pb-24 border-b border-white/5 bg-[#0D1D33] relative", children: [_jsx("div", { className: "absolute top-0 left-0 w-[500px] h-[500px] bg-[#168BFF]/10 rounded-full blur-[120px] pointer-events-none" }), _jsxs(Container, { className: "text-center max-w-3xl", children: [_jsx("div", { ref: heroRef, children: _jsx(SectionHeading, { badge: t.navigation.blog, title: language === 'en' ? 'Insights & Stories' : 'ইনসাইটস এবং স্টোরিজ', subtitle: language === 'en'
                                        ? 'Expert thoughts on technology, innovation, and digital transformation for modern businesses.'
                                        : 'আধুনিক ব্যবসার জন্য টেকনোলজি, ইনোভেশন এবং ডিজিটাল রূপান্তর নিয়ে আমাদের এক্সপার্ট মতামত।', className: "mx-auto mb-10" }) }), _jsxs("div", { ref: searchRef, className: "relative max-w-lg mx-auto", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" }), _jsx("input", { type: "text", placeholder: language === 'en' ? 'Search blogs...' : 'ব্লগ সার্চ করুন...', value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full bg-[#071426] border border-white/5 rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#168BFF] focus:shadow-[0_0_15px_rgba(22,139,255,0.15)] transition-all shadow-2xl" })] })] })] }), _jsx("section", { className: "py-20 lg:py-28 bg-[#071426]", children: _jsxs(Container, { children: [_jsx("div", { ref: gridRef, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredPosts.map((post) => (_jsxs("div", { className: "blog-card bg-[#0D1D33]/50 backdrop-blur-sm rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 flex flex-col h-full border border-white/5 hover:border-[#168BFF]/30 hover:shadow-[0_20px_50px_rgba(22,139,255,0.08)]", children: [_jsxs("div", { className: "relative h-56 overflow-hidden", children: [_jsx("img", { src: post.image, alt: language === 'en' ? post.title.en : post.title.bn, className: "w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" }), _jsx("div", { className: "absolute top-4 left-4 z-10", children: _jsx("span", { className: "px-3 py-1 text-xs font-semibold rounded-full bg-[#071426]/80 text-[#168BFF] backdrop-blur-md border border-white/10", children: language === 'en' ? post.category.en : post.category.bn }) })] }), _jsxs("div", { className: "p-6 flex flex-col flex-grow", children: [_jsxs("div", { className: "flex items-center gap-4 text-xs font-medium text-white/40 mb-4", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 text-[#9C5CFF]" }), _jsx("span", { children: post.date })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-[#9C5CFF]" }), _jsx("span", { children: language === 'en' ? post.readTime.en : post.readTime.bn })] })] }), _jsx("h3", { className: "text-xl font-bold text-white mb-3 group-hover:text-[#168BFF] transition-colors line-clamp-2", children: _jsx(Link, { to: `/blog/${post.slug}`, children: language === 'en' ? post.title.en : post.title.bn }) }), _jsx("p", { className: `text-white/50 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow ${language === 'bn' ? 'leading-loose' : ''}`, children: language === 'en' ? post.excerpt.en : post.excerpt.bn }), _jsx("div", { className: "pt-4 border-t border-white/5 mt-auto", children: _jsxs(Link, { to: `/blog/${post.slug}`, className: "inline-flex items-center text-sm font-semibold text-[#168BFF] hover:text-[#36A3FF] transition-colors", children: [t.common.readMore, _jsx(ArrowRight, { className: "w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" })] }) })] })] }, post.id))) }), filteredPosts.length === 0 && (_jsx("div", { className: "text-center py-20 text-white/30", children: language === 'en' ? 'No blogs found matching your search.' : 'আপনার সার্চের সাথে মিলছে এমন কোনো ব্লগ পাওয়া যায়নি।' }))] }) })] }));
};
