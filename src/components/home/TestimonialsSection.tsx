import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../hooks/useLanguage';
import { SectionHeading } from '../common/SectionHeading';
import { splitTextBilingual, isReducedMotion } from '../../lib/motion';

const testimonials = [
  {
    id: 1,
    quote: {
      en: "MetaFore didn't just build a website; they engineered a growth engine for our global operations.",
      bn: "মেটাফোর শুধু একটি ওয়েবসাইট তৈরি করেনি; তারা আমাদের বৈশ্বিক কার্যক্রমের জন্য একটি গ্রোথ ইঞ্জিন তৈরি করেছে।"
    },
    author: "James Anderson",
    role: "CEO, TechNova Solutions",
    country: "USA",
    result: { en: "+120% Conversion", bn: "+১২০% কনভার্সন" },
    project: "Quantum Platform"
  },
  {
    id: 2,
    quote: {
      en: "The bilingual integration and the motion quality are world-class. Truly a premium agency experience.",
      bn: "বাইলিঙ্গুয়াল ইন্টিগ্রেশন এবং মোশন কোয়ালিটি বিশ্বমানের। সত্যিই একটি প্রিমিয়াম এজেন্সি অভিজ্ঞতা।"
    },
    author: "রাশেদ আহমেদ",
    role: "ম্যানেজিং ডিরেক্টর, রূপান্তর গ্রুপ",
    country: "Bangladesh",
    result: { en: "45% Revenue Growth", bn: "৪৫% রাজস্ব বৃদ্ধি" },
    project: "Rupantor ERP"
  }
];

// কম্পোনেন্ট নাম ফাইলের নামের সাথে মিল রেখে 'TestimonialsSection' করা হলো
export const TestimonialsSection: React.FC = () => {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (isReducedMotion()) return;

      const items = gsap.utils.toArray('.testimonial-item') as HTMLElement[];

      items.forEach((item) => {
        const quoteText = item.querySelector('.quote-text') as HTMLElement;
        const infoBar = item.querySelector('.info-bar') as HTMLElement;

        if (!quoteText) return;

        // ১. টেক্সট স্প্লিটিং (Bilingual Safe)
        const data = splitTextBilingual(
          quoteText.innerText,
          'words',
          language
        );

        quoteText.innerHTML = data.items
          .map(word => `<span class="inline-block overflow-hidden"><span class="quote-word inline-block">${word}&nbsp;</span></span>`)
          .join('');

        const words = quoteText.querySelectorAll('.quote-word');

        // ২. স্ক্রল-ট্রিগারড অ্যানিমেশন
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
          }
        });

        tl.fromTo(words,
          { yPercent: 100, rotate: 2 },
          { 
            yPercent: 0, 
            rotate: 0, 
            duration: 0.8, 
            stagger: 0.03, 
            ease: 'power4.out' 
          }
        )
        .fromTo(infoBar,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-40 bg-[#071426] overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          badge={language === 'en' ? 'TESTIMONIALS' : 'প্রশংসাপত্র'}
          title={language === 'en' ? 'Trusted by Visionaries' : 'স্বপ্নদ্রষ্টাদের আস্থা'}
          align="center"
          className="mb-20"
        />

        <div className="flex flex-col gap-32 md:gap-48">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="testimonial-item relative max-w-6xl mx-auto text-center"
            >
              {/* কোটেশন মার্ক */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-[#168BFF]/10 text-[15rem] font-serif pointer-events-none select-none">
                “
              </div>

              {/* মেইন কোট টেক্সট */}
              <h3 className="quote-text text-white text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-12 relative z-10">
                {language === 'en' ? item.quote.en : item.quote.bn}
              </h3>

              {/* ইনফো বার */}
              <div className="info-bar flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#168BFF] to-[#7457FF] p-[1px]">
                    <div className="w-full h-full rounded-full bg-[#071426] flex items-center justify-center text-white font-bold text-xs">
                      {item.author.charAt(0)}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg leading-none">{item.author}</p>
                    <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">{item.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#168BFF]" />
                    <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">
                      {item.project}
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-[#168BFF]/10 border border-[#168BFF]/20 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#168BFF] uppercase tracking-wider">
                      {language === 'en' ? item.result.en : item.result.bn}
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono uppercase tracking-widest">
                    {item.country}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#168BFF]/10 filter blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7457FF]/10 filter blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
};