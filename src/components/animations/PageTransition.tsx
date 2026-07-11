import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';
import { isReducedMotion } from '../../lib/motion';

export const PageTransition: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryCurtainRef = useRef<HTMLDivElement>(null);
  const secondaryCurtainRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);
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

    if (!container || !primary || !secondary || !branding) return;

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
      return;
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

  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden"
    >
      {/* সেকেন্ডারি কার্টেইন (নীল প্যানেল) - শুরুতে স্ক্রিনের নিচে লুকানো */}
      <div
        ref={secondaryCurtainRef}
        className="absolute inset-0 w-full h-full bg-[#168BFF] translate-y-full"
        style={{ willChange: 'transform' }}
      />
      
      {/* প্রাইমারি কার্টেইন (নেভি প্যানেল) - শুরুতে স্ক্রিনের নিচে লুকানো */}
      <div
        ref={primaryCurtainRef}
        className="absolute inset-0 w-full h-full bg-[#071426] translate-y-full flex items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        <div ref={brandingRef} className="text-center px-6">
          <span className="block text-[#168BFF] font-mono tracking-[0.25em] text-xs uppercase mb-3">
            {language === 'en' ? 'METAFORE TECHNOLOGIES' : 'মেটাফোর টেকনোলজিস'}
          </span>
          <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight leading-none">
            {language === 'en' ? (
              <>Solutions for <span className="text-[#9C5CFF]">Global Growth</span></>
            ) : (
              <>বৈশ্বিক প্রবৃদ্ধির জন্য <span className="text-[#9C5CFF]">ডিজিটাল সমাধান</span></>
            )}
          </h2>
        </div>
      </div>
    </div>
  );
};