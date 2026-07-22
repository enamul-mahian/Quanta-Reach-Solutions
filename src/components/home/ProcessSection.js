import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
const processSteps = [
    {
        id: '01',
        title: { en: 'Discovery & Consultation', bn: 'অনুসন্ধান ও পরামর্শ' },
        desc: {
            en: 'We deep-dive into your business ecosystem, existing workflow, target audience, and long-term vision to align our technical strategy with your core objectives.',
            bn: 'আমরা আপনার ব্যবসায়িক ইকোসিস্টেম, বর্তমান কর্মপ্রবাহ, টার্গেট অডিয়েন্স এবং দীর্ঘমেয়াদী ভিশন গভীরভাবে বিশ্লেষণ করি যাতে আমাদের প্রযুক্তিগত কৌশলটি আপনার মূল উদ্দেশ্যের সাথে সামঞ্জস্যপূর্ণ হয়।'
        },
        deliverables: {
            en: ['Target Audience Mapping', 'Competitor Analysis', 'Objective Alignment'],
            bn: ['টার্গেট অডিয়েন্স ম্যাপিং', 'প্রতিযোগী বিশ্লেষণ', 'মূল উদ্দেশ্য নির্ধারণ']
        }
    },
    {
        id: '02',
        title: { en: 'Deep Technical Analysis', bn: 'গভীর কারিগরি বিশ্লেষণ' },
        desc: {
            en: 'Evaluating structural requirements, potential technological roadblocks, data models, and selecting the optimal stack to guarantee infinite scalability.',
            bn: 'কাঠামোগত প্রয়োজনীয়তা, সম্ভাব্য প্রযুক্তিগত প্রতিবন্ধকতা, ডেটা মডেল মূল্যায়ন এবং অসীম স্কেলেবিলিটি নিশ্চিত করতে নিখুঁত টেকনোলজি স্ট্যাক নির্বাচন করা।'
        },
        deliverables: {
            en: ['Technical Feasibility Study', 'System Architecture Outline', 'Tech Stack Finalization'],
            bn: ['প্রযুক্তিগত সম্ভাব্যতা যাচাই', 'সিস্টেম আর্কিটেকচার আউটলাইন', 'টেক স্ট্যাক নির্ধারণ']
        }
    },
    {
        id: '03',
        title: { en: 'Roadmap & Proposal', bn: 'রোডম্যাপ ও প্রস্তাবনা' },
        desc: {
            en: 'Crafting a fully transparent project roadmap, development milestones, resource allocation plan, and a mutually beneficial framework agreement.',
            bn: 'একটি সম্পূর্ণ স্বচ্ছ প্রজেক্ট রোডম্যাপ, ডেভেলপমেন্ট মাইলস্টোন, রিসোর্স বন্টন পরিকল্পনা এবং পারস্পরিক স্বার্থরক্ষা চুক্তি প্রস্তুত করা।'
        },
        deliverables: {
            en: ['Detailed Scope of Work (SOW)', 'Timeline & Milestone Chart', 'Cost & Resource Breakdown'],
            bn: ['বিস্তারিত কাজের পরিধি (SOW)', 'টাইমলাইন ও মাইলস্টোন চার্ট', 'বাজেট ও রিসোর্স বিভাজন']
        }
    },
    {
        id: '04',
        title: { en: 'Architecture & Planning', bn: 'আর্কিটেকচার ও পরিকল্পনা' },
        desc: {
            en: 'Defining extensive structural layouts, wireframe schematics, user flow diagrams, and solidifying the chosen data schemas for backend integrations.',
            bn: 'বিস্তারিত কাঠামোগত লেআউট, ওয়্যারফ্রেম স্কিমেটিক্স, ইউজার ফ্লো ডায়াগ্রাম এবং ব্যাকএন্ড ইন্টিগ্রেশনের জন্য ডেটা স্কিমা চূড়ান্ত করা।'
        },
        deliverables: {
            en: ['Database Schema Blueprint', 'Sitemap & Information Architecture', 'User Journey Mapping'],
            bn: ['ডাটাবেস স্কিমা ব্লুপ্রিন্ট', 'সাইটম্যাপ ও ইনফরমেশন আর্কিটেকচার', 'ইউজার জার্নি ম্যাপিং']
        }
    },
    {
        id: '05',
        title: { en: 'High-Fidelity UI/UX Design', bn: 'হাই-ফিডেলিটি ইউআই/ইউএক্স ডিজাইন' },
        desc: {
            en: 'Designing bespoke, intuitive visual interfaces and highly interactive high-fidelity prototypes that genuinely represent your unique digital identity.',
            bn: 'আপনার অনন্য ডিজিটাল পরিচয় ফুটিয়ে তুলতে বেসপোক, ইনটুইটিভ ভিজ্যুয়াল ইন্টারফেস এবং অত্যন্ত ইন্টারেক্টিভ হাই-ফিডেলিটি প্রোটোটাইপ ডিজাইন করা।'
        },
        deliverables: {
            en: ['Figma Component-Driven UI', 'Interactive Clickable Prototype', 'Global Design System'],
            bn: ['ফিগমা কম্পোনেন্ট-ড্রিভেন UI', 'ইন্টারেক্টিভ ক্লিকেবল প্রোটোটাইপ', 'গ্লোবাল ডিজাইন সিস্টেম']
        }
    },
    {
        id: '06',
        title: { en: 'Precision Development', bn: 'নিখুঁত কোডিং ও ডেভেলপমেন্ট' },
        desc: {
            en: 'Translating certified UI/UX templates into modern, clean, modular, and highly optimized frontend and scalable backend codebases.',
            bn: 'সার্টিফাইড ইউআই/ইউএক্স টেমপ্লেটগুলোকে আধুনিক, পরিচ্ছন্ন, মডুলার এবং অত্যন্ত অপ্টিমাইজড ফ্রন্টএন্ড এবং ব্যাকএন্ড কোডবেসে রূপান্তর করা।'
        },
        deliverables: {
            en: ['Modular, Reusable Codebase', 'SEO Friendly DOM Rendering', 'API Schema Integration'],
            bn: ['মডুলার ও রিইউজেবল কোডবেস', 'এসইও ফ্রেন্ডলি DOM রেন্ডারিং', 'এপিআই স্কিমা ইন্টিগ্রেশন']
        }
    },
    {
        id: '07',
        title: { en: 'Rigorous Quality Assurance', bn: 'কঠোর মান নিয়ন্ত্রণ (QA Testing)' },
        desc: {
            en: 'Comprehensive automated unit testing, cross-browser responsiveness audits, and rigorous server-load tests to guarantee error-free execution.',
            bn: 'ভুলহীন কার্যকারিতা নিশ্চিত করতে ব্যাপক অটোমেটেড ইউনিট টেস্টিং, ক্রস-ব্রাউজার রেসপন্সিভনেস অডিট এবং সার্ভার-লোড টেস্ট করা।'
        },
        deliverables: {
            en: ['Cross-Device Compatibility Report', 'Security Vulnerability Patching', 'V8 Engine Optimization'],
            bn: ['ক্রস-ডিভাইস সামঞ্জস্যতা রিপোর্ট', 'নিরাপত্তা ত্রুটি সংশোধন (Patching)', 'ভি-৮ ইঞ্জিন অপ্টিমাইজেশন']
        }
    },
    {
        id: '08',
        title: { en: 'Collaborative Client Review', bn: 'যৌথ ক্লায়েন্ট মূল্যায়ন' },
        desc: {
            en: 'A collaborative testing phase on our high-speed staging servers, enabling live feedback collection, precise tweaking, and user acceptance checks.',
            bn: 'আমাদের হাই-স্পিড স্টেজিং সার্ভারে একটি সহযোগিতামূলক টেস্টিং ধাপ, যা লাইভ ফিডব্যাক সংগ্রহ, সূক্ষ্ম পরিবর্তন এবং ইউজার অ্যাকসেপ্টেন্স নিশ্চিত করে।'
        },
        deliverables: {
            en: ['Staging Server Deployment', 'Feedback Loop Verification', 'User Acceptance Testing (UAT)'],
            bn: ['স্টেজিং সার্ভার ডেপ্লয়মেন্ট', 'ফিডব্যাক লুপ ভেরিফিকেশন', 'ইউজার অ্যাকসেপ্টেন্স টেস্টিং (UAT)']
        }
    },
    {
        id: '09',
        title: { en: 'Secure Production Launch', bn: 'নিরাপদ লাইভ শুভ উদ্বোধন' },
        desc: {
            en: 'Deploying optimized builds to global cloud systems, setting up real-time server telemetry, CDN caching routing, and live monitoring dashboards.',
            bn: 'অপ্টিমাইজড বিল্ডগুলোকে বিশ্বমানের ক্লাউড সিস্টেমে ডেপ্লয় করা, রিয়েল-টাইম সার্ভার টেলিমেট্রি, CDN ক্যাশিং রাউটিং এবং লাইভ মনিটরিং সেটআপ করা।'
        },
        deliverables: {
            en: ['Secure Live Cloud Migration', 'Real-Time Error Telemetry Setup', 'Search Console Indexing'],
            bn: ['নিরাপদ লাইভ ক্লাউড মাইগ্রেশন', 'রিয়েল-টাইম এরর টেলিমেট্রি সেটআপ', 'সার্চ কনসোল ইনডেক্সিং']
        }
    },
    {
        id: '10',
        title: { en: 'Operational Training & Support', bn: 'প্রশিক্ষণ ও সার্বক্ষণিক সাপোর্ট' },
        desc: {
            en: 'Empowering your administration with video-guided operations training, complete documentation handover, and proactive security maintenance plans.',
            bn: 'ভিডিও-গাইডেড অপারেশনাল ট্রেনিং, সম্পূর্ণ ডকুমেন্টেশন হস্তান্তর এবং প্রোঅ্যাক্টিভ সিকিউরিটি মেইনটেইনেন্স দিয়ে আপনার টিমকে স্বাবলম্বী করা।'
        },
        deliverables: {
            en: ['Admin Panel Training Guide', '30-Day Hypercare Support', 'Database Automated Backups'],
            bn: ['অ্যাডমিন প্যানেল ট্রেনিং গাইড', '৩০ দিনের হাইপারকেয়ার সাপোর্ট', 'ডেটাবেস অটোমেটেড ব্যাকআপ']
        }
    },
];
export const ProcessSection = () => {
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const progressLineRef = useRef(null);
    const stepsRef = useRef(null);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            // ১. প্রগ্রেস লাইন স্ক্রল অ্যানিমেশন (নিচ থেকে ওপরের দিকে স্মুথ ফিলিং)
            gsap.fromTo(progressLineRef.current, { scaleY: 0 }, {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: stepsRef.current,
                    start: 'top 40%',
                    end: 'bottom 60%',
                    scrub: 1,
                },
            });
            // ২. প্রতিটি স্টেপের স্ক্রল ট্রিগারড রিভিল এবং অ্যাক্টিভ-স্টেপ হাইলাইট অ্যানিমেশন
            const steps = gsap.utils.toArray('.process-step');
            steps.forEach((step) => {
                const id = step.querySelector('.step-id');
                const content = step.querySelector('.step-content-reveal');
                const deliverables = step.querySelectorAll('.step-deliverable');
                // এন্ট্রি রিভিল অ্যানিমেশন (স্মুথ ব্লার এবং নিচ থেকে রিভিল)
                gsap.fromTo([id, content, ...deliverables], { opacity: 0, y: 35, filter: 'blur(6px)' }, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.9,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                });
                // অ্যাক্টিভ স্টেট টগল (স্ক্রিনের মাঝে আসলে উজ্জ্বল হবে, অন্যথায় আবছা হবে)
                ScrollTrigger.create({
                    trigger: step,
                    start: 'top 45%',
                    end: 'bottom 45%',
                    onToggle: (self) => {
                        if (self.isActive) {
                            step.classList.add('is-active');
                        }
                        else {
                            step.classList.remove('is-active');
                        }
                    },
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);
    return (_jsxs("section", { ref: containerRef, className: "relative py-24 md:py-40 bg-[#071426] overflow-hidden", children: [_jsxs("div", { className: "container mx-auto px-6 relative z-10", children: [_jsx(SectionHeading, { badge: language === 'en' ? 'OUR SYSTEMATIC PROCESS' : 'আমাদের কাজের পদ্ধতি', title: language === 'en' ? 'Ideas Into Impact' : 'ধারণা থেকে বাস্তব প্রবৃদ্ধি', subtitle: language === 'en'
                            ? 'A meticulous, enterprise-grade 10-step digital engineering pipeline tailored to craft robust digital innovations.'
                            : 'একটি সূক্ষ্ম, এন্টারপ্রাইজ-গ্রেডের ১০টি ধাপের ডিজিটাল ইঞ্জিনিয়ারিং পাইপলাইন যা শক্তিশালী ডিজিটাল উদ্ভাবন নিশ্চিত করে।', align: "left" }), _jsxs("div", { className: "relative mt-20 md:mt-32", ref: stepsRef, children: [_jsx("div", { className: "absolute left-6 md:left-12 top-0 w-[2px] h-full bg-white/5 overflow-hidden", children: _jsx("div", { ref: progressLineRef, className: "absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#168BFF] via-[#7457FF] to-[#168BFF] origin-top shadow-[0_0_15px_#168BFF]", style: { willChange: 'transform' } }) }), _jsx("div", { className: "flex flex-col gap-10 md:gap-14 w-full", children: processSteps.map((step) => (_jsxs("div", { className: "process-step group relative pl-16 md:pl-28 pr-6 py-8 md:py-10 rounded-2xl border border-white/[0.01] bg-white/[0.01] hover:bg-white/[0.025] hover:border-white/[0.06] transition-all duration-700 shadow-2xl overflow-hidden backdrop-blur-sm", children: [_jsxs("div", { className: "absolute left-6 md:left-12 -translate-x-1/2 top-11 md:top-14 w-4.5 h-4.5 rounded-full bg-[#071426] border-2 border-white/20 group-hover:border-[#168BFF] group-[.is-active]:border-[#168BFF] flex items-center justify-center transition-all duration-500 z-20", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-[#168BFF] group-[.is-active]:bg-[#168BFF] transition-all duration-500" }), _jsx("div", { className: "absolute inset-[-4px] rounded-full bg-[#168BFF]/20 animate-ping opacity-0 group-hover:opacity-100 group-[.is-active]:opacity-100 duration-1000 pointer-events-none" })] }), _jsx("div", { className: "step-id select-none text-7xl md:text-9xl font-black font-mono leading-none tracking-tighter opacity-[0.02] group-hover:opacity-[0.08] group-[.is-active]:opacity-[0.12] text-[#168BFF] absolute right-4 top-4 md:right-8 md:top-8 transition-all duration-700 pointer-events-none", style: { willChange: 'opacity' }, children: step.id }), _jsxs("div", { className: "step-content-reveal max-w-3xl", children: [_jsx("span", { className: "inline-block text-xs font-mono font-bold tracking-widest text-[#168BFF] uppercase mb-2 opacity-60 group-hover:opacity-100 group-[.is-active]:opacity-100 transition-opacity duration-500", children: language === 'en' ? `Phase ${step.id}` : `ধাপ ${step.id}` }), _jsx("h3", { className: "text-white/60 group-hover:text-white group-[.is-active]:text-white text-2xl md:text-4xl font-bold tracking-tight mb-3 transition-colors duration-500", children: language === 'en' ? step.title.en : step.title.bn }), _jsx("p", { className: "text-white/40 group-hover:text-white/70 group-[.is-active]:text-white/80 text-sm md:text-lg leading-relaxed font-light transition-colors duration-500", children: language === 'en' ? step.desc.en : step.desc.bn }), _jsxs("div", { className: "mt-6", children: [_jsx("p", { className: "text-xs font-mono text-white/20 uppercase tracking-widest mb-3", children: language === 'en' ? 'Core Deliverables' : 'প্রধান ডেলিভারেবলস' }), _jsx("div", { className: "flex flex-wrap gap-2.5", children: (language === 'en' ? step.deliverables.en : step.deliverables.bn).map((del, index) => (_jsxs("span", { className: "step-deliverable flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-mono font-medium tracking-wide bg-white/[0.02] border border-white/[0.04] text-white/40 group-hover:text-white/80 group-hover:border-white/10 group-[.is-active]:text-white group-[.is-active]:border-[#168BFF]/30 group-[.is-active]:bg-[#168BFF]/5 transition-all duration-500", children: [_jsx("span", { className: "w-1 h-1 rounded-full bg-[#168BFF] group-hover:bg-cyan-400 group-[.is-active]:bg-cyan-400 transition-all duration-500" }), del] }, index))) })] })] })] }, step.id))) })] })] }), _jsx("div", { className: "absolute top-1/2 right-0 w-[350px] h-[700px] bg-[#168BFF]/3 filter blur-[130px] rounded-l-full pointer-events-none -z-10" }), _jsx("div", { className: "absolute top-1/4 left-0 w-[250px] h-[500px] bg-[#7457FF]/2 filter blur-[100px] rounded-r-full pointer-events-none -z-10" })] }));
};
