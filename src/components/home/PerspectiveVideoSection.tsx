import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../hooks/useLanguage';
import { splitTextBilingual, isReducedMotion } from '../../lib/motion';

export const PerspectiveVideoSection: React.FC = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (isReducedMotion()) return;

      const videoWrapper = videoWrapperRef.current;
      const headline = headlineRef.current;
      const video = videoRef.current;

      if (!videoWrapper || !headline || !video) return;

      // ১. সিনেমাটিক ৩ডি ভিডিও ট্রান্সফর্ম (Scroll scrubbing)
      gsap.fromTo(videoWrapper, 
        { 
          perspective: 1000,
          rotateX: 15,
          scale: 1.1,
          z: 0 
        },
        {
          rotateX: 0,
          scale: 0.9,
          z: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );

      // ২. টেক্সট স্প্লিটিং এবং মাস্ক রিভিল
      const textData = splitTextBilingual(
        headline.innerText,
        language === 'en' ? 'chars' : 'words',
        language
      );

      headline.innerHTML = textData.items
        .map(item => `<span class="inline-block overflow-hidden py-2"><span class="reveal-line inline-block">${item === ' ' ? '&nbsp;' : item}</span></span>`)
        .join(language === 'en' ? '' : ' ');

      const lines = headline.querySelectorAll('.reveal-line');

      gsap.fromTo(lines,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.03,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headline,
            start: 'top 80%',
          }
        }
      );

      // ৩. ভিডিও অটো-প্লে/পজ ম্যানেজমেন্ট (Performance)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => video.play(),
        onEnterBack: () => video.play(),
        onLeave: () => video.pause(),
        onLeaveBack: () => video.pause(),
      });

    }, containerRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[120vh] w-full bg-[#071426] flex items-center justify-center overflow-hidden py-24"
    >
      {/* ৩ডি ভিডিও কন্টেইনার */}
      <div 
        ref={videoWrapperRef}
        className="relative w-[90%] max-w-7xl aspect-video rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-[#0D1D33]"
        style={{ willChange: 'transform' }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
          muted
          loop
          playsInline
          poster="https://res.cloudinary.com/demo/video/upload/v1634125867/docs/typography.jpg"
        >
          <source 
            src="https://res.cloudinary.com/demo/video/upload/q_auto,vc_h265/v1634125867/docs/typography.mp4" 
            type="video/mp4; codecs=hvc1" 
          />
          <source 
            src="https://res.cloudinary.com/demo/video/upload/q_auto,vc_vp9/v1634125867/docs/typography.webm" 
            type="video/webm" 
          />
        </video>

        {/* ভিডিওর ভেতরের সিনেমাটিক ওভারলে */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-[#168BFF]/5 mix-blend-overlay" />
      </div>

      {/* ওভারলে এডিটোরিয়াল টেক্সট কন্টেন্ট */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <div className="max-w-4xl">
          <span className="block text-[#168BFF] font-mono tracking-[0.4em] text-[10px] md:text-xs uppercase mb-8 opacity-70">
            {language === 'en' ? 'Digital Transformation' : 'ডিজিটাল রূপান্তর'}
          </span>
          
          <h2 
            ref={headlineRef}
            className="text-white text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[0.85] mb-12"
          >
            {language === 'en' 
              ? 'Ideas Into Global Impact' 
              : 'ধারণা থেকে বৈশ্বিক প্রভাব'}
          </h2>

          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-[#168BFF]" />
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
              {language === 'en' ? 'Est. 2024 MetaFore' : 'স্থাপিত ২০২৪ মেটাফোর'}
            </p>
            <div className="h-[1px] w-12 bg-[#168BFF]" />
          </div>
        </div>
      </div>

      {/* সিনেমাটিক গ্রেইন নয়েজ ওভারলে */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://res.cloudinary.com/dz8on798t/image/upload/v1642674480/noise_shdfv8.png')]" />
    </section>
  );
};