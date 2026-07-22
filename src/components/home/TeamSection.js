import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { lerp, isReducedMotion } from '/src/lib/motion.js';
const teamMembers = [
    {
        id: '01',
        name: { en: 'Arnab Sharkar', bn: 'অর্ণব সরকার' },
        role: { en: 'Lead Solutions Architect', bn: 'লিড সলিউশন আর্কিটেক্ট' },
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
        skills: ['React', 'Node.js', 'Firebase'],
    },
    {
        id: '02',
        name: { en: 'Sifatullah Khan', bn: 'সিফাতুল্লাহ খান' },
        role: { en: 'Senior Creative Designer', bn: 'সিনিয়র ক্রিয়েটিভ ডিজাইনার' },
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
        skills: ['UI/UX', 'Three.js', 'Figma'],
    },
    {
        id: '03',
        name: { en: 'Tanvir Ahmed', bn: 'তানভীর আহমেদ' },
        role: { en: 'Full Stack Developer', bn: 'ফুল স্ট্যাক ডেভেলপার' },
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600',
        skills: ['Python', 'Cloud Architecture', 'React'],
    },
];
export const TeamSection = () => {
    const { language } = useLanguage();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const sectionRef = useRef(null);
    const listRef = useRef(null);
    const floatingRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const floatingPos = useRef({ x: 0, y: 0 });
    const rotation = useRef({ x: 0, y: 0 });
    const rafId = useRef(null);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            if (isReducedMotion())
                return;
            const items = listRef.current?.querySelectorAll('.team-item');
            if (items) {
                gsap.fromTo(items, { opacity: 0, x: -30 }, {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: listRef.current,
                        start: 'top 80%',
                    }
                });
            }
        }, sectionRef);
        const handleMouseMove = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
            // ইমেজের জন্য হালকা ৩ডি রোটেশন ক্যালকুলেশন
            const xPercent = (e.clientX / window.innerWidth) - 0.5;
            const yPercent = (e.clientY / window.innerHeight) - 0.5;
            rotation.current.x = yPercent * 20;
            rotation.current.y = xPercent * 20;
        };
        const updatePosition = () => {
            if (floatingRef.current) {
                floatingPos.current.x = lerp(floatingPos.current.x, mousePos.current.x, 0.08);
                floatingPos.current.y = lerp(floatingPos.current.y, mousePos.current.y, 0.08);
                floatingRef.current.style.transform = `
          translate3d(${floatingPos.current.x}px, ${floatingPos.current.y}px, 0) 
          translate(-50%, -50%)
          rotateX(${-rotation.current.x}deg)
          rotateY(${rotation.current.y}deg)
        `;
            }
            rafId.current = requestAnimationFrame(updatePosition);
        };
        window.addEventListener('mousemove', handleMouseMove);
        rafId.current = requestAnimationFrame(updatePosition);
        return () => {
            ctx.revert();
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId.current)
                cancelAnimationFrame(rafId.current);
        };
    }, []);
    return (_jsxs("section", { ref: sectionRef, className: "relative py-24 md:py-32 bg-[#071426] overflow-hidden", children: [_jsxs("div", { className: "container mx-auto px-6 relative z-10", children: [_jsx(SectionHeading, { badge: language === 'en' ? 'OUR TEAM' : 'আমাদের টিম', title: language === 'en' ? 'Creative Thinkers' : 'সৃজনশীল চিন্তাবিদ', subtitle: language === 'en' ? 'Meet the digital architects driving innovation at Quanta Reach.' : 'কোয়ান্টা রিচের উদ্ভাবনের নেপথ্যে থাকা ডিজিটাল স্থপতিদের সাথে পরিচিত হোন।', align: "left" }), _jsx("div", { ref: listRef, className: "mt-16 flex flex-col", children: teamMembers.map((member, index) => (_jsxs("div", { className: "team-item group relative py-8 md:py-12 border-b border-white/5 cursor-none flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-500", onMouseEnter: () => setHoveredIndex(index), onMouseLeave: () => setHoveredIndex(null), children: [_jsxs("div", { className: "flex items-center gap-6 md:gap-12 relative z-10", children: [_jsx("span", { className: "text-[#168BFF] font-mono text-xs md:text-sm opacity-50", children: member.id }), _jsx("h3", { className: "text-white text-4xl md:text-7xl font-bold tracking-tighter transition-all duration-500 group-hover:pl-4 group-hover:text-[#168BFF]", children: language === 'en' ? member.name.en : member.name.bn })] }), _jsxs("div", { className: "flex flex-col md:items-end relative z-10", children: [_jsx("span", { className: "text-white/60 text-lg md:text-xl font-medium group-hover:text-white transition-colors", children: language === 'en' ? member.role.en : member.role.bn }), _jsx("div", { className: "flex gap-2 mt-2", children: member.skills.map(skill => (_jsx("span", { className: "text-[10px] font-mono text-[#168BFF] border border-[#168BFF]/20 px-2 py-0.5 rounded uppercase", children: skill }, skill))) })] }), _jsx("div", { className: "absolute left-0 bottom-0 h-[2px] w-0 bg-[#168BFF] transition-all duration-700 ease-out group-hover:w-full" })] }, member.id))) })] }), _jsx("div", { ref: floatingRef, className: `fixed top-0 left-0 w-56 h-72 md:w-72 md:h-96 pointer-events-none z-[100] overflow-hidden rounded-2xl shadow-2xl transition-opacity duration-500 ease-out hidden lg:block ${hoveredIndex !== null ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`, style: { perspective: '1000px', transformStyle: 'preserve-3d' }, children: teamMembers.map((member, index) => (_jsxs("div", { className: `absolute inset-0 transition-opacity duration-500 ease-in-out ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`, children: [_jsx("img", { src: member.image, alt: member.name.en, className: "w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-transparent opacity-60" })] }, `img-${member.id}`))) }), _jsx("div", { className: "absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-[#7457FF]/5 filter blur-[120px] rounded-full -z-10" })] }));
};
