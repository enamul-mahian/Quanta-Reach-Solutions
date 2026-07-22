import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - About Us Page (Premium Animated Edition)
// =========================================================================
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shield, Target, Zap, Globe2, Users, Trophy, ArrowRight, X } from 'lucide-react';
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
export const AboutPage = () => {
    const { t, language } = useLanguage();
    const [selectedMember, setSelectedMember] = useState(null);
    // অ্যানিমেশনের জন্য রিফ সেটআপ
    const pageContainerRef = useRef(null);
    const heroTitleRef = useRef(null);
    const storyImageRef = useRef(null);
    const storyTextRef = useRef(null);
    const statsContainerRef = useRef(null);
    const teamContainerRef = useRef(null);
    const valuesContainerRef = useRef(null);
    // টিম মেম্বারদের ডেটা
    const teamMembers = [
        {
            id: '01',
            name: { en: 'Arnab Sharkar', bn: 'অর্ণব সরকার' },
            role: { en: 'Lead Solutions Architect', bn: 'লিড সলিউশন আর্কিটেক্ট' },
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
            bio: { en: 'Expert in scalable architecture with 5+ years of experience.', bn: 'স্কেলেবল আর্কিটেকচারে ৫+ বছরের অভিজ্ঞতাসম্পন্ন এক্সপার্ট।' },
            skills: ['React', 'Node.js', 'Firebase']
        },
        {
            id: '02',
            name: { en: 'Sifatullah Khan', bn: 'সিফাতুল্লাহ খান' },
            role: { en: 'Senior Creative Designer', bn: 'সিনিয়র ক্রিয়েটিভ ডিজাইনার' },
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
            bio: { en: 'Passionate about creating immersive digital experiences.', bn: 'ইমার্সিভ ডিজিটাল অভিজ্ঞতা তৈরিতে উৎসাহী।' },
            skills: ['UI/UX', 'Three.js', 'Figma']
        },
        {
            id: '03',
            name: { en: 'Tanvir Ahmed', bn: 'তানভীর আহমেদ' },
            role: { en: 'Full Stack Developer', bn: 'ফুল স্ট্যাক ডেভেলপার' },
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600',
            bio: { en: 'Solving complex problems through clean and efficient code.', bn: 'ক্লিন এবং ইফিশিয়েন্ট কোডের মাধ্যমে জটিল সমস্যার সমাধান করেন।' },
            skills: ['Python', 'Cloud Architecture', 'React']
        }
    ];
    // About পেজের কন্টেন্ট (ইংরেজি এবং বাংলা)
    const content = {
        heroTitle: language === 'en' ? 'Driving Digital Transformation Globally' : 'বিশ্বজুড়ে ডিজিটাল রূপান্তরের নেতৃত্ব',
        heroSubtitle: language === 'en'
            ? 'Quanta Reach Solutions is a premium digital agency committed to delivering innovative, scalable, and secure technology solutions for businesses of all sizes.'
            : 'কোয়ান্টা রিচ সলিউশনস একটি প্রিমিয়াম ডিজিটাল এজেন্সি, যা যেকোনো আকারের ব্যবসার জন্য উদ্ভাবনী, স্কেলেবল এবং সুরক্ষিত প্রযুক্তি সমাধান প্রদানে প্রতিশ্রুতিবদ্ধ।',
        ourStoryTitle: language === 'en' ? 'Our Brand Means Trust' : 'আমাদের ব্র্যান্ড মানেই বিশ্বাস',
        ourStoryText1: language === 'en'
            ? 'Founded with a vision to bridge the gap between complex technology and business growth, Quanta Reach Solutions has grown into a trusted partner for both local enterprises in Bangladesh and global startups.'
            : 'জটিল প্রযুক্তি এবং ব্যবসায়িক প্রবৃদ্ধির মধ্যে সেতুবন্ধন তৈরির লক্ষ্য নিয়ে প্রতিষ্ঠিত কোয়ান্টা রিচ সলিউশনস আজ বাংলাদেশের স্থানীয় প্রতিষ্ঠান এবং গ্লোবাল স্টার্টআপদের একটি বিশ্বস্ত পার্টনার।',
        ourStoryText2: language === 'en'
            ? 'We don’t just build software; we build future-oriented digital ecosystems. From deep requirement analysis to flawless execution and long-term support, we ensure your investment yields exponential returns.'
            : 'আমরা শুধু সফটওয়্যারই তৈরি করি না; আমরা ভবিষ্যতের উপযোগী ডিজিটাল ইকোসিস্টেম তৈরি করি। প্রজেক্টের গভীর বিশ্লেষণ থেকে শুরু করে নিখুঁত বাস্তবায়ন এবং দীর্ঘমেয়াদী সাপোর্ট—আমরা নিশ্চিত করি আপনার বিনিয়োগ যেন সর্বোচ্চ ফলাফল নিয়ে আসে।'
    };
    const coreValues = [
        {
            id: 1,
            icon: _jsx(Shield, { className: "w-6 h-6 text-[#168BFF]" }),
            title: language === 'en' ? 'Trust & Transparency' : 'বিশ্বাস ও স্বচ্ছতা',
            desc: language === 'en'
                ? 'Clear communication, honest pricing, and strict adherence to NDAs.'
                : 'স্বচ্ছ যোগাযোগ, সাশ্রয়ী মূল্য এবং এনডিএ (NDA) এর কঠোর অনুসরণ।'
        },
        {
            id: 2,
            icon: _jsx(Target, { className: "w-6 h-6 text-[#9C5CFF]" }),
            title: language === 'en' ? 'Result-Oriented' : 'ফলাফলমুখী',
            desc: language === 'en'
                ? 'Every line of code and design choice is aimed at maximizing your ROI.'
                : 'আমাদের প্রতিটি কোড এবং ডিজাইন আপনার ব্যবসায়িক সাফল্য বৃদ্ধির লক্ষ্যে তৈরি।'
        },
        {
            id: 3,
            icon: _jsx(Zap, { className: "w-6 h-6 text-[#36A3FF]" }),
            title: language === 'en' ? 'Innovation First' : 'উদ্ভাবনে অগ্রাধিকার',
            desc: language === 'en'
                ? 'Leveraging the latest tech stack like React, Node, and AI to keep you ahead.'
                : 'আপনাকে এগিয়ে রাখতে রিঅ্যাক্ট, এআই (AI) এর মতো সর্বাধুনিক প্রযুক্তির ব্যবহার।'
        },
        {
            id: 4,
            icon: _jsx(Globe2, { className: "w-6 h-6 text-[#168BFF]" }),
            title: language === 'en' ? 'Global Standards' : 'বিশ্বমানের গুণগত মান',
            desc: language === 'en'
                ? 'Maintaining international quality assurance and seamless cross-border collaboration.'
                : 'আন্তর্জাতিক মান নিয়ন্ত্রণ এবং বিদেশি ক্লায়েন্টদের সাথে নিরবচ্ছিন্ন যোগাযোগ।'
        }
    ];
    const stats = [
        { icon: _jsx(Trophy, { className: "w-6 h-6" }), targetValue: 5, suffix: '+', label: language === 'en' ? 'Years Experience' : 'বছরের অভিজ্ঞতা' },
        { icon: _jsx(Users, { className: "w-6 h-6" }), targetValue: 50, suffix: '+', label: language === 'en' ? 'Expert Team' : 'দক্ষ কর্মী' },
        { icon: _jsx(Zap, { className: "w-6 h-6" }), targetValue: 200, suffix: '+', label: language === 'en' ? 'Projects Delivered' : 'প্রজেক্ট ডেলিভারি' },
        { icon: _jsx(Globe2, { className: "w-6 h-6" }), targetValue: 15, suffix: '+', label: language === 'en' ? 'Countries Served' : 'দেশে সেবা প্রদান' },
    ];
    // GSAP অ্যানিমেশন ইন্টিগ্রেশন
    useEffect(() => {
        const ctx = gsap.context(() => {
            // holds isReducedMotion check removed to guarantee animations run!
            // ১. হিরো টাইটেল মাস্ক রিভিল (টাইপসেফ কাস্টিং)
            const heroTitle = heroTitleRef.current;
            if (heroTitle) {
                const headlineText = heroTitle.querySelector('h2');
                if (headlineText) {
                    const splitData = splitTextBilingual(headlineText.innerText, language === 'en' ? 'chars' : 'words', language);
                    headlineText.innerHTML = splitData.items
                        .map(item => `<span class="inline-block overflow-hidden py-1"><span class="hero-reveal inline-block">${item === ' ' ? '&nbsp;' : item}</span></span>`)
                        .join(language === 'en' ? '' : ' ');
                    const revealItems = headlineText.querySelectorAll('.hero-reveal');
                    const heroTl = gsap.timeline();
                    heroTl.fromTo(revealItems, { yPercent: 100, rotateX: 45, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.02, ease: 'power4.out' });
                }
            }
            // ২. আওয়ার স্টোরি ইমেজ ও টেক্সট রিভিল
            if (storyImageRef.current && storyTextRef.current) {
                gsap.fromTo(storyImageRef.current, { opacity: 0, scale: 0.9, x: -50 }, {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: storyImageRef.current,
                        start: 'top 80%',
                    }
                });
                gsap.fromTo(storyTextRef.current.children, { opacity: 0, y: 30 }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: storyTextRef.current,
                        start: 'top 80%',
                    }
                });
            }
            // ৩. টিম কার্ডস স্ট্যাগারড এন্ট্রি
            const teamCards = teamContainerRef.current?.querySelectorAll('.team-card');
            if (teamCards) {
                gsap.fromTo(teamCards, { opacity: 0, y: 50 }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: teamContainerRef.current,
                        start: 'top 80%',
                    }
                });
            }
            // ৪. সংখ্যাবাচক পরিসংখ্যান অ্যানিমেশন (Interactive Digital Count-up)
            const statNumbers = statsContainerRef.current?.querySelectorAll('.stat-number');
            if (statNumbers) {
                statNumbers.forEach((el) => {
                    const htmlEl = el; // টাইপসেফ কাস্টিং
                    const target = parseInt(htmlEl.getAttribute('data-target') || '0', 10);
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: htmlEl,
                            start: 'top 85%',
                        },
                        onUpdate: () => {
                            htmlEl.innerText = Math.floor(obj.val).toString();
                        }
                    });
                });
            }
            // ৫. কোর ভ্যালুজ কার্ড এন্ট্রি
            const valueCards = valuesContainerRef.current?.querySelectorAll('.value-card');
            if (valueCards) {
                gsap.fromTo(valueCards, { opacity: 0, scale: 0.95, y: 40 }, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: valuesContainerRef.current,
                        start: 'top 80%',
                    }
                });
            }
        }, pageContainerRef);
        return () => ctx.revert();
    }, [language]);
    return (_jsxs("div", { ref: pageContainerRef, className: "w-full flex flex-col bg-[#071426]", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [t.navigation.about, " | Quanta Reach Solutions"] }), _jsx("meta", { name: "description", content: content.heroSubtitle })] }), _jsxs("section", { className: "relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/5", children: [_jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-[#168BFF]/10 rounded-full blur-[120px] pointer-events-none" }), _jsx(Container, { className: "relative z-10 text-center max-w-4xl", children: _jsx("div", { ref: heroTitleRef, children: _jsx(SectionHeading, { badge: t.navigation.about, title: content.heroTitle, subtitle: content.heroSubtitle, className: "mx-auto" }) }) })] }), _jsx("section", { className: "py-20 lg:py-28 relative", children: _jsx(Container, { children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center", children: [_jsxs("div", { ref: storyImageRef, className: "order-2 lg:order-1 relative", children: [_jsx("div", { className: "absolute -inset-4 bg-gradient-to-r from-[#168BFF] to-[#9C5CFF] opacity-20 blur-xl rounded-3xl" }), _jsx("img", { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop", alt: "Quanta Reach Team", className: "relative z-10 w-full rounded-2xl border border-white/10 shadow-2xl object-cover h-[400px]" }), _jsxs("div", { className: "absolute -bottom-6 -right-6 bg-[#0D1D33]/90 backdrop-blur-md p-6 rounded-2xl border border-[#168BFF]/30 z-20 hidden md:block", children: [_jsx("div", { className: "text-4xl font-extrabold text-white mb-1", children: "100%" }), _jsx("div", { className: "text-white/60 text-sm", children: language === 'en' ? 'Client Satisfaction' : 'ক্লায়েন্ট সন্তুষ্টি' })] })] }), _jsxs("div", { ref: storyTextRef, className: "order-1 lg:order-2", children: [_jsx("h2", { className: "text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight", children: content.ourStoryTitle }), _jsxs("div", { className: "space-y-6", children: [_jsx("p", { className: `text-white/60 text-lg leading-relaxed ${language === 'bn' ? 'leading-loose' : ''}`, children: content.ourStoryText1 }), _jsx("p", { className: `text-white/60 text-lg leading-relaxed ${language === 'bn' ? 'leading-loose' : ''}`, children: content.ourStoryText2 })] }), _jsxs("div", { className: "mt-10 flex flex-wrap gap-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-white/80", children: [_jsx(Shield, { className: "w-5 h-5 text-[#168BFF]" }), _jsx("span", { className: "font-medium text-sm uppercase tracking-wider", children: language === 'en' ? 'Secure Development' : 'সুরক্ষিত ডেভেলপমেন্ট' })] }), _jsxs("div", { className: "flex items-center gap-2 text-white/80", children: [_jsx(Zap, { className: "w-5 h-5 text-[#9C5CFF]" }), _jsx("span", { className: "font-medium text-sm uppercase tracking-wider", children: language === 'en' ? 'Fast Delivery' : 'দ্রুত ডেলিভারি' })] })] })] })] }) }) }), _jsx("section", { className: "py-20 lg:py-28 relative bg-[#0D1D33]/30", children: _jsxs(Container, { children: [_jsx(SectionHeading, { title: language === 'en' ? 'Our Expert Team' : 'আমাদের বিশেষজ্ঞ টিম' }), _jsx("div", { ref: teamContainerRef, className: "grid grid-cols-1 md:grid-cols-3 gap-8 mt-12", children: teamMembers.map((member) => (_jsxs("div", { onClick: () => setSelectedMember(member), className: "team-card bg-[#071426] p-6 rounded-2xl border border-white/10 cursor-pointer hover:border-[#168BFF] transition-all duration-300 group", children: [_jsx("img", { src: member.image, alt: member.name.en, className: "w-full h-64 object-cover rounded-xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500" }), _jsx("h3", { className: "text-xl font-bold text-white", children: language === 'en' ? member.name.en : member.name.bn }), _jsx("p", { className: "text-[#168BFF]", children: language === 'en' ? member.role.en : member.role.bn })] }, member.id))) })] }) }), selectedMember && (_jsx("div", { className: "fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm", onClick: () => setSelectedMember(null), children: _jsxs("div", { className: "bg-[#071426] p-10 rounded-3xl border border-white/10 max-w-lg w-full relative", onClick: e => e.stopPropagation(), children: [_jsx("button", { onClick: () => setSelectedMember(null), className: "absolute top-4 right-4 text-white hover:text-[#168BFF]", children: _jsx(X, {}) }), _jsx("img", { src: selectedMember.image, alt: "Profile", className: "w-32 h-32 rounded-full mb-6 mx-auto object-cover border-2 border-[#168BFF]" }), _jsx("h2", { className: "text-2xl font-bold text-white text-center", children: language === 'en' ? selectedMember.name.en : selectedMember.name.bn }), _jsx("p", { className: "text-[#168BFF] text-center mb-6", children: language === 'en' ? selectedMember.role.en : selectedMember.role.bn }), _jsx("p", { className: "text-white/60 text-center mb-8", children: language === 'en' ? selectedMember.bio.en : selectedMember.bio.bn }), _jsx("div", { className: "flex justify-center gap-2", children: selectedMember.skills.map((s) => _jsx("span", { className: "bg-[#168BFF]/10 text-[#168BFF] px-4 py-1 rounded-full text-xs", children: s }, s)) })] }) })), _jsx("section", { className: "py-20 bg-[#0D1D33] border-y border-white/5 relative overflow-hidden", children: _jsx(Container, { className: "relative z-10", children: _jsx("div", { ref: statsContainerRef, className: "grid grid-cols-2 md:grid-cols-4 gap-12", children: stats.map((stat, idx) => (_jsxs("div", { className: "flex flex-col items-center text-center group", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-[#168BFF]/10 flex items-center justify-center text-[#168BFF] mb-6 group-hover:scale-110 transition-transform duration-300", children: stat.icon }), _jsxs("div", { className: "text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter flex items-center", children: [_jsx("span", { className: "stat-number", "data-target": stat.targetValue, children: "0" }), _jsx("span", { children: stat.suffix })] }), _jsx("div", { className: "text-white/40 font-bold text-xs uppercase tracking-[0.2em]", children: stat.label })] }, idx))) }) }) }), _jsx("section", { className: "py-24 lg:py-32 relative", children: _jsxs(Container, { children: [_jsx(SectionHeading, { title: language === 'en' ? 'Our Core Values' : 'আমাদের মূল আদর্শ', subtitle: language === 'en'
                                ? 'The foundational principles that guide our work and our relationship with you.'
                                : 'যে নীতিগুলোর ওপর ভিত্তি করে আমাদের কাজের পরিবেশ এবং ক্লায়েন্টদের সাথে আমাদের সম্পর্ক গড়ে ওঠে।' }), _jsx("div", { ref: valuesContainerRef, className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto", children: coreValues.map((value) => (_jsxs("div", { className: "value-card bg-[#0D1D33]/50 backdrop-blur-sm p-10 rounded-3xl flex flex-col items-start gap-6 border border-white/5 hover:border-[#168BFF]/30 transition-all duration-500 group", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-[#071426] border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#168BFF] group-hover:text-white transition-all duration-500", children: value.icon }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: value.title }), _jsx("p", { className: `text-white/50 leading-relaxed text-lg ${language === 'bn' ? 'leading-loose' : ''}`, children: value.desc })] })] }, value.id))) })] }) }), _jsxs("section", { className: "py-24 bg-[#168BFF] relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" }), _jsxs(Container, { className: "relative z-10 text-center", children: [_jsx("h2", { className: "text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase", children: language === 'en' ? 'Ready to Transform?' : 'পরিবর্তনের জন্য প্রস্তুত?' }), _jsx("p", { className: "text-white/90 text-xl mb-12 max-w-2xl mx-auto font-medium", children: language === 'en'
                                    ? 'Join hands with Quanta Reach Solutions and let’s build a digital solution that drives real growth.'
                                    : 'কোয়ান্টা রিচ সলিউশনসের সাথে যুক্ত হোন এবং তৈরি করুন এমন একটি ডিজিটাল সলিউশন যা সত্যিকারের প্রবৃদ্ধি আনে।' }), _jsx("div", { className: "flex justify-center", children: _jsx(Link, { to: "/contact", children: _jsx(Button, { size: "lg", className: "bg-white !text-[#168BFF] font-black uppercase tracking-widest px-12 py-6 rounded-full hover:bg-gray-100 shadow-2xl transition-all hover:scale-105 active:scale-95", rightIcon: _jsx(ArrowRight, { className: "w-6 h-6 !text-[#168BFF]" }), children: language === 'en' ? 'Contact Us Now' : 'যোগাযোগ করুন' }) }) })] })] })] }));
};
