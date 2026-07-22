import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Services Page (Premium Animated Edition)
// =========================================================================
import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Code2, Smartphone, Palette, LineChart, Cloud, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
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
export const ServicesPage = () => {
    const { t, language } = useLanguage();
    // অ্যানিমেশনের জন্য রিফ সেটআপ
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const gridRef = useRef(null);
    const techContainerRef = useRef(null);
    // বিস্তারিত সার্ভিস ডেটা
    const allServices = [
        {
            id: 'custom-software-development',
            icon: _jsx(Code2, { className: "w-10 h-10 text-electric" }),
            title: { en: 'Custom Software Development', bn: 'কাস্টম সফটওয়্যার ডেভেলপমেন্ট' },
            description: {
                en: 'We build scalable, secure, and robust enterprise software solutions tailored to your unique business requirements. From ERPs to custom SaaS platforms, our engineering team delivers excellence.',
                bn: 'আমরা আপনার ব্যবসার নিজস্ব চাহিদার ওপর ভিত্তি করে স্কেলেবল, সুরক্ষিত এবং শক্তিশালী এন্টারপ্রাইজ সফটওয়্যার তৈরি করি। ইআরপি (ERP) থেকে শুরু করে কাস্টম স্যাস (SaaS) প্ল্যাটফর্ম—সবকিছুতেই আমাদের রয়েছে দারুণ দক্ষতা।'
            },
            features: {
                en: ['Web Applications (React, Node.js)', 'Enterprise ERP & CRM', 'SaaS Product Development', 'API Development & Integration'],
                bn: ['ওয়েব অ্যাপ্লিকেশন (React, Node.js)', 'এন্টারপ্রাইজ ইআরপি এবং সিআরএম', 'স্যাস (SaaS) প্রোডাক্ট ডেভেলপমেন্ট', 'এপিআই অবদান ও ইন্টিগ্রেশন']
            }
        },
        {
            id: 'mobile-app-development',
            icon: _jsx(Smartphone, { className: "w-10 h-10 text-purple-accent" }),
            title: { en: 'Mobile App Development', bn: 'মোবাইল অ্যাপ ডেভেলপমেন্ট' },
            description: {
                en: 'Deliver seamless mobile experiences with our high-performance native and cross-platform applications for iOS and Android devices.',
                bn: 'আইওএস এবং অ্যান্ড্রয়েড ডিভাইসের জন্য উচ্চ-ক্ষমতাসম্পন্ন নেটিভ এবং ক্রস-প্ল্যাটফর্ম মোবাইল অ্যাপ্লিকেশনের মাধ্যমে গ্রাহকদের দিন সেরা অভিজ্ঞতা।'
            },
            features: {
                en: ['iOS & Android Apps', 'React Native & Flutter', 'App Maintenance & Updates', 'App Store Optimization (ASO)'],
                bn: ['আইওএস এবং অ্যান্ড্রয়েড অ্যাপস', 'রিঅ্যাক্ট নেটিভ এবং ফ্লাটার', 'অ্যাপ মেইনটেন্যান্স ও আপডেট', 'অ্যাপ স্টোর অপ্টিমাইজেশন (ASO)']
            }
        },
        {
            id: 'ui-ux-design',
            icon: _jsx(Palette, { className: "w-10 h-10 text-electric-bright" }),
            title: { en: 'UI/UX & Product Design', bn: 'ইউআই/ইউএক্স এবং প্রোডাক্ট ডিজাইন' },
            description: {
                en: 'Our design philosophy revolves around the user. We craft intuitive, conversion-focused, and visually stunning interfaces that elevate your brand experience.',
                bn: 'আমাদের ডিজাইনের মূল লক্ষ্য হলো ইউজার। আমরা এমন সব ইউজার-বান্ধব এবং দৃষ্টিনন্দন ইন্টারফেস ডিজাইন করি, যা আপনার ব্র্যান্ডের মান বহুগুণ বাড়িয়ে দেয়।'
            },
            features: {
                en: ['Wireframing & Prototyping', 'User Research & Journey Mapping', 'Web & App Interface Design', 'Brand Identity Creation'],
                bn: ['ওয়্যারফ্রেমিং এবং প্রোটোটাইপিং', 'ইউজার রিসার্চ এবং জার্নি ম্যাপিং', 'ওয়েব এবং অ্যাপ ইন্টারফেস ডিজাইন', 'ব্র্যান্ড আইডেন্টিটি তৈরি']
            }
        },
        {
            id: 'digital-marketing-seo',
            icon: _jsx(LineChart, { className: "w-10 h-10 text-electric" }),
            title: { en: 'Digital Marketing & SEO', bn: 'ডিজিটাল মার্কেটিং এবং এসইও' },
            description: {
                en: 'Accelerate your growth with data-driven marketing strategies and advanced SEO techniques designed to boost your digital presence and ROI.',
                bn: 'আপনার ডিজিটাল উপস্থিতি এবং রিটার্ন অন ইনভেস্টমেন্ট (ROI) বৃদ্ধির লক্ষ্যে ডেটা-নির্ভর মার্কেটিং কৌশল এবং অ্যাডভান্সড এসইও টেকনিক ব্যবহার করুন।'
            },
            features: {
                en: ['Search Engine Optimization (SEO)', 'Social Media Management', 'Pay-Per-Click (PPC) Campaigns', 'Conversion Rate Optimization'],
                bn: ['সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO)', 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট', 'পেইড অ্যাডস (PPC) ক্যাম্পেইন', 'কনভার্সন রেট অপ্টিমাইজেশন']
            }
        },
        {
            id: 'cloud-infrastructure',
            icon: _jsx(Cloud, { className: "w-10 h-10 text-purple-accent" }),
            title: { en: 'Cloud Infrastructure', bn: 'ক্লাউড ইনফ্রাস্ট্রাকচার' },
            description: {
                en: 'Modernize your business operations with secure cloud migration, architecture planning, and maintenance using top-tier platforms like AWS, Google Cloud, and Azure.',
                bn: 'এডাব্লিউএস, গুগল ক্লাউড এবং অ্যাজুরে-এর মতো শীর্ষ প্ল্যাটফর্ম ব্যবহার করে সুরক্ষিত ক্লাউড মাইগ্রেশন এবং আর্কিটেকচার ম্যানেজমেন্টের মাধ্যমে ব্যবসাকে আধুনিক করুন।'
            },
            features: {
                en: ['Cloud Migration Strategy', 'AWS / Google Cloud Setup', 'Server Maintenance & Monitoring', 'DevOps & CI/CD Pipelines'],
                bn: ['ক্লাউড মাইগ্রেশন কৌশল', 'এডাব্লিউএস / গুগল ক্লাউড সেটআপ', 'সার্ভার মেইনটেন্যান্স ও মনিটরিং', 'ডেভঅপস এবং সিআই/সিডি পাইপলাইন']
            }
        },
        {
            id: 'cybersecurity-qa',
            icon: _jsx(ShieldCheck, { className: "w-10 h-10 text-electric-bright" }),
            title: { en: 'Cybersecurity & QA', bn: 'সাইবার সিকিউরিটি এবং কিউএ' },
            description: {
                en: 'Ensure your digital products are flawless and secure. We provide comprehensive security testing and rigorous quality assurance protocols.',
                bn: 'আপনার ডিজিটাল প্রোডাক্টকে সুরক্ষিত ও ত্রুটিমুক্ত রাখতে আমরা সর্বাধুনিক সাইবার সিকিউরিটি টেস্টিং এবং কঠোর কোয়ালিটি অ্যাসিওরেন্স প্রদান করি।'
            },
            features: {
                en: ['Vulnerability Assessment', 'Automated & Manual Testing', 'Performance Optimization', 'Data Privacy Compliance'],
                bn: ['ভলনারেবিলিটি অ্যাসেসমেন্ট', 'অটোমেটেড ও ম্যানুয়াল টেস্টিং', 'পারফরম্যান্স অপ্টিমাইজেশন', 'ডেটা প্রাইভেসি কমপ্লায়েন্স']
            }
        }
    ];
    // টেক স্ট্যাক এবং মার্কেটিংয়ের আপডেটকৃত সকল স্কিলস (১০০% সংরক্ষিত)
    const techStack = [
        'React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'Firebase', 'AWS', 'Google Cloud', 'Flutter', 'Tailwind CSS',
        'SEO & SEM', 'Google Ads', 'Meta Ads Manager', 'Google Analytics 4', 'Content Strategy', 'Email Marketing', 'Market Research', 'CRM Automation'
    ];
    // GSAP এনিমেশন লজিক
    useEffect(() => {
        const ctx = gsap.context(() => {
            // isReducedMotion সংক্রান্ত চেক ও ভ্যারিয়েবল সম্পূর্ণ মুছে ফেলা হয়েছে
            // ১. হিরো টাইটেল মাস্ক রিভিল (শব্দভিত্তিক স্প্লিটিং)
            const heroTitle = heroRef.current?.querySelector('h2');
            if (heroTitle) {
                const splitData = splitTextBilingual(heroTitle.innerText, 'words', language);
                // "Solutions" শব্দটি যেন ভেঙে না যায় সেজন্য শব্দভিত্তিক ম্যাপিং
                heroTitle.innerHTML = splitData.items
                    .map(item => `<span class="inline-block overflow-hidden py-1"><span class="services-hero-reveal inline-block">${item}</span></span>`)
                    .join(' ');
                const revealItems = heroTitle.querySelectorAll('.services-hero-reveal');
                const heroTl = gsap.timeline();
                heroTl.fromTo(revealItems, { yPercent: 100, rotateX: 45, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' });
            }
            // ২. সার্ভিস কার্ডস স্ট্যাগারড রিভিল
            const cards = gridRef.current?.querySelectorAll('.service-card');
            if (cards) {
                gsap.fromTo(cards, { opacity: 0, y: 50, scale: 0.95 }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 80%',
                    }
                });
            }
            // ৩. টেক স্ট্যাক ট্যাগ ক্লাউড এনিমেশন
            const tags = techContainerRef.current?.querySelectorAll('.tech-tag');
            if (tags) {
                gsap.fromTo(tags, { opacity: 0, scale: 0.5, rotate: -5 }, {
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    stagger: 0.03,
                    ease: 'back.out(1.5)',
                    scrollTrigger: {
                        trigger: techContainerRef.current,
                        start: 'top 85%',
                    }
                });
            }
        }, pageRef);
        return () => ctx.revert();
    }, [language]);
    return (_jsxs("div", { ref: pageRef, className: "w-full flex flex-col bg-[#071426]", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [t.navigation.services, " | Quanta Reach Solutions"] }), _jsx("meta", { name: "description", content: language === 'en' ? 'Explore our wide range of digital services including web development, mobile apps, and UI/UX design.' : 'আমাদের ওয়েব ডেভেলপমেন্ট, মোবাইল অ্যাপস এবং UI/UX ডিজাইনের মতো ডিজিটাল পরিষেবাগুলো সম্পর্কে জানুন।' })] }), _jsxs("section", { className: "relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/5 bg-[#0D1D33]", children: [_jsx("div", { className: "absolute top-0 left-0 w-[500px] h-[500px] bg-[#168BFF]/10 rounded-full blur-[120px] pointer-events-none" }), _jsx(Container, { className: "relative z-10 text-center max-w-4xl", children: _jsx("div", { ref: heroRef, children: _jsx(SectionHeading, { badge: t.navigation.services, title: language === 'en' ? 'End-to-End Digital Solutions' : 'সম্পূর্ণ ডিজিটাল সলিউশন', subtitle: language === 'en'
                                    ? 'We blend creativity, strategy, and technology to deliver transformative results for businesses globally and locally.'
                                    : 'দেশ-বিদেশের ব্যবসাগুলোর জন্য যুগান্তকারী ফলাফল আনতে আমরা সৃজনশীলতা, কৌশল এবং প্রযুক্তির দারুণ সংমিশ্রণ ঘটাই।', className: "mx-auto" }) }) })] }), _jsx("section", { className: "py-20 lg:py-28 relative", children: _jsx(Container, { children: _jsx("div", { ref: gridRef, className: "grid grid-cols-1 lg:grid-cols-2 gap-10", children: allServices.map((service) => (_jsxs("div", { className: "service-card bg-[#0D1D33]/50 backdrop-blur-sm p-8 md:p-10 rounded-3xl flex flex-col group border border-white/5 hover:border-[#168BFF]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(22,139,255,0.08)]", children: [_jsx("div", { className: "w-20 h-20 rounded-2xl bg-[#071426] border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#168BFF]/10 transition-all duration-500", children: service.icon }), _jsx("h3", { className: "text-2xl font-bold text-white mb-4 group-hover:text-[#168BFF] transition-colors", children: language === 'en' ? service.title.en : service.title.bn }), _jsx("p", { className: `text-white/50 mb-8 leading-relaxed flex-grow ${language === 'bn' ? 'leading-loose' : ''}`, children: language === 'en' ? service.description.en : service.description.bn }), _jsxs("div", { className: "border-t border-white/5 pt-6 mt-auto", children: [_jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8", children: (language === 'en' ? service.features.en : service.features.bn).map((feature, idx) => (_jsxs("li", { className: "flex items-start gap-2 text-sm text-white/40", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-[#168BFF] shrink-0 mt-0.5" }), _jsx("span", { children: feature })] }, idx))) }), _jsx(Link, { to: `/services/${service.id}`, children: _jsx(Button, { variant: "outline", rightIcon: _jsx(ArrowRight, { className: "w-4 h-4" }), children: t.common.learnMore }) })] })] }, service.id))) }) }) }), _jsx("section", { className: "py-20 bg-[#0D1D33] border-y border-white/5 relative overflow-hidden", children: _jsxs(Container, { className: "text-center relative z-10", children: [_jsx(SectionHeading, { title: language === 'en' ? 'Expertise & Technologies' : 'আমাদের বিশেষত্ব ও প্রযুক্তি', subtitle: language === 'en'
                                ? 'We utilize modern tech stacks and data-driven marketing strategies to ensure sustainable digital growth.'
                                : 'টেকসই ডিজিটাল প্রবৃদ্ধি নিশ্চিত করতে আমরা আধুনিক টেকনোলজি এবং ডেটা-নির্ভর মার্কেটিং কৌশল ব্যবহার করি।' }), _jsx("div", { ref: techContainerRef, className: "flex flex-wrap justify-center gap-4 max-w-5xl mx-auto mt-12", children: techStack.map((tech, idx) => (_jsx("span", { className: "tech-tag px-6 py-3 rounded-full bg-white/5 text-white/80 text-sm font-bold tracking-wide border border-white/10 hover:border-[#168BFF] hover:text-[#168BFF] hover:bg-[#168BFF]/5 transition-all duration-300 cursor-default uppercase", children: tech }, idx))) })] }) }), _jsxs("section", { className: "py-24 relative overflow-hidden bg-[#071426]", children: [_jsx("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#168BFF]/20 blur-[120px] rounded-full pointer-events-none" }), _jsxs(Container, { className: "relative z-10 text-center", children: [_jsx("h2", { className: "text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase", children: language === 'en' ? 'Have a Project in Mind?' : 'নতুন কোনো প্রজেক্ট নিয়ে ভাবছেন?' }), _jsx("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: _jsx(Link, { to: "/request-quote", children: _jsx(Button, { size: "lg", className: "px-10 py-5 rounded-full font-black uppercase tracking-widest", rightIcon: _jsx(ArrowRight, { className: "w-5 h-5" }), children: t.common.requestQuote }) }) })] })] })] }));
};
