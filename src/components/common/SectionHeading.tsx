import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../hooks/useLanguage';
import { splitTextBilingual, isReducedMotion } from '../../lib/motion';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // GSAP প্লাগইন রেজিস্টার
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (isReducedMotion()) return;

      const titleEl = titleRef.current;
      const badgeEl = badgeRef.current;
      const subtitleEl = subtitleRef.current;

      if (!titleEl) return;

      // ১. টেক্সট স্প্লিটিং (Bilingual Safe Logic)
      const data = splitTextBilingual(
        title, 
        language === 'en' ? 'chars' : 'words', 
        language
      );
      
      // ডম ম্যানিপুলেশন: প্রতিটি আইটেমকে ওভারফ্লো-হিডেন কন্টেইনারে রাখা হচ্ছে মাস্ক ইফেক্টের জন্য
      titleEl.innerHTML = data.items
        .map(item => `<span class="inline-block overflow-hidden py-[0.1em] -my-[0.1em]"><span class="title-part inline-block">${item === ' ' ? '&nbsp;' : item}</span></span>`)
        .join(language === 'en' ? '' : ' ');

      const parts = titleEl.querySelectorAll('.title-part');

      // ২. স্ক্রল-ট্রিগারড অ্যানিমেশন টাইমলাইন
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%', // সেকশনটি যখন স্ক্রিনের ৮৫% নিচে আসবে তখন শুরু হবে
          toggleActions: 'play none none none', // শুধু একবার প্লে হবে
        }
      });

      // ব্যাজ অ্যানিমেশন (যদি থাকে)
      if (badgeEl) {
        tl.fromTo(badgeEl, 
          { opacity: 0, x: align === 'center' ? 0 : -20, scale: 0.8 },
          { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
        );
      }

      // মেইন টাইটেল রিভিল অ্যানিমেশন
      tl.fromTo(parts,
        { yPercent: 100, rotateX: 45, opacity: 0 },
        { 
          yPercent: 0, 
          rotateX: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: language === 'en' ? 0.02 : 0.05, 
          ease: 'power4.out' 
        },
        badgeEl ? '-=0.4' : '0'
      );

      // সাবটাইটেল অ্যানিমেশন (যদি থাকে)
      if (subtitleEl) {
        tl.fromTo(subtitleEl,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, [title, language, align]);

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col mb-12 md:mb-20 ${alignmentClasses[align]} ${className}`}
    >
      {/* প্রিমিয়াম ব্যাজ */}
      {badge && (
        <div 
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#168BFF]/10 border border-[#168BFF]/20 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#168BFF]" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#168BFF] uppercase font-bold">
            {badge}
          </span>
        </div>
      )}

      {/* মেইন টাইটেল */}
      <h2 
        ref={titleRef}
        className={`text-white font-bold tracking-tighter leading-[1.1] 
          ${language === 'en' ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-4xl md:text-6xl lg:text-7xl'}
          max-w-4xl`}
      >
        {title}
      </h2>

      {/* সাবটাইটেল */}
      {subtitle && (
        <p 
          ref={subtitleRef}
          className="mt-6 text-white/50 text-base md:text-lg lg:text-xl font-light max-w-2xl leading-relaxed"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};