import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { useAuth } from '/src/contexts/AuthContext.js';
import { useMagnetic } from '/src/lib/motion.js';
import { Menu, X, Globe, VolumeX, User, LayoutDashboard } from 'lucide-react';
import { SITE } from '/src/config/site.js';
/**
 * QUANTA REACH SOLUTIONS - PREMIUM DYNAMIC HEADER (WITH SOUND WAVE CONTROLLER & AUTH SYNC)
 * এটি ল্যাঙ্গুয়েজ, ব্যাকগ্রাউন্ড সাউন্ড এবং ইউজার লগইন পোর্টাল ডাইনামিকালি নিয়ন্ত্রণ করে
 */
export const Header = () => {
    const { language, setLanguage } = useLanguage();
    const { pathname } = useLocation();
    const { currentUser, role } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // ব্যাকগ্রাউন্ড অডিও কন্ট্রোল স্টেট ও রেফারেন্স
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioRef = useRef(null);
    // ম্যাগনেটিক সিটিএ বাটন হুক
    const quoteBtnRef = useMagnetic(0.3, 0.1);
    // ডাইনামিক ড্যাশবোর্ড বা লগইন পাথ ডিটেক্টর
    const portalPath = currentUser
        ? (role === 'client'
            ? '/client/dashboard'
            : (role === 'super-admin' || role === 'admin' || role === 'editor')
                ? '/admin/dashboard'
                : '/')
        : '/login';
    // ১. অডিও অবজেক্ট ইনিশিয়েট করা (মৃদু পিয়ানো ও সিন্থ অ্যাম্বিয়েন্ট টিউন)
    useEffect(() => {
        const audio = new Audio('/assets/qrs-ambient.mp3');
        audio.preload = 'none';
        audio.loop = true;
        audio.volume = 0.20; // ব্যাকগ্রাউন্ডে মৃদু আওয়াজ রাখার জন্য ২০% ভলিউম
        audioRef.current = audio;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);
    // ২. স্ক্রল ইভেন্ট লিসেনার
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    // রাউট পরিবর্তন হলে মোবাইল মেনু বন্ধ করা
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);
    const navLinks = [
        { name: { en: 'About', bn: 'আমাদের সম্পর্কে' }, path: '/about' },
        { name: { en: 'Services', bn: 'সেবাসমূহ' }, path: '/services' },
        { name: { en: 'Portfolio', bn: 'পোর্টফোলিও' }, path: '/portfolio' },
        { name: { en: 'Pricing', bn: 'প্রাইসিং' }, path: '/pricing' },
        { name: { en: 'Blog', bn: 'ব্লগ' }, path: '/blog' },
    ];
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'bn' : 'en');
    };
    // ৩. প্লে/পজ সাউন্ড টগল হ্যান্ডলার
    const toggleSound = () => {
        if (!audioRef.current)
            return;
        if (isAudioPlaying) {
            audioRef.current.pause();
            setIsAudioPlaying(false);
        }
        else {
            audioRef.current.play().then(() => {
                setIsAudioPlaying(true);
            }).catch((err) => {
                console.warn('Audio play was prevented by the browser.', err);
            });
        }
    };
    return (_jsxs("header", { className: `fixed left-0 w-full z-[1000] transition-all duration-500 ${isScrolled
            ? 'top-0 bg-[#071426]/80 backdrop-blur-xl py-3 border-b border-white/5 shadow-2xl'
            : 'top-0 lg:top-10 bg-transparent py-4 md:py-5 lg:py-6'}`, children: [_jsxs("div", { className: "container mx-auto px-6 flex items-center justify-between", children: [_jsxs(Link, { to: "/", className: "group relative z-10 flex items-center gap-3", "aria-label": `${SITE.name} home`, children: [_jsx("img", { src: SITE.mark, alt: "", className: "h-10 w-10 object-contain drop-shadow-[0_0_18px_rgba(22,139,255,0.25)] md:h-12 md:w-12" }), _jsxs("div", { className: "hidden flex-col sm:flex", children: [_jsx("span", { className: "text-lg font-black uppercase leading-none tracking-tighter text-white transition-colors group-hover:text-[#168BFF] md:text-xl", children: "QUANTA REACH" }), _jsx("span", { className: "mt-1 text-[8px] font-mono uppercase leading-none tracking-[0.3em] text-[#168BFF]", children: "Solutions" })] })] }), _jsx("nav", { className: "hidden lg:flex items-center gap-8 xl:gap-12", children: navLinks.map((link) => (_jsxs(NavLink, { to: link.path, className: ({ isActive }) => `
                relative text-[13px] font-bold uppercase tracking-widest transition-all hover:text-white
                ${isActive ? 'text-white' : 'text-white/50'}
                group
              `, children: [language === 'en' ? link.name.en : link.name.bn, _jsx("span", { className: `absolute -bottom-2 left-0 h-[2px] bg-[#168BFF] transition-all duration-500 origin-left 
                ${pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}
              ` })] }, link.path))) }), _jsxs("div", { className: "flex items-center gap-3 md:gap-5", children: [_jsxs("button", { onClick: toggleLanguage, className: "flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-[#168BFF]/50 transition-all text-[10px] font-bold uppercase tracking-[0.15em] bg-white/5", children: [_jsx(Globe, { className: "w-3.5 h-3.5 text-[#168BFF]" }), _jsx("span", { children: language === 'en' ? 'বাংলা' : 'EN' })] }), _jsx("button", { onClick: toggleSound, className: "flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-[#168BFF]/50 transition-all bg-white/5", "aria-label": "Toggle Background Music", children: isAudioPlaying ? (
                                // যখন বাজবে: ৩-লাইন ড্যান্সিং এনিমেশন
                                _jsxs("div", { className: "flex items-end gap-[3px] h-3.5", children: [_jsx("span", { className: "w-[2px] bg-[#168BFF] h-full animate-[sound-wave_1s_infinite_ease-in-out]" }), _jsx("span", { className: "w-[2px] bg-[#168BFF] h-2/3 animate-[sound-wave_0.8s_infinite_ease-in-out]", style: { animationDelay: '0.15s' } }), _jsx("span", { className: "w-[2px] bg-[#168BFF] h-1/2 animate-[sound-wave_1.2s_infinite_ease-in-out]", style: { animationDelay: '0.3s' } })] })) : (
                                // মিউট আইকন
                                _jsx(VolumeX, { className: "w-4 h-4 text-white/40" })) }), _jsxs(Link, { to: portalPath, className: "hidden md:flex items-center gap-2.5 px-4 py-2 bg-white/[0.03] border border-white/10 hover:border-[#168BFF]/40 rounded-full transition-all duration-300 group hover:bg-[#168BFF]/5 hover:shadow-[0_0_20px_rgba(22,139,255,0.15)]", children: [_jsxs("span", { className: "relative flex h-2 w-2", children: [_jsx("span", { className: `animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentUser ? 'bg-emerald-400' : 'bg-[#168BFF]'}` }), _jsx("span", { className: `relative inline-flex rounded-full h-2 w-2 ${currentUser ? 'bg-emerald-500' : 'bg-[#168BFF]'}` })] }), _jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 group-hover:text-white transition-colors mt-0.5", children: language === 'en'
                                            ? (currentUser ? 'Dashboard' : 'Sign In')
                                            : (currentUser ? 'ড্যাশবোর্ড' : 'লগইন') }), currentUser ? (_jsx(LayoutDashboard, { className: "w-3.5 h-3.5 text-[#168BFF]/70 group-hover:text-[#168BFF] transition-colors" })) : (_jsx(User, { className: "w-3.5 h-3.5 text-[#168BFF]/70 group-hover:text-[#168BFF] transition-colors" }))] }), _jsx(Link, { to: "/request-quote", ref: quoteBtnRef, className: "hidden md:flex items-center justify-center px-7 py-3 bg-[#168BFF] text-[#071426] text-[11px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95 hover:shadow-[0_10px_30px_rgba(22,139,255,0.4)]", children: language === 'en' ? 'Request Quote' : 'কোটেশন' }), _jsx("button", { type: "button", className: "rounded-full p-2 text-white transition-colors hover:bg-white/10 lg:hidden", onClick: () => setIsMobileMenuOpen((open) => !open), "aria-label": isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu', "aria-expanded": isMobileMenuOpen, "aria-controls": "mobile-navigation", children: isMobileMenuOpen ? _jsx(X, { className: "w-6 h-6 text-[#168BFF]" }) : _jsx(Menu, { className: "w-6 h-6" }) })] })] }), _jsxs("div", { id: "mobile-navigation", "aria-hidden": !isMobileMenuOpen, className: `fixed inset-0 left-0 top-0 z-[-1] flex h-screen w-full flex-col items-center justify-center gap-8 bg-[#071426] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`, children: [_jsxs("div", { className: "flex flex-col items-center gap-7 text-center px-6 w-full", children: [navLinks.map((link, i) => (_jsx(Link, { to: link.path, className: `text-3xl md:text-5xl font-black tracking-tighter text-white transition-all duration-500 uppercase ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`, style: { transitionDelay: `${i * 70}ms` }, children: language === 'en' ? link.name.en : link.name.bn }, link.path))), _jsxs(Link, { to: portalPath, className: `mt-4 flex items-center justify-center gap-3 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-full w-48 transition-all duration-500 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`, style: { transitionDelay: `${navLinks.length * 70}ms` }, children: [_jsxs("span", { className: "relative flex h-2 w-2", children: [_jsx("span", { className: `animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentUser ? 'bg-emerald-400' : 'bg-[#168BFF]'}` }), _jsx("span", { className: `relative inline-flex rounded-full h-2 w-2 ${currentUser ? 'bg-emerald-500' : 'bg-[#168BFF]'}` })] }), _jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white/70", children: language === 'en'
                                            ? (currentUser ? 'Dashboard' : 'Sign In')
                                            : (currentUser ? 'ড্যাশবোর্ড' : 'লগইন') })] }), _jsx(Link, { to: "/request-quote", className: "mt-4 px-10 py-4 bg-[#168BFF] text-[#071426] font-black rounded-full text-xs uppercase tracking-widest w-48", children: language === 'en' ? 'Start Project' : 'প্রজেক্ট শুরু করুন' })] }), _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#168BFF]/10 filter blur-[100px] rounded-full -z-10 animate-pulse" })] })] }));
};
