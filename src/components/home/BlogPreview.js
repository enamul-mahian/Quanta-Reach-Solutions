import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Home Page Blog & Insights Preview
// =========================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Container } from '/src/components/common/Container.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { Button } from '/src/components/common/Button.js';
export const BlogPreview = () => {
    const { t, language } = useLanguage();
    // ব্লগের ডামি ডেটা (পরবর্তীতে ফায়ারবেস থেকে আসবে)
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
    return (_jsx("section", { className: "py-24 bg-navy relative overflow-hidden border-t border-borderColor", children: _jsxs(Container, { children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6", children: [_jsx(SectionHeading, { badge: t.navigation.blog, title: language === 'en' ? 'Latest Insights & News' : 'লেটেস্ট ইনসাইটস ও নিউজ', subtitle: language === 'en'
                                ? 'Stay updated with the latest trends in technology, design, and digital marketing.'
                                : 'টেকনোলজি, ডিজাইন এবং ডিজিটাল মার্কেটিংয়ের সাম্প্রতিক ট্রেন্ড ও খবরের সাথে আপডেট থাকুন।', align: "left", className: "mb-0" }), _jsx("div", { className: "hidden md:block shrink-0 pb-4", children: _jsx(Link, { to: "/blog", children: _jsx(Button, { variant: "outline", rightIcon: _jsx(ArrowRight, { className: "w-4 h-4" }), children: language === 'en' ? 'View All Blogs' : 'সব ব্লগ দেখুন' }) }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: blogPosts.map((post) => (_jsxs("div", { className: "glass-panel rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border-borderColor hover:border-purple-accent/50", children: [_jsxs("div", { className: "relative h-56 overflow-hidden", children: [_jsx("img", { src: post.image, alt: language === 'en' ? post.title.en : post.title.bn, className: "w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" }), _jsx("div", { className: "absolute top-4 left-4 z-10", children: _jsx("span", { className: "px-3 py-1 text-xs font-semibold rounded-full bg-navy/80 text-electric-bright backdrop-blur-md border border-white/10 shadow-glass", children: language === 'en' ? post.category.en : post.category.bn }) })] }), _jsxs("div", { className: "p-6 flex flex-col flex-grow", children: [_jsxs("div", { className: "flex items-center gap-4 text-xs font-medium text-soft-gray mb-4", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 text-purple-accent" }), _jsx("span", { children: post.date })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-purple-accent" }), _jsx("span", { children: language === 'en' ? post.readTime.en : post.readTime.bn })] })] }), _jsx("h3", { className: "text-xl font-bold text-white mb-3 group-hover:text-electric transition-colors line-clamp-2", children: _jsx(Link, { to: `/blog/${post.slug}`, children: language === 'en' ? post.title.en : post.title.bn }) }), _jsx("p", { className: `text-soft-gray text-sm leading-relaxed mb-6 line-clamp-3 flex-grow ${language === 'bn' ? 'bn-text-safe' : ''}`, children: language === 'en' ? post.excerpt.en : post.excerpt.bn }), _jsx("div", { className: "pt-4 border-t border-borderColor mt-auto", children: _jsxs(Link, { to: `/blog/${post.slug}`, className: "inline-flex items-center text-sm font-semibold text-electric hover:text-electric-bright transition-colors", children: [t.common.readMore, _jsx(ArrowRight, { className: "w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" })] }) })] })] }, post.id))) }), _jsx("div", { className: "mt-10 md:hidden text-center", children: _jsx(Link, { to: "/blog", children: _jsx(Button, { variant: "outline", rightIcon: _jsx(ArrowRight, { className: "w-4 h-4" }), children: language === 'en' ? 'View All Blogs' : 'সব ব্লগ দেখুন' }) }) })] }) }));
};
