import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Detailed Pricing Page (Premium Animated Edition)
// =========================================================================
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Container } from '/src/components/common/Container.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { Button } from '/src/components/common/Button.js';
import { splitTextBilingual } from '/src/lib/motion.js'; // isReducedMotion ইম্পোর্ট রিমুভ করা হয়েছে
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}
export const PricingPage = () => {
    const { t, language } = useLanguage();
    const [clientType, setClientType] = useState('local');
    // অ্যানিমেশনের জন্য রিফ সেটআপ
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const gridRef = useRef(null);
    const faqRef = useRef(null);
    // প্রাইসিং প্যাকেজ ডেটা (১০০% সংরক্ষিত)
    const pricingPlans = {
        local: [
            {
                id: 'local-basic',
                name: { en: 'Startup Pack', bn: 'স্টার্টআপ প্যাক' },
                price: '৳ ২৫,০০০',
                description: { en: 'Perfect for small businesses establishing their online presence.', bn: 'ছোট ব্যবসাগুলোর অনলাইন পরিচিতি তৈরির জন্য সেরা।' },
                isPopular: false,
                delivery: { en: '7-10 Days', bn: '৭-১০ দিন' },
                support: { en: '1 Month Free Support', bn: '১ মাসের ফ্রি সাপোর্ট' },
                revisions: { en: '3 Revisions', bn: '৩ বার রিভিশন' },
                features: {
                    en: ['Up to 10 Pages Website', 'Mobile Responsive Design', 'Basic SEO Setup', 'Contact Form Integration', 'Social Media Links', '1 Month Free Maintenance'],
                    bn: ['সর্বোচ্চ ১০ পেজের ওয়েবসাইট', 'মোবাইল রেস্পন্সিভ ডিজাইন', 'বেসিক এসইও (SEO) সেটআপ', 'কন্টাক্ট ফর্ম ইন্টিগ্রেশন', 'সোশ্যাল মিডিয়া লিংক', '১ মাসের ফ্রি মেইনটেন্যান্স']
                }
            },
            {
                id: 'local-pro',
                name: { en: 'Professional', bn: 'প্রফেশনাল' },
                price: '৳ ৫০,০০০',
                description: { en: 'Comprehensive solution for growing businesses and e-commerce.', bn: 'ক্রমবর্ধমান ব্যবসা এবং ই-কমার্সের জন্য সম্পূর্ণ সমাধান।' },
                isPopular: true,
                delivery: { en: '3-4 Weeks', bn: '৩-৪ সপ্তাহ' },
                support: { en: '3 Months Free Support', bn: '৩ মাসের ফ্রি সাপোর্ট' },
                revisions: { en: 'Unlimited Revisions', bn: 'আনলিমিটেড রিভিশন' },
                features: {
                    en: ['Custom UI/UX Design', 'Dynamic Admin Dashboard', 'E-commerce/Payment Gateway', 'Advanced SEO Optimization', 'Performance Optimized', 'Free Employee Training'],
                    bn: ['কাস্টম UI/UX ডিজাইন', 'ডায়নামিক অ্যাডমিন ড্যাশবোর্ড', 'ই-কমার্স / পেমেন্ট গেটওয়ে', 'অ্যাডভান্সড এসইও অপ্টিমাইজেশন', 'সুপার ফাস্ট পারফরম্যান্স', 'ফ্রি এমপ্লয়ি ট্রেনিং']
                }
            },
            {
                id: 'local-enterprise',
                name: { en: 'Enterprise', bn: 'এন্টারপ্রাইজ' },
                price: 'Custom',
                description: { en: 'Custom-built software for large-scale operational needs.', bn: 'বড় প্রতিষ্ঠানের নিজস্ব চাহিদার ওপর ভিত্তি করে কাস্টম সফটওয়্যার।' },
                isPopular: false,
                delivery: { en: 'Based on Scope', bn: 'প্রজেক্টের ওপর নির্ভরশীল' },
                support: { en: '6+ Months Support', bn: '৬+ মাসের সাপোর্ট' },
                revisions: { en: 'Continuous Delivery', bn: 'ধারাবাহিক ডেলিভারি' },
                features: {
                    en: ['Complex Custom Logic', 'Multiple User Roles & Access', 'Third-party API Integrations', 'High-level Security Setup', 'Dedicated Cloud Server setup', 'NDA Protected'],
                    bn: ['জটিল কাস্টম লজিক', 'মাল্টিপল ইউজার রোল', 'থার্ড-পার্টি API ইন্টিগ্রেশন', 'উচ্চ-স্তরের সাইবার সিকিউরিটি', 'ডেডিকেটেড ক্লাউড সার্ভার সেটআপ', 'এনডিএ (NDA) চুক্তিবদ্ধ']
                }
            }
        ],
        global: [
            {
                id: 'global-basic',
                name: { en: 'Startup MVP', bn: 'স্টার্টআপ এমভিপি (MVP)' },
                price: '$999',
                description: { en: 'Best for startups to quickly validate their ideas in the market.', bn: 'স্টার্টআপদের দ্রুত আইডিয়া যাচাই করার জন্য সেরা।' },
                isPopular: false,
                delivery: { en: '3-4 Weeks', bn: '৩-৪ সপ্তাহ' },
                support: { en: '1 Month Support', bn: '১ মাসের সাপোর্ট' },
                revisions: { en: '3 Milestone Revisions', bn: '৩টি মাইলস্টোন রিভিশন' },
                features: {
                    en: ['Custom UI/UX Design', 'Frontend Development', 'Basic Backend API', 'Responsive on all devices', 'Strict NDA & Privacy', 'Dedicated English PM'],
                    bn: ['কাস্টম UI/UX ডিজাইন', 'ফ্রন্টএন্ড ডেভেলপমেন্ট', 'বেসিক ব্যাকএন্ড এপিআই', 'সব ডিভাইসে রেস্পন্সিভ', 'কঠোর এনডিএ ও প্রাইভেসি', 'ডেডিকেটেড ইংলিশ পিএম']
                }
            },
            {
                id: 'global-pro',
                name: { en: 'Professional', bn: 'প্রফেশনাল' },
                price: '$2,499',
                description: { en: 'Full-stack applications for scaling businesses and agencies.', bn: 'বড় ব্যবসা এবং এজেন্সির জন্য ফুল-স্ট্যাক অ্যাপ্লিকেশন।' },
                isPopular: true,
                delivery: { en: '6-8 Weeks', bn: '৬-৮ সপ্তাহ' },
                support: { en: '3 Months Support', bn: '৩ মাসের সাপোর্ট' },
                revisions: { en: 'Unlimited Revisions', bn: 'আনলিমিটেড রিভিশন' },
                features: {
                    en: ['Full-stack Development', 'Complex Database Architecture', 'Stripe/PayPal Integration', 'Admin Management Panel', 'Performance & SEO Optimized', 'Weekly Progress Reports'],
                    bn: ['ফুল-স্ট্যাক ডেভেলপমেন্ট', 'জটিল ডাটাবেস আর্কিটেকচার', 'স্ট্রাইপ/পেপ্যাল ইন্টিগ্রেশন', 'অ্যাডমিন ম্যানেজমেন্ট প্যানেল', 'পারফরম্যান্স ও এসইও অপ্টিমাইজড', 'সাপ্তাহিক প্রোগ্রেস রিপোর্ট']
                }
            },
            {
                id: 'global-enterprise',
                name: { en: 'Enterprise SaaS', bn: 'এন্টারপ্রাইজ স্যাস (SaaS)' },
                price: 'Custom',
                description: { en: 'High-availability infrastructure for enterprises and SaaS platforms.', bn: 'এন্টারপ্রাইজ এবং স্যাস প্ল্যাটফর্মের জন্য হাই-অ্যাভেইলেবিলিটি ইনফ্রাস্ট্রাকচার।' },
                isPopular: false,
                delivery: { en: 'Based on Scope', bn: 'প্রজেক্টের ওপর নির্ভরশীল' },
                support: { en: '1 Year Maintenance', bn: '১ বছরের মেইনটেন্যান্স' },
                revisions: { en: 'Agile Development', bn: 'অ্যাজাইল ডেভেলপমেন্ট' },
                features: {
                    en: ['Microservices Architecture', 'AWS / Google Cloud Deployment', 'Enterprise-grade Security', 'Automated CI/CD Pipelines', 'Multiple API Integrations', '24/7 Priority Support'],
                    bn: ['মাইক্রোসার্ভিস আর্কিটেকচার', 'AWS / গুগল ক্লাউড ডেপ্লয়মেন্ট', 'এন্টারপ্রাইজ-গ্রেড সিকিউরিটি', 'অটোমেটেড CI/CD পাইপলাইন', 'মাল্টিপল API ইন্টিগ্রেশন', '২৪/৭ প্রায়োরিটি সাপোর্ট']
                }
            }
        ]
    };
    // প্রাইসিং FAQ ডেটা
    const faqs = [
        {
            question: { en: 'How does your payment structure work?', bn: 'আপনাদের পেমেন্ট সিস্টেম কীভাবে কাজ করে?' },
            answer: {
                en: 'For local clients, we usually take a 40% upfront payment, 40% after the beta release, and the final 20% before launch. Installment facilities are available for large projects. Global clients follow a milestone-based escrow or direct transfer system.',
                bn: 'লোকাল ক্লায়েন্টদের জন্য আমরা সাধারণত ৪০% অ্যাডভান্স, বেটা রিলিজের পর ৪০% এবং প্রজেক্ট লাইভ করার আগে বাকি ২০% পেমেন্ট নিয়ে থাকি। বড় প্রজেক্টের ক্ষেত্রে কিস্তির সুবিধাও রয়েছে।'
            }
        },
        {
            question: { en: 'Will I own the source code?', bn: 'আমি কি সোর্স কোডের মালিকানা পাব?' },
            answer: {
                en: 'Yes. Once the project is fully paid and launched, you will have 100% ownership of the source code and all digital assets created during the project.',
                bn: 'হ্যাঁ। প্রজেক্টের সম্পূর্ণ পেমেন্ট ক্লিয়ার হওয়ার পর, সোর্স কোড এবং প্রজেক্টের যাবতীয় ডিজিটাল সম্পদের ১০০% মালিকানা আপনাকে বুঝিয়ে দেওয়া হবে।'
            }
        },
        {
            question: { en: 'Do you provide domain and hosting?', bn: 'আপনারা কি ডোমেইন এবং হোস্টিং প্রদান করেন?' },
            answer: {
                en: 'Domain and hosting costs are usually separate from the development package. However, we assist you in purchasing the best cloud server (AWS, Vercel, DigitalOcean) and set it up for you.',
                bn: 'ডোমেইন এবং হোস্টিংয়ের খরচ সাধারণত ডেভেলপমেন্ট প্যাকেজের বাইরে থাকে। তবে, আমরা আপনাকে সেরা ক্লাউড সার্ভার কিনতে এবং তা সেটআপ করতে সম্পূর্ণ সাহায্য করব।'
            }
        },
        {
            question: { en: 'What happens after the free support period?', bn: 'ফ্রি সাপোর্ট পিরিয়ড শেষ হওয়ার পর কী হবে?' },
            answer: {
                en: 'After the free support period ends, you can opt for our monthly or yearly maintenance packages starting at minimal costs to keep your project updated and secure.',
                bn: 'ফ্রি সাপোর্ট শেষ হওয়ার পর, আপনার প্রজেক্ট আপডেট এবং সুরক্ষিত রাখতে আপনি আমাদের অত্যন্ত সাশ্রয়ী মাসিক বা বার্ষিক মেইনটেন্যান্স প্যাকেজগুলো নিতে পারবেন।'
            }
        }
    ];
    // GSAP এনিমেশন লজিক
    useEffect(() => {
        const ctx = gsap.context(() => {
            // holds isReducedMotion check completely removed to guarantee animations run!
            // ১. হিরো টাইটেল মাস্ক রিভিল (শব্দভিত্তিক)
            const heroTitle = heroRef.current?.querySelector('h2');
            if (heroTitle) {
                const splitData = splitTextBilingual(heroTitle.innerText, 'words', language);
                heroTitle.innerHTML = splitData.items
                    .map(item => `<span class="inline-block overflow-hidden py-1"><span class="pricing-hero-reveal inline-block">${item}</span></span>`)
                    .join(' ');
                const revealItems = heroTitle.querySelectorAll('.pricing-hero-reveal');
                const heroTl = gsap.timeline();
                heroTl.fromTo(revealItems, { yPercent: 100, rotateX: 45, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' });
            }
            // ২. প্রাইসিং কার্ডস স্ট্যাগারড রিভিল (টগল চেঞ্জ হলেও এটি নতুন করে রি-অ্যানিমেট হবে)
            const cards = gridRef.current?.querySelectorAll('.pricing-card');
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
            // ৩. এফএকিউ (FAQ) কার্ডস রিভিল
            const faqItems = faqRef.current?.querySelectorAll('.faq-item');
            if (faqItems) {
                gsap.fromTo(faqItems, { opacity: 0, y: 30, scale: 0.98 }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    stagger: 0.08,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: faqRef.current,
                        start: 'top 80%',
                    }
                });
            }
        }, pageRef);
        return () => ctx.revert();
    }, [language, clientType]); // clientType ট্র্যাকিং এর ফলে টগল পপ-আপ অ্যানিমেশন সচল থাকবে
    const currentPlans = pricingPlans[clientType];
    return (_jsxs("div", { ref: pageRef, className: "w-full flex flex-col bg-[#071426]", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [t.navigation.pricing, " | Quanta Reach Solutions"] }), _jsx("meta", { name: "description", content: language === 'en' ? 'Transparent pricing plans for web and app development.' : 'ওয়েব এবং অ্যাপ ডেভেলপমেন্টের জন্য স্বচ্ছ প্রাইসিং প্যাকেজ।' })] }), _jsxs("section", { className: "relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/5 bg-[#0D1D33]", children: [_jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#168BFF]/10 rounded-full blur-[120px] pointer-events-none" }), _jsxs(Container, { className: "relative z-10 text-center max-w-4xl", children: [_jsx("div", { ref: heroRef, children: _jsx(SectionHeading, { badge: t.navigation.pricing, title: language === 'en' ? 'Clear & Transparent Pricing' : 'স্বচ্ছ এবং সাশ্রয়ী প্যাকেজসমূহ', subtitle: language === 'en'
                                        ? 'No hidden fees. We provide value-driven solutions tailored for both growing local businesses and global enterprises.'
                                        : 'কোনো লুকানো চার্জ নেই। আমরা দেশীয় ব্যবসা এবং গ্লোবাল এন্টারপ্রাইজ উভয়ের জন্যই মানসম্মত সলিউশন প্রদান করি।', className: "mx-auto mb-10" }) }), _jsx("div", { className: "flex justify-center", children: _jsxs("div", { className: "bg-[#071426] p-1.5 rounded-full border border-white/10 inline-flex relative shadow-2xl", children: [_jsx("button", { onClick: () => setClientType('local'), className: `relative z-10 px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 ${clientType === 'local' ? 'text-white' : 'text-white/40 hover:text-white'}`, children: language === 'en' ? 'Local (BDT)' : 'লোকাল (BDT)' }), _jsx("button", { onClick: () => setClientType('global'), className: `relative z-10 px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 ${clientType === 'global' ? 'text-white' : 'text-white/40 hover:text-white'}`, children: language === 'en' ? 'Global (USD)' : 'গ্লোবাল (USD)' }), _jsx("div", { className: "absolute top-1.5 bottom-1.5 rounded-full bg-[#168BFF] transition-all duration-300 ease-in-out shadow-lg shadow-[#168BFF]/20", style: {
                                                left: clientType === 'local' ? '6px' : '50%',
                                                width: 'calc(50% - 6px)',
                                            } })] }) })] })] }), _jsx("section", { className: "py-20 lg:py-32 relative bg-[#071426]", children: _jsx(Container, { children: _jsx("div", { ref: gridRef, className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto", children: currentPlans.map((plan) => (_jsxs("div", { className: `pricing-card relative bg-[#0D1D33]/50 backdrop-blur-sm p-8 md:p-10 rounded-3xl flex flex-col border transition-all duration-500 hover:-translate-y-2 group ${plan.isPopular ? 'border-[#168BFF] shadow-[0_20px_50px_rgba(22,139,255,0.1)] md:-mt-6 md:mb-6 z-10' : 'border-white/5 hover:border-white/20'}`, children: [plan.isPopular && (_jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-[#168BFF] text-[#071426] px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-xl", children: language === 'en' ? 'Most Popular' : 'সেরা পছন্দ' })), _jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-2xl md:text-3xl font-black text-white mb-3 tracking-tight uppercase", children: language === 'en' ? plan.name.en : plan.name.bn }), _jsx("p", { className: `text-white/40 text-sm leading-relaxed ${language === 'bn' ? 'leading-normal' : ''}`, children: language === 'en' ? plan.description.en : plan.description.bn })] }), _jsxs("div", { className: "mb-8 pb-8 border-b border-white/5", children: [_jsx("span", { className: "text-[#168BFF] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block", children: plan.price === 'Custom' ? '' : t.pricing.startingAt }), _jsx("div", { className: "flex items-baseline gap-1", children: _jsx("span", { className: "text-5xl md:text-6xl font-black text-white tracking-tighter", children: plan.price }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-8 bg-[#071426]/50 p-5 rounded-2xl border border-white/5", children: [_jsxs("div", { children: [_jsx("span", { className: "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1", children: language === 'en' ? 'Delivery' : 'ডেলিভারি' }), _jsx("span", { className: "block text-sm text-white font-bold", children: language === 'en' ? plan.delivery.en : plan.delivery.bn })] }), _jsxs("div", { children: [_jsx("span", { className: "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1", children: language === 'en' ? 'Revisions' : 'রিভিশন' }), _jsx("span", { className: "block text-sm text-white font-bold", children: language === 'en' ? plan.revisions.en : plan.revisions.bn })] })] }), _jsxs("div", { className: "flex-grow", children: [_jsx("span", { className: "block text-xs font-black text-white uppercase tracking-widest mb-6 opacity-60", children: language === 'en' ? 'Included Features' : 'প্যাকেজের অন্তর্ভুক্ত:' }), _jsx("ul", { className: "space-y-4 mb-10", children: (language === 'en' ? plan.features.en : plan.features.bn).map((feature, idx) => (_jsxs("li", { className: "flex items-start gap-3 group/item", children: [_jsx(CheckCircle2, { className: "w-5 h-5 text-[#168BFF] shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" }), _jsx("span", { className: "text-white/60 text-sm font-medium leading-relaxed group-hover/item:text-white transition-colors", children: feature })] }, idx))) })] }), _jsx(Link, { to: "/request-quote", className: "mt-auto", children: _jsx(Button, { variant: plan.isPopular ? 'primary' : 'outline', fullWidth: true, className: "rounded-full py-4 font-black uppercase tracking-widest text-xs", children: t.common.requestQuote }) })] }, plan.id))) }) }) }), _jsx("section", { className: "py-24 bg-[#0D1D33] border-y border-white/5 relative overflow-hidden", children: _jsx(Container, { className: "relative z-10 max-w-5xl", children: _jsxs("div", { ref: faqRef, children: [_jsx(SectionHeading, { title: language === 'en' ? 'Pricing FAQ' : 'প্রাইসিং নিয়ে জিজ্ঞাসা', subtitle: language === 'en'
                                    ? 'Everything you need to know about our project ownership and payment cycles.'
                                    : 'প্রজেক্টের মালিকানা এবং পেমেন্ট সিস্টেম সম্পর্কে বিস্তারিত তথ্য।' }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mt-16", children: faqs.map((faq, index) => (_jsxs("div", { className: "faq-item bg-[#071426]/50 p-8 rounded-3xl border border-white/5 hover:border-[#168BFF]/20 transition-all duration-300", children: [_jsx("h4", { className: "text-xl font-bold text-white mb-4", children: language === 'en' ? faq.question.en : faq.question.bn }), _jsx("p", { className: "text-white/40 text-sm leading-relaxed", children: language === 'en' ? faq.answer.en : faq.answer.bn })] }, index))) })] }) }) }), _jsxs("section", { className: "py-24 relative overflow-hidden bg-[#168BFF]", children: [_jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" }), _jsxs(Container, { className: "relative z-10 text-center", children: [_jsx("h2", { className: "text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase", children: language === 'en' ? 'Need a Custom Solution?' : 'কাস্টম সলিউশন প্রয়োজন?' }), _jsx("p", { className: "text-white/90 text-xl mb-12 max-w-2xl mx-auto font-medium", children: language === 'en'
                                    ? 'Contact us to discuss your specific requirements and get a detailed custom proposal.'
                                    : 'আপনার নির্দিষ্ট রিকোয়ারমেন্টস নিয়ে আলোচনা করতে এবং একটি কাস্টম প্রপোজাল পেতে আমাদের সাথে যোগাযোগ করুন।' }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-6", children: [_jsx(Link, { to: "/contact", children: _jsx(Button, { size: "lg", className: "bg-white !text-[#168BFF] font-black uppercase tracking-widest px-12 py-6 rounded-full hover:bg-gray-100 shadow-2xl transition-all hover:scale-105 active:scale-95", rightIcon: _jsx(ArrowRight, { className: "w-6 h-6 !text-[#168BFF]" }), children: language === 'en' ? 'Contact Us' : 'যোগাযোগ করুন' }) }), _jsx("a", { href: "https://wa.me/8801983398333", target: "_blank", rel: "noopener noreferrer", children: _jsx(Button, { variant: "secondary", size: "lg", className: "border-white/30 bg-[#071426] text-white hover:bg-black font-black uppercase tracking-widest px-12 py-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl", children: t.common.whatsappUs }) })] })] })] })] }));
};
