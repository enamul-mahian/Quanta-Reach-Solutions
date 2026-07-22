import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { SITE } from '/src/config/site.js';
import { isReducedMotion } from '/src/lib/motion.js';
export const Preloader = () => {
    const { language } = useLanguage();
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef(null);
    const topHalfRef = useRef(null);
    const bottomHalfRef = useRef(null);
    const counterRef = useRef(null);
    const progressBarRef = useRef(null);
    const logoRef = useRef(null);
    const glowRef = useRef(null);
    const abstractLayerRef = useRef(null);
    useEffect(() => {
        const readPreloaderFlag = () => {
            try {
                return sessionStorage.getItem('quantareach_preloader_run') === 'true';
            }
            catch {
                return false;
            }
        };
        const savePreloaderFlag = () => {
            try {
                sessionStorage.setItem('quantareach_preloader_run', 'true');
            }
            catch {
                // Storage can be blocked in strict privacy modes; the preloader still closes safely.
            }
        };
        // Run once per browser tab and skip long motion when accessibility settings request it.
        if (readPreloaderFlag() || isReducedMotion()) {
            savePreloaderFlag();
            setIsVisible(false);
            return undefined;
        }
        const container = containerRef.current;
        const topHalf = topHalfRef.current;
        const bottomHalf = bottomHalfRef.current;
        const counter = counterRef.current;
        const bar = progressBarRef.current;
        const logo = logoRef.current;
        const glow = glowRef.current;
        const abstract = abstractLayerRef.current;
        if (!container || !topHalf || !bottomHalf || !counter || !bar || !logo || !glow || !abstract)
            return;
        // প্রিলোড চলাকালীন বডি স্ক্রল অফ করা হলো
        document.body.style.overflow = 'hidden';
        const counterObj = { value: 0 };
        const timeline = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = '';
                setIsVisible(false);
                // সেশনে একবার চালানোর জন্য ফ্ল্যাগ সেভ করা হলো
                savePreloaderFlag();
            }
        });
        // প্রাথমিক অবস্থান নির্ধারণ করা হচ্ছে
        timeline
            .set([topHalf, bottomHalf], { yPercent: 0 })
            .set(logo, { opacity: 0, y: 30 })
            .set(bar, { scaleX: 0 })
            .set(counter, { opacity: 0, scale: 0.9 })
            .set(glow, { scale: 0.6, opacity: 0 })
            .set(abstract, { opacity: 0 });
        // ১. ব্যাকগ্রাউন্ড গ্লো এবং ক্রিয়েটিভ আর্ট রিভিল করা
        timeline
            .to(glow, { opacity: 0.25, scale: 1.2, duration: 1.4, ease: 'power2.out' })
            .to(abstract, { opacity: 0.15, duration: 1.2, ease: 'power2.out' }, '-=1.0')
            .to(logo, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8')
            .to(counter, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6');
        // ২. ৩-ডিজিট কাউন্টার অ্যানিমেশন ও প্রগ্রেস লাইনের সিঙ্ক্রোনাইজড মোশন
        timeline
            .to(counterObj, {
            value: 100,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => {
                setCount(Math.floor(counterObj.value));
            }
        })
            .to(bar, {
            scaleX: 1,
            duration: 2.2,
            ease: 'power2.out'
        }, '<');
        // ৩. আউট-ট্রানজিশন: মাঝের ডেটা ফেড-আউট করে কার্টেইন দুই ভাগে ভাগ হওয়া (Cinematic Split Reveal)
        timeline
            .to([counter, logo, bar, glow, abstract], {
            opacity: 0,
            y: -30,
            duration: 0.5,
            ease: 'power3.in'
        })
            .to(topHalf, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power4.inOut'
        }, '-=0.2')
            .to(bottomHalf, {
            yPercent: 100,
            duration: 0.85,
            ease: 'power4.inOut'
        }, '<');
        // ৪. সিকিউরিটি সেফটি টাইমআউট (স্লো নেটওয়ার্ক বা যেকোনো ক্র্যাশে ইউজারকে আটকে যাওয়া থেকে বাঁচায়)
        const safetyTimeout = setTimeout(() => {
            document.body.style.overflow = '';
            setIsVisible(false);
            savePreloaderFlag();
        }, 5000);
        return () => {
            clearTimeout(safetyTimeout);
            timeline.kill();
            document.body.style.overflow = '';
        };
    }, []);
    if (!isVisible)
        return null;
    // ৩ ডিজিট প্যাডিং ফরম্যাটিং (000, 005, 042, 100)
    const formatNum = (num) => {
        return num.toString().padStart(3, '0');
    };
    return (_jsxs("div", { ref: containerRef, className: "fixed inset-0 z-[10000] overflow-hidden select-none pointer-events-auto", children: [_jsx("div", { ref: topHalfRef, className: "absolute top-0 left-0 w-full h-[50vh] bg-[#071426] border-b border-[#0D1D33]", style: { willChange: 'transform' } }), _jsx("div", { ref: bottomHalfRef, className: "absolute bottom-0 left-0 w-full h-[50vh] bg-[#071426] border-t border-[#0D1D33]", style: { willChange: 'transform' } }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-between py-16 px-6 z-10 pointer-events-none", children: [_jsxs("div", { ref: logoRef, className: "mt-6 flex flex-col items-center text-center", children: [_jsx("img", { src: SITE.mark, alt: "", "aria-hidden": "true", className: "mb-3 h-16 w-16 object-contain md:h-20 md:w-20" }), _jsx("span", { className: "block text-[#168BFF] font-mono tracking-[0.3em] text-xs uppercase mb-1", children: language === 'en' ? 'QUANTA REACH SOLUTIONS' : 'কোয়ান্টা রিচ সলিউশনস' }), _jsx("span", { className: "text-white/40 text-[10px] tracking-wider uppercase", children: language === 'en' ? 'Creative Agency Integration' : 'ক্রিয়েটিভ এজেন্সি ইন্টিগ্রেশন' })] }), _jsxs("div", { className: "relative flex flex-col items-center justify-center w-full max-w-lg", children: [_jsx("div", { ref: glowRef, className: "absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-tr from-[#168BFF]/20 to-[#7457FF]/20 filter blur-[80px] -z-10" }), _jsx("div", { ref: abstractLayerRef, className: "absolute inset-0 flex items-center justify-center -z-10 w-full h-full", children: _jsxs("svg", { className: "w-64 h-64 md:w-96 md:h-96 text-white/[0.02]", viewBox: "0 0 200 200", fill: "none", children: [_jsx("circle", { cx: "100", cy: "100", r: "80", stroke: "currentColor", strokeWidth: "0.5", strokeDasharray: "5 5" }), _jsx("circle", { cx: "100", cy: "100", r: "60", stroke: "currentColor", strokeWidth: "0.25" }), _jsx("path", { d: "M100 0 V200 M0 100 H200", stroke: "currentColor", strokeWidth: "0.25" })] }) }), _jsx("div", { ref: counterRef, className: "text-white font-mono text-8xl md:text-[11rem] font-extralight tracking-tighter leading-none", children: formatNum(count) }), _jsx("div", { className: "w-full bg-white/[0.05] h-[2px] mt-6 relative overflow-hidden", children: _jsx("div", { ref: progressBarRef, className: "absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-[#168BFF] to-[#7457FF] origin-left", style: { willChange: 'transform' } }) })] }), _jsx("div", { className: "text-center mb-6", children: _jsx("p", { className: "text-white/30 font-mono text-[10px] uppercase tracking-[0.2em]", children: language === 'en' ? 'OUR BRAND MEANS TRUST' : 'আমাদের ব্র্যান্ড মানেই আস্থা' }) })] })] }));
};
