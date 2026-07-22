import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { splitTextBilingual, isReducedMotion } from '/src/lib/motion.js';
import { SITE } from '/src/config/site.js';
export const PerspectiveVideoSection = () => {
    const { language } = useLanguage();
    const [videoFailed, setVideoFailed] = useState(false);
    const containerRef = useRef(null);
    const videoWrapperRef = useRef(null);
    const videoRef = useRef(null);
    const headlineRef = useRef(null);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            const videoWrapper = videoWrapperRef.current;
            const headline = headlineRef.current;
            const video = videoRef.current;
            if (!videoWrapper || !headline)
                return;
            if (isReducedMotion()) {
                gsap.set(videoWrapper, { rotateX: 0, scale: 1, z: 0 });
                return;
            }
            // Cinematic 3D video transform with scroll scrubbing.
            gsap.fromTo(videoWrapper, {
                perspective: 1000,
                rotateX: 15,
                scale: 1.1,
                z: 0,
            }, {
                rotateX: 0,
                scale: 0.9,
                z: -100,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
            // Bilingual text reveal.
            const textData = splitTextBilingual(headline.innerText, language === 'en' ? 'chars' : 'words', language);
            headline.innerHTML = textData.items
                .map((item) => `<span class="inline-block overflow-hidden py-2"><span class="reveal-line inline-block">${item === ' ' ? '&nbsp;' : item}</span></span>`)
                .join(language === 'en' ? '' : ' ');
            const lines = headline.querySelectorAll('.reveal-line');
            gsap.fromTo(lines, { yPercent: 100, opacity: 0 }, {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.03,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: headline,
                    start: 'top 80%',
                },
            });
            // Autoplay is best-effort. Browser policy or slow networks must never throw an unhandled error.
            if (video && !videoFailed) {
                const safePlay = () => {
                    void video.play().catch(() => undefined);
                };
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    onEnter: safePlay,
                    onEnterBack: safePlay,
                    onLeave: () => video.pause(),
                    onLeaveBack: () => video.pause(),
                });
            }
        }, containerRef);
        return () => ctx.revert();
    }, [language, videoFailed]);
    return (_jsxs("section", { ref: containerRef, className: "relative min-h-[120vh] w-full bg-[#071426] flex items-center justify-center overflow-hidden py-24", children: [_jsxs("div", { ref: videoWrapperRef, className: "relative w-[90%] max-w-7xl aspect-video rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-[#0D1D33]", style: { willChange: 'transform' }, children: [_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(22,139,255,0.22),transparent_55%),linear-gradient(135deg,#071426,#0D1D33)]", children: _jsx("img", { src: SITE.logo, alt: "", "aria-hidden": "true", className: `h-[58%] w-[58%] object-contain transition-opacity duration-500 ${videoFailed ? 'opacity-45' : 'opacity-10'}` }) }), !videoFailed && (_jsxs("video", { ref: videoRef, className: "relative z-[1] w-full h-full object-cover opacity-60 mix-blend-screen", muted: true, loop: true, playsInline: true, preload: "metadata", poster: SITE.logo, onError: () => setVideoFailed(true), children: [_jsx("source", { src: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_h265/v1634125867/docs/typography.mp4", type: "video/mp4; codecs=hvc1" }), _jsx("source", { src: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_vp9/v1634125867/docs/typography.webm", type: "video/webm" })] })), _jsx("div", { className: "absolute inset-0 z-[2] bg-gradient-to-t from-[#071426] via-transparent to-transparent opacity-80" }), _jsx("div", { className: "absolute inset-0 z-[2] bg-[#168BFF]/5 mix-blend-overlay" })] }), _jsx("div", { className: "absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none", children: _jsxs("div", { className: "max-w-4xl", children: [_jsx("span", { className: "block text-[#168BFF] font-mono tracking-[0.4em] text-[10px] md:text-xs uppercase mb-8 opacity-70", children: language === 'en' ? 'Digital Transformation' : 'ডিজিটাল রূপান্তর' }), _jsx("h2", { ref: headlineRef, className: "text-white text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[0.85] mb-12", children: language === 'en' ? 'Ideas Into Global Impact' : 'ধারণা থেকে বৈশ্বিক প্রভাব' }), _jsxs("div", { className: "flex items-center justify-center gap-4", children: [_jsx("div", { className: "h-[1px] w-12 bg-[#168BFF]" }), _jsx("p", { className: "text-white/40 font-mono text-[10px] uppercase tracking-widest", children: language === 'en' ? 'Quanta Reach Solutions' : 'কোয়ান্টা রিচ সলিউশনস' }), _jsx("div", { className: "h-[1px] w-12 bg-[#168BFF]" })] })] }) }), _jsx("div", { className: "absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.7)_0_1px,transparent_1px)] bg-[length:5px_5px]" })] }));
};
