import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom'; // useNavigate হুক ইম্পোর্ট করা হয়েছে
import { useLanguage } from '../../hooks/useLanguage';
import { LiquidHeroCanvas } from '../animations/LiquidHeroCanvas';
import { 
  splitTextBilingual, 
  useMagnetic, 
  isReducedMotion 
} from '../../lib/motion';

/**
 * QUANTA REACH SOLUTIONS - LIQUID TYPOGRAPHY HERO
 * এটি প্রফেশনাল এজেন্সি নোট, লিকুইড রিভিল ইফেক্ট এবং টাইপ-সেফ রাউটিং বাটন সমৃদ্ধ।
 */

export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate(); // রাউটিং কন্ট্রোলার ইনিশিয়েট করা হলো
  
  // রিফ রেফারেন্সসমূহ
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subHeadlineRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  
  // ম্যাগনেটিক সিটিএ বাটন হুকস
  const primaryBtnRef = useMagnetic<HTMLButtonElement>(0.35, 0.1);
  const secondaryBtnRef = useMagnetic<HTMLButtonElement>(0.35, 0.1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isReducedMotion()) return;

      const headline = headlineRef.current;
      const subHeadline = subHeadlineRef.current;
      const tagline = taglineRef.current;
      const ctas = ctaGroupRef.current;

      if (!headline || !subHeadline || !tagline || !ctas) return;

      // ১. টেক্সট স্প্লিটিং (Bilingual Safe) - Main Headline
      const headData = splitTextBilingual(
        headline.innerText, 
        language === 'en' ? 'chars' : 'words', 
        language
      );
      
      headline.innerHTML = headData.items
        .map(item => `
          <span class="inline-block overflow-hidden py-2 -my-2">
            <span class="head-item inline-block">${item === ' ' ? '&nbsp;' : item}</span>
          </span>
        `)
        .join(language === 'en' ? '' : ' ');

      // ২. টেক্সট স্প্লিটিং - "Solutions" Sub-line
      const subData = splitTextBilingual(
        subHeadline.innerText,
        language === 'en' ? 'chars' : 'words',
        language
      );

      subHeadline.innerHTML = subData.items
        .map(item => `
          <span class="inline-block overflow-hidden py-1 -my-1">
            <span class="sub-item inline-block">${item === ' ' ? '&nbsp;' : item}</span>
          </span>
        `)
        .join(language === 'en' ? '' : ' ');

      const headItems = headline.querySelectorAll('.head-item');
      const subItems = subHeadline.querySelectorAll('.sub-item');

      // ৩. সিনেমাটিক এন্ট্রি অ্যানিমেশন সিকোয়েন্স
      const tl = gsap.timeline({ delay: 1.0 });

      tl.fromTo(headItems,
        { yPercent: 110, rotateX: -90, opacity: 0 },
        { 
          yPercent: 0, 
          rotateX: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.03, 
          ease: "expo.out" 
        }
      )
      .fromTo(subItems,
        { yPercent: 110, opacity: 0 },
        { 
          yPercent: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.02, 
          ease: "expo.out" 
        },
        "-=0.8"
      )
      .fromTo(tagline,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(ctas.children,
        { opacity: 0, scale: 0.8, y: 30 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: "back.out(1.7)" 
        },
        "-=0.7"
      );

      gsap.fromTo(scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2.5 }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#071426] pt-20"
    >
      {/* লেয়ার ১: WebGL Liquid Canvas */}
      <div className="absolute inset-0 z-0 opacity-90">
        <LiquidHeroCanvas />
      </div>

      {/* ... কন্টেন্ট লেয়ার ... */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* ব্র্যান্ড ব্লক */}
        <div className="flex flex-col items-center text-center mix-blend-exclusion">
          <h1 
            ref={headlineRef}
            className="text-white text-[18vw] md:text-[14vw] font-black tracking-tighter leading-[0.75] select-none uppercase"
            style={{ fontStretch: 'condensed' }}
          >
            {language === 'en' ? 'QUANTA REACH' : 'কোয়ান্টা রিচ'}
          </h1>
          
          <span 
            ref={subHeadlineRef}
            className="text-white text-[4vw] md:text-[3.2vw] font-bold tracking-[0.6em] md:tracking-[1.2em] leading-none select-none uppercase mt-2 opacity-80"
          >
            {language === 'en' ? 'SOLUTIONS' : 'সলিউশনস'}
          </span>
        </div>

        {/* এজেন্সি রিলেটেড নোট */}
        <div className="max-w-4xl text-center mt-12">
          <p 
            ref={taglineRef}
            className="text-white/70 text-lg md:text-2xl font-light mb-12 leading-relaxed tracking-wide px-4"
          >
            {language === 'en' 
              ? 'Transforming visionary ideas into scalable digital realities. We empower global brands through cutting-edge technology and strategic digital innovation.' 
              : 'কল্পনাপ্রসূত ধারণাকে বাস্তবায়িত করে বৈশ্বিক ডিজিটাল প্ল্যাটফর্মে আপনার ব্র্যান্ডকে নেতৃত্বের আসনে নিয়ে যাওয়াই আমাদের লক্ষ্য। আমরা দিচ্ছি অত্যাধুনিক প্রযুক্তি এবং কৌশলগত উদ্ভাবন।'}
          </p>

          {/* সিটিএ বাটন গ্রুপ (রাউটিংসহ) */}
          <div 
            ref={ctaGroupRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            {/* Start Journey -> /request-quote */}
            <button
              ref={primaryBtnRef}
              onClick={() => navigate('/request-quote')}
              className="group relative px-10 py-5 bg-white text-[#071426] font-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
              <span className="relative z-10 uppercase tracking-widest text-sm">
                {language === 'en' ? 'Start Journey' : 'যাত্রা শুরু'}
              </span>
              <div className="absolute inset-0 bg-[#168BFF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            </button>

            {/* Showcase -> /portfolio */}
            <button
              ref={secondaryBtnRef}
              onClick={() => navigate('/portfolio')}
              className="group px-10 py-5 bg-transparent text-white font-bold border-2 border-white/20 rounded-full hover:border-white transition-all duration-300 flex items-center gap-3 active:scale-95"
            >
              <span className="uppercase tracking-widest text-sm">
                {language === 'en' ? 'Showcase' : 'প্রদর্শনী'}
              </span>
              <div className="w-2 h-2 rounded-full bg-[#168BFF] group-hover:scale-[2.5] transition-transform duration-300 shadow-[0_0_10px_#168BFF]" />
            </button>
          </div>
        </div>
      </div>

      {/* স্ক্রল ইন্ডিকেটর */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 pointer-events-none"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#168BFF] animate-scroll-line" />
        </div>
        <span className="text-[10px] font-mono tracking-[0.5em] text-white/30 uppercase vertical-text">
          SCROLL
        </span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#071426]/50 via-transparent to-[#071426] pointer-events-none z-[5]" />
    </section>
  );
};