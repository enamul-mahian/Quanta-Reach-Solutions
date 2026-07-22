import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { splitTextBilingual, isReducedMotion } from '/src/lib/motion.js';
const testimonials = [
    {
        id: 1,
        quote: {
            en: "Quanta Reach didn't just build a website; they engineered a growth engine for our global operations.",
            bn: "কোয়ান্টা রিচ শুধু একটি ওয়েবসাইট তৈরি করেনি; তারা আমাদের বৈশ্বিক কার্যক্রমের জন্য একটি গ্রোথ ইঞ্জিন তৈরি করেছে।"
        },
        author: "James Anderson",
        role: "CEO, TechNova Solutions",
        country: "USA",
        result: { en: "+120% Conversion", bn: "+১২০% কনভার্সন" },
        project: "Quantum Platform"
    },
    {
        id: 2,
        quote: {
            en: "The bilingual integration and the motion quality are world-class. Truly a premium agency experience.",
            bn: "বাইলিঙ্গুয়াল ইন্টিগ্রেশন এবং মোশন কোয়ালিটি বিশ্বমানের। সত্যিই একটি প্রিমিয়াম এজেন্সি অভিজ্ঞতা।"
        },
        author: "রাশেদ আহমেদ",
        role: "ম্যানেজিং ডিরেক্টর, রূপান্তর গ্রুপ",
        country: "Bangladesh",
        result: { en: "45% Revenue Growth", bn: "৪৫% রাজস্ব বৃদ্ধি" },
        project: "Rupantor ERP"
    }
];
// কম্পোনেন্ট নাম ফাইলের নামের সাথে মিল রেখে 'TestimonialsSection' করা হলো
export const TestimonialsSection = () => {
    const { language } = useLanguage();
    const sectionRef = useRef(null);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            if (isReducedMotion())
                return;
            const items = gsap.utils.toArray('.testimonial-item');
            items.forEach((item) => {
                const quoteText = item.querySelector('.quote-text');
                const infoBar = item.querySelector('.info-bar');
                if (!quoteText)
                    return;
                // ১. টেক্সট স্প্লিটিং (Bilingual Safe)
                const data = splitTextBilingual(quoteText.innerText, 'words', language);
                quoteText.innerHTML = data.items
                    .map(word => `<span class="inline-block overflow-hidden"><span class="quote-word inline-block">${word}&nbsp;</span></span>`)
                    .join('');
                const words = quoteText.querySelectorAll('.quote-word');
                // ২. স্ক্রল-ট্রিগারড অ্যানিমেশন
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 70%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none none'
                    }
                });
                tl.fromTo(words, { yPercent: 100, rotate: 2 }, {
                    yPercent: 0,
                    rotate: 0,
                    duration: 0.8,
                    stagger: 0.03,
                    ease: 'power4.out'
                })
                    .fromTo(infoBar, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [language]);
    return (_jsxs("section", { ref: sectionRef, className: "relative py-24 md:py-40 bg-[#071426] overflow-hidden", children: [_jsxs("div", { className: "container mx-auto px-6 relative z-10", children: [_jsx(SectionHeading, { badge: language === 'en' ? 'TESTIMONIALS' : 'প্রশংসাপত্র', title: language === 'en' ? 'Trusted by Visionaries' : 'স্বপ্নদ্রষ্টাদের আস্থা', align: "center", className: "mb-20" }), _jsx("div", { className: "flex flex-col gap-32 md:gap-48", children: testimonials.map((item) => (_jsxs("div", { className: "testimonial-item relative max-w-6xl mx-auto text-center", children: [_jsx("div", { className: "absolute -top-16 left-1/2 -translate-x-1/2 text-[#168BFF]/10 text-[15rem] font-serif pointer-events-none select-none", children: "\u201C" }), _jsx("h3", { className: "quote-text text-white text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-12 relative z-10", children: language === 'en' ? item.quote.en : item.quote.bn }), _jsxs("div", { className: "info-bar flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative z-10", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-tr from-[#168BFF] to-[#7457FF] p-[1px]", children: _jsx("div", { className: "w-full h-full rounded-full bg-[#071426] flex items-center justify-center text-white font-bold text-xs", children: item.author.charAt(0) }) }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-white font-bold text-lg leading-none", children: item.author }), _jsx("p", { className: "text-white/40 text-xs mt-1 uppercase tracking-widest", children: item.role })] })] }), _jsxs("div", { className: "flex flex-wrap justify-center gap-3", children: [_jsxs("div", { className: "px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-[#168BFF]" }), _jsx("span", { className: "text-[10px] font-mono text-white/60 uppercase tracking-wider", children: item.project })] }), _jsx("div", { className: "px-4 py-2 rounded-full bg-[#168BFF]/10 border border-[#168BFF]/20 flex items-center gap-2", children: _jsx("span", { className: "text-[10px] font-bold text-[#168BFF] uppercase tracking-wider", children: language === 'en' ? item.result.en : item.result.bn }) }), _jsx("div", { className: "px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono uppercase tracking-widest", children: item.country })] })] })] }, item.id))) })] }), _jsxs("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20", children: [_jsx("div", { className: "absolute top-0 left-0 w-[500px] h-[500px] bg-[#168BFF]/10 filter blur-[150px] rounded-full animate-pulse" }), _jsx("div", { className: "absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7457FF]/10 filter blur-[150px] rounded-full animate-pulse", style: { animationDelay: '2s' } })] })] }));
};
