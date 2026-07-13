import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';

export const Preloader: React.FC = () => {
  const { language } = useLanguage();
  const [count, setCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const abstractLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // সেশনে ইতিমধ্যে প্রিলোডার একবার সম্পন্ন হয়ে থাকলে এটি রেন্ডার করা হবে না
    const preloaderRan = sessionStorage.getItem('quantareach_preloader_run');
    if (preloaderRan) {
      setIsVisible(false);
      return;
    }

    const container = containerRef.current;
    const topHalf = topHalfRef.current;
    const bottomHalf = bottomHalfRef.current;
    const counter = counterRef.current;
    const bar = progressBarRef.current;
    const logo = logoRef.current;
    const glow = glowRef.current;
    const abstract = abstractLayerRef.current;

    if (!container || !topHalf || !bottomHalf || !counter || !bar || !logo || !glow || !abstract) return;

    // প্রিলোড চলাকালীন বডি স্ক্রল অফ করা হলো
    document.body.style.overflow = 'hidden';

    const counterObj = { value: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        setIsVisible(false);
        // সেশনে একবার চালানোর জন্য ফ্ল্যাগ সেভ করা হলো
        sessionStorage.setItem('quantareach_preloader_run', 'true');
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
      sessionStorage.setItem('quantareach_preloader_run', 'true');
    }, 5000);

    return () => {
      clearTimeout(safetyTimeout);
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  // ৩ ডিজিট প্যাডিং ফরম্যাটিং (000, 005, 042, 100)
  const formatNum = (num: number): string => {
    return num.toString().padStart(3, '0');
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] overflow-hidden select-none pointer-events-auto"
    >
      {/* স্ক্রিন স্প্লিটের উপরের অর্ধ-প্যানেল */}
      <div
        ref={topHalfRef}
        className="absolute top-0 left-0 w-full h-[50vh] bg-[#071426] border-b border-[#0D1D33]"
        style={{ willChange: 'transform' }}
      />

      {/* স্ক্রিন স্প্লিটের নিচের অর্ধ-প্যানেল */}
      <div
        ref={bottomHalfRef}
        className="absolute bottom-0 left-0 w-full h-[50vh] bg-[#071426] border-t border-[#0D1D33]"
        style={{ willChange: 'transform' }}
      />

      {/* সেন্ট্রাল ইন্টারঅ্যাক্টিভ অ্যানিমেশন কনটেন্ট লেয়ার */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-16 px-6 z-10 pointer-events-none">
        {/* টপ কলাম: ব্র্যান্ড লোগো বা ওয়াটারমার্ক */}
        <div ref={logoRef} className="text-center mt-6">
          <span className="block text-[#168BFF] font-mono tracking-[0.3em] text-xs uppercase mb-1">
            {language === 'en' ? 'QUANTA REACH SOLUTIONS' : 'কোয়ান্টা রিচ সলিউশনস'}
          </span>
          <span className="text-white/40 text-[10px] tracking-wider uppercase">
            {language === 'en' ? 'Creative Agency Integration' : 'ক্রিয়েটিভ এজেন্সি ইন্টিগ্রেশন'}
          </span>
        </div>

        {/* মিডল কলাম: থ্রি-ডিজিটের সংখ্যাবাচক কাউন্টার */}
        <div className="relative flex flex-col items-center justify-center w-full max-w-lg">
          {/* প্রিমিয়াম শ্যাডো ও গ্রেডিয়েন্ট গ্লো */}
          <div
            ref={glowRef}
            className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-tr from-[#168BFF]/20 to-[#7457FF]/20 filter blur-[80px] -z-10"
          />

          {/* ডেকোরেটিভ গ্রেডিয়েন্ট নয়েজ SVG আর্ট */}
          <div ref={abstractLayerRef} className="absolute inset-0 flex items-center justify-center -z-10 w-full h-full">
            <svg className="w-64 h-64 md:w-96 md:h-96 text-white/[0.02]" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
              <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.25" />
              <path d="M100 0 V200 M0 100 H200" stroke="currentColor" strokeWidth="0.25" />
            </svg>
          </div>

          <div
            ref={counterRef}
            className="text-white font-mono text-8xl md:text-[11rem] font-extralight tracking-tighter leading-none"
          >
            {formatNum(count)}
          </div>
          
          {/* স্লিম ট্র্যাকিং বার */}
          <div className="w-full bg-white/[0.05] h-[2px] mt-6 relative overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-[#168BFF] to-[#7457FF] origin-left"
              style={{ willChange: 'transform' }}
            />
          </div>
        </div>

        {/* বটম কলাম: মোশন স্লোগান */}
        <div className="text-center mb-6">
          <p className="text-white/30 font-mono text-[10px] uppercase tracking-[0.2em]">
            {language === 'en' ? 'OUR BRAND MEANS TRUST' : 'আমাদের ব্র্যান্ড মানেই আস্থা'}
          </p>
        </div>
      </div>
    </div>
  );
};