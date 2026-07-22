import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE } from '/src/config/site.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { isReducedMotion, useMagnetic } from '/src/lib/motion.js';
export const Footer = () => {
    const { language } = useLanguage();
    const footerRef = useRef(null);
    const bigTextRef = useRef(null);
    const ctaBtnRef = useMagnetic(0.3, 0.1);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        if (isReducedMotion())
            return undefined;
        const footer = footerRef.current;
        const watermark = bigTextRef.current;
        if (!footer)
            return undefined;
        const ctx = gsap.context(() => {
            gsap.fromTo(footer, { yPercent: -12 }, {
                yPercent: 0,
                ease: 'none',
                scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: true },
            });
        }, footer);
        const handleMouseMove = (event) => {
            if (!watermark)
                return;
            const x = (event.clientX / window.innerWidth - 0.5) * 36;
            const y = (event.clientY / window.innerHeight - 0.5) * 24;
            gsap.to(watermark, { x, y, duration: 0.8, ease: 'power2.out', overwrite: true });
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            ctx.revert();
        };
    }, []);
    const companyLinks = [
        { label: language === 'en' ? 'About Us' : 'আমাদের সম্পর্কে', to: '/about' },
        { label: language === 'en' ? 'Portfolio' : 'পোর্টফোলিও', to: '/portfolio' },
        { label: language === 'en' ? 'Pricing' : 'প্রাইসিং', to: '/pricing' },
        { label: language === 'en' ? 'Blog' : 'ব্লগ', to: '/blog' },
    ];
    return (_jsxs("footer", { ref: footerRef, className: "relative z-0 w-full overflow-hidden bg-[#071426] pb-12 pt-24", children: [_jsx("div", { ref: bigTextRef, className: "pointer-events-none absolute bottom-0 left-0 w-full select-none text-center leading-none opacity-[0.03]", children: _jsx("span", { className: "text-[20vw] font-black tracking-tighter text-white", children: "QUANTA REACH" }) }), _jsxs("div", { className: "container relative z-10 mx-auto px-6", children: [_jsxs("div", { className: "mb-24 flex flex-col gap-12 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { className: "max-w-2xl", children: [_jsxs("div", { className: "mb-8 flex items-center gap-4", children: [_jsx("img", { src: SITE.mark, alt: "", className: "h-16 w-16 object-contain" }), _jsxs("div", { children: [_jsx("p", { className: "font-black uppercase tracking-tight text-white", children: SITE.shortName }), _jsx("p", { className: "text-xs uppercase tracking-[0.28em] text-[#168BFF]", children: "Solutions" })] })] }), _jsx("h2", { className: "mb-8 text-5xl font-bold leading-[0.85] tracking-tighter text-white md:text-8xl", children: language === 'en' ? _jsxs(_Fragment, { children: ["LET'S BUILD ", _jsx("br", {}), _jsx("span", { className: "text-[#168BFF]", children: "WHAT'S NEXT." })] }) : _jsxs(_Fragment, { children: ["\u0986\u09B8\u09C1\u09A8 \u0997\u09DC\u09BF ", _jsx("br", {}), _jsx("span", { className: "text-[#168BFF]", children: "\u09AD\u09AC\u09BF\u09B7\u09CD\u09AF\u09CE\u0964" })] }) }), _jsx("p", { className: "text-lg font-light text-white/40 md:text-xl", children: language === 'en' ? 'Ready to transform your digital presence? Reach out to our team.' : 'আপনার ডিজিটাল উপস্থিতি বদলাতে প্রস্তুত? আমাদের টিমের সাথে যোগাযোগ করুন।' })] }), _jsx(Link, { to: "/contact", ref: ctaBtnRef, className: "group flex h-32 w-32 items-center justify-center rounded-full bg-[#168BFF] transition-transform hover:scale-110 active:scale-95 md:h-48 md:w-48", "aria-label": language === 'en' ? 'Start a conversation' : 'কথা বলা শুরু করুন', children: _jsxs("div", { className: "flex flex-col items-center text-[#071426]", children: [_jsx(ArrowUpRight, { className: "h-8 w-8 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:h-12 md:w-12" }), _jsx("span", { className: "mt-2 text-xs font-bold uppercase tracking-widest md:text-sm", children: language === 'en' ? 'Start' : 'শুরু' })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-12 border-y border-white/5 py-16 md:grid-cols-4", children: [_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-white/40", children: language === 'en' ? 'Contact' : 'যোগাযোগ' }), _jsxs("div", { className: "flex flex-col gap-4 text-sm", children: [_jsxs("a", { href: `mailto:${SITE.email}`, className: "flex items-center gap-3 break-all text-white/60 transition-colors hover:text-[#168BFF]", children: [_jsx(Mail, { className: "h-4 w-4 shrink-0" }), SITE.email] }), _jsxs("a", { href: SITE.phoneHref, className: "flex items-center gap-3 text-white/60 transition-colors hover:text-[#168BFF]", children: [_jsx(Phone, { className: "h-4 w-4" }), SITE.phoneDisplay] }), _jsxs("div", { className: "flex items-start gap-3 text-white/60", children: [_jsx(MapPin, { className: "mt-1 h-4 w-4" }), SITE.location] })] })] }), _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-white/40", children: language === 'en' ? 'Services' : 'সেবাসমূহ' }), _jsx("div", { className: "flex flex-col gap-3", children: ['Web Design', 'Software Development', 'AI Solutions', 'Digital Marketing'].map((item) => _jsx(Link, { to: "/services", className: "text-white/60 transition-colors hover:text-white", children: item }, item)) })] }), _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-white/40", children: language === 'en' ? 'Company' : 'কোম্পানি' }), _jsx("div", { className: "flex flex-col gap-3", children: companyLinks.map((item) => _jsx(Link, { to: item.to, className: "text-white/60 transition-colors hover:text-white", children: item.label }, item.to)) })] }), _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-white/40", children: language === 'en' ? 'Direct Message' : 'সরাসরি যোগাযোগ' }), _jsxs("a", { href: SITE.whatsappHref, target: "_blank", rel: "noopener noreferrer", className: "inline-flex w-fit items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-white/70 transition hover:border-[#168BFF] hover:text-[#168BFF]", children: [_jsx(MessageSquare, { className: "h-5 w-5" }), "WhatsApp"] })] })] }), _jsxs("div", { className: "mt-12 flex flex-col items-center justify-between gap-6 md:flex-row", children: [_jsxs("p", { className: "font-mono text-xs text-white/20", children: ["\u00A9 ", new Date().getFullYear(), " ", SITE.name.toUpperCase(), ". ALL RIGHTS RESERVED."] }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-6 md:gap-8", children: [_jsx(Link, { to: "/legal/privacy-policy", className: "text-xs uppercase tracking-widest text-white/20 transition-colors hover:text-white", children: language === 'en' ? 'Privacy Policy' : 'প্রাইভেসি পলিসি' }), _jsx(Link, { to: "/legal/terms-and-conditions", className: "text-xs uppercase tracking-widest text-white/20 transition-colors hover:text-white", children: language === 'en' ? 'Terms & Conditions' : 'শর্তাবলী' })] })] })] })] }));
};
