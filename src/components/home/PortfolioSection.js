import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { isReducedMotion } from '/src/lib/motion.js';
// পোর্টফোলিও ডাটা
const projects = [
    {
        id: 1,
        title: { en: 'Quantum E-commerce', bn: 'কোয়ান্টাম ই-কমার্স' },
        category: { en: 'Web Platform', bn: 'ওয়েব প্ল্যাটফর্ম' },
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200',
        gridClass: 'md:col-span-2 md:row-span-1', // বড় কার্ড
        isGlobal: true,
    },
    {
        id: 2,
        title: { en: 'Nova Banking App', bn: 'নোভা ব্যাংকিং অ্যাপ' },
        category: { en: 'UI/UX Design', bn: 'ইউআই/ইউএক্স ডিজাইন' },
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
        gridClass: 'md:col-span-1 md:row-span-1', // ছোট কার্ড
        isGlobal: false,
    },
    {
        id: 3,
        title: { en: 'Stellar CRM', bn: 'স্টেলার সিআরএম' },
        category: { en: 'Enterprise SaaS', bn: 'এন্টারপ্রাইজ SaaS' },
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        gridClass: 'md:col-span-1 md:row-span-1',
        isGlobal: true,
    },
    {
        id: 4,
        title: { en: 'Aura Health Tech', bn: 'অরা হেলথ টেক' },
        category: { en: 'Mobile Application', bn: 'মোবাইল অ্যাপ্লিকেশন' },
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200',
        gridClass: 'md:col-span-2 md:row-span-1',
        isGlobal: true,
    },
];
export const PortfolioSection = () => {
    const { language } = useLanguage();
    const sectionRef = useRef(null);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            if (isReducedMotion())
                return;
            const items = gsap.utils.toArray('.portfolio-item');
            items.forEach((item) => {
                const image = item.querySelector('.project-image');
                const curtain = item.querySelector('.project-curtain');
                // ১. কার্টেইন রিভিল অ্যানিমেশন
                gsap.to(curtain, {
                    scaleY: 0,
                    duration: 1.2,
                    ease: 'power4.inOut',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                    }
                });
                // ২. ইমেজ প্যারালাক্স ইফেক্ট
                gsap.fromTo(image, { y: -50, scale: 1.15 }, {
                    y: 50,
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                });
                // ৩. ৩ডি টিল্ট ইন্টারঅ্যাকশন
                const handleMouseMove = (e) => {
                    const { clientX, clientY } = e;
                    const { left, top, width, height } = item.getBoundingClientRect();
                    const x = (clientX - left) / width - 0.5;
                    const y = (clientY - top) / height - 0.5;
                    gsap.to(item, {
                        rotateY: x * 10,
                        rotateX: -y * 10,
                        transformPerspective: 1000,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                };
                const handleMouseLeave = () => {
                    gsap.to(item, {
                        rotateY: 0,
                        rotateX: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    });
                };
                item.addEventListener('mousemove', handleMouseMove);
                item.addEventListener('mouseleave', handleMouseLeave);
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);
    return (_jsxs("section", { ref: sectionRef, className: "relative py-24 md:py-32 bg-[#F5F8FC] overflow-hidden", children: [_jsxs("div", { className: "container mx-auto px-6 relative z-10", children: [_jsx(SectionHeading, { badge: language === 'en' ? 'SELECTED WORKS' : 'নির্বাচিত কাজসমূহ', title: language === 'en' ? 'Impactful Solutions' : 'প্রভাবশালী সমাধান', subtitle: language === 'en' ? 'A showcase of our recent projects delivering digital excellence across borders.' : 'সীমানা ছাড়িয়ে ডিজিটাল উৎকর্ষ নিশ্চিত করা আমাদের সাম্প্রতিক প্রজেক্টগুলোর একটি প্রদর্শনী।', align: "center", className: "!text-[#071426] mb-16" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12", children: projects.map((project) => (_jsxs("div", { className: `portfolio-item group relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-blue-900/5 cursor-none ${project.gridClass}`, "data-cursor": "view", style: { willChange: 'transform' }, children: [_jsxs("div", { className: "relative aspect-[16/10] overflow-hidden", children: [_jsx("img", { src: project.image, alt: project.title.en, className: "project-image w-full h-full object-cover will-change-transform" }), _jsx("div", { className: "project-curtain absolute inset-0 bg-[#071426] origin-top z-20" }), _jsx("div", { className: "absolute inset-0 bg-[#168BFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" })] }), _jsxs("div", { className: "p-6 md:p-8 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[#168BFF] font-mono text-xs tracking-widest uppercase", children: language === 'en' ? project.category.en : project.category.bn }), _jsx("div", { className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${project.isGlobal ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`, children: project.isGlobal
                                                        ? (language === 'en' ? 'Global' : 'বৈশ্বিক')
                                                        : (language === 'en' ? 'Local' : 'স্থানীয়') })] }), _jsx("h3", { className: "text-[#071426] text-2xl md:text-3xl font-bold tracking-tight group-hover:text-[#168BFF] transition-colors duration-300", children: language === 'en' ? project.title.en : project.title.bn }), _jsxs("div", { className: "flex items-center gap-2 text-[#071426]/40 group-hover:text-[#168BFF] transition-all duration-500", children: [_jsx("span", { className: "h-[1px] w-8 bg-current group-hover:w-12 transition-all" }), _jsx("span", { className: "text-xs font-bold uppercase tracking-widest", children: language === 'en' ? 'View Case Study' : 'কেস স্টাডি দেখুন' })] })] })] }, project.id))) }), _jsx("div", { className: "mt-20 text-center", children: _jsxs("button", { className: "group relative px-10 py-5 bg-transparent border-2 border-[#168BFF] text-[#168BFF] font-bold rounded-full overflow-hidden transition-all duration-300 hover:text-white", children: [_jsx("span", { className: "relative z-10", children: language === 'en' ? 'Explore Full Portfolio' : 'সম্পূর্ণ পোর্টফোলিও দেখুন' }), _jsx("div", { className: "absolute inset-0 bg-[#168BFF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" })] }) })] }), _jsx("div", { className: "absolute inset-0 opacity-[0.03] pointer-events-none", style: { backgroundImage: 'radial-gradient(#071426 1px, transparent 0)', backgroundSize: '40px 40px' } })] }));
};
