import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { isReducedMotion } from '/src/lib/motion.js';
export const PageTransition = () => {
    const location = useLocation();
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const primaryCurtainRef = useRef(null);
    const secondaryCurtainRef = useRef(null);
    const brandingRef = useRef(null);
    const isFirstRender = useRef(true);
    useEffect(() => {
        // প্রথম লোডের সময় ট্রানজিশন স্কিপ করা হবে (প্রিলোডার হ্যান্ডেল করবে)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const container = containerRef.current;
        const primary = primaryCurtainRef.current;
        const secondary = secondaryCurtainRef.current;
        const branding = brandingRef.current;
        if (!container || !primary || !secondary || !branding)
            return;
        // ক্লিনিং: আগের কোনো অ্যানিমেশন চললে তা বন্ধ করা
        gsap.killTweensOf([primary, secondary, branding]);
        // ওএস লেভেলে মোশন বন্ধ থাকলে সিম্পল ফেড ইফেক্ট
        if (isReducedMotion()) {
            const fadeTl = gsap.timeline({
                onStart: () => { container.style.pointerEvents = 'auto'; },
                onComplete: () => { container.style.pointerEvents = 'none'; }
            });
            fadeTl.set([primary, secondary], { yPercent: 0, opacity: 0 })
                .to(primary, { opacity: 1, duration: 0.3 })
                .add(() => window.scrollTo(0, 0))
                .to(primary, { opacity: 0, duration: 0.3 });
            return () => {
                fadeTl.kill();
                container.style.pointerEvents = 'none';
                gsap.set([primary, secondary], { opacity: 0, yPercent: 100 });
            };
        }
        // প্রিমিয়াম ডাবল-প্যানেল কার্টেইন অ্যানিমেশন
        const tl = gsap.timeline({
            onStart: () => {
                container.style.pointerEvents = 'auto';
            },
            onComplete: () => {
                container.style.pointerEvents = 'none';
                // ট্রানজিশন শেষে পজিশন রিসেট করা যাতে পরের বার আবার নিচ থেকে উঠতে পারে
                gsap.set([primary, secondary], { yPercent: 100 });
            }
        });
        tl.set([primary, secondary], { yPercent: 100 }) // নিশ্চিত করা যে এগুলো নিচে আছে
            .set(branding, { opacity: 0, y: 40 })
            // কার্টেইনগুলো নিচ থেকে উপরে আসা
            .to(secondary, {
            yPercent: 0,
            duration: 0.5,
            ease: 'power4.inOut'
        })
            .to(primary, {
            yPercent: 0,
            duration: 0.6,
            ease: 'power4.inOut'
        }, '-=0.4')
            // ব্র্যান্ডিং রিভিল
            .to(branding, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out'
        }, '-=0.2')
            // স্ক্রল রিসেট
            .add(() => window.scrollTo(0, 0))
            // ওয়েট টাইম
            .to({}, { duration: 0.2 })
            // ব্র্যান্ডিং হাইড
            .to(branding, {
            opacity: 0,
            y: -40,
            duration: 0.3,
            ease: 'power3.in'
        })
            // কার্টেইনগুলো উপরে দিয়ে বেরিয়ে যাওয়া
            .to(primary, {
            yPercent: -100,
            duration: 0.6,
            ease: 'power4.inOut'
        })
            .to(secondary, {
            yPercent: -100,
            duration: 0.5,
            ease: 'power4.inOut'
        }, '-=0.45');
        return () => {
            tl.kill();
            container.style.pointerEvents = 'none';
            gsap.set([primary, secondary], { yPercent: 100 });
            gsap.set(branding, { opacity: 0, y: 40 });
        };
    }, [location.pathname]);
    return (_jsxs("div", { ref: containerRef, className: "fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden", children: [_jsx("div", { ref: secondaryCurtainRef, className: "absolute inset-0 w-full h-full bg-[#168BFF] translate-y-full", style: { willChange: 'transform' } }), _jsx("div", { ref: primaryCurtainRef, className: "absolute inset-0 w-full h-full bg-[#071426] translate-y-full flex items-center justify-center", style: { willChange: 'transform' }, children: _jsxs("div", { ref: brandingRef, className: "text-center px-6", children: [_jsx("span", { className: "block text-[#168BFF] font-mono tracking-[0.25em] text-xs uppercase mb-3", children: language === 'en' ? 'QUANTA REACH SOLUTIONS' : 'কোয়ান্টা রিচ সলিউশনস' }), _jsx("h2", { className: "text-white text-3xl md:text-5xl font-bold tracking-tight leading-none", children: language === 'en' ? (_jsxs(_Fragment, { children: ["Solutions for ", _jsx("span", { className: "text-[#9C5CFF]", children: "Global Growth" })] })) : (_jsxs(_Fragment, { children: ["\u09AC\u09C8\u09B6\u09CD\u09AC\u09BF\u0995 \u09AA\u09CD\u09B0\u09AC\u09C3\u09A6\u09CD\u09A7\u09BF\u09B0 \u099C\u09A8\u09CD\u09AF ", _jsx("span", { className: "text-[#9C5CFF]", children: "\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8" })] })) })] }) })] }));
};
