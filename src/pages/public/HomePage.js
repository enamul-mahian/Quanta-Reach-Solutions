import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '/src/hooks/useLanguage.js';
// কোয়ান্টা রিচ প্রিমিয়াম সেকশন ইম্পোর্টসমূহ
import { Hero } from '/src/components/home/Hero.js';
import { ServicesSection } from '/src/components/home/ServicesSection.js';
import { PerspectiveVideoSection } from '/src/components/home/PerspectiveVideoSection.js';
import { TestimonialsSection } from '/src/components/home/TestimonialsSection.js';
import { ProcessSection } from '/src/components/home/ProcessSection.js';
/**
 * QUANTA REACH SOLUTIONS - HOME PAGE
 * হোমপেজ থেকে টিম সেকশন সরিয়ে শুধুমাত্র কোর সার্ভিস ও প্রসেস রাখা হয়েছে।
 */
export const HomePage = () => {
    const { language } = useLanguage();
    // স্ক্রল পজিশন রিসেট (পেজ লোড হওয়ার সময়)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // ল্যাঙ্গুয়েজ ভিত্তিক এসইও (SEO) কন্টেন্ট
    const seoData = {
        title: language === 'en'
            ? 'Quanta Reach Solutions | Digital Solutions for Global Growth'
            : 'কোয়ান্টা রিচ সলিউশনস | বৈশ্বিক প্রবৃদ্ধির জন্য ডিজিটাল সমাধান',
        description: language === 'en'
            ? 'Creative technology agency specializing in premium web development, AI solutions, and digital transformation for global and local clients.'
            : 'প্রিমিয়াম ওয়েব ডেভেলপমেন্ট, এআই সলিউশন এবং ডিজিটাল রূপান্তরে বিশেষজ্ঞ একটি ক্রিয়েটিভ টেকনোলজি এজেন্সি।'
    };
    return (_jsxs("main", { className: "relative w-full bg-[#071426] overflow-x-hidden", children: [_jsxs(Helmet, { children: [_jsx("title", { children: seoData.title }), _jsx("meta", { name: "description", content: seoData.description }), _jsx("meta", { property: "og:title", content: seoData.title }), _jsx("meta", { property: "og:description", content: seoData.description }), _jsx("meta", { name: "twitter:title", content: seoData.title }), _jsx("meta", { name: "twitter:description", content: seoData.description })] }), _jsx(Hero, {}), _jsx(ServicesSection, {}), _jsx(PerspectiveVideoSection, {}), _jsx(TestimonialsSection, {}), _jsx(ProcessSection, {}), _jsx("div", { className: "h-20 bg-transparent pointer-events-none" })] }));
};
