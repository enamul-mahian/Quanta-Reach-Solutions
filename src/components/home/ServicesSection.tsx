import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../hooks/useLanguage';
import { SectionHeading } from '../common/SectionHeading';
import { lerp, isReducedMotion } from '../../lib/motion';

// সার্ভিস ডাটা স্ট্রাকচার
const servicesData = [
  {
    id: '01',
    title: { en: 'Web Development', bn: 'ওয়েব ডেভেলপমেন্ট' },
    description: { en: 'High-performance, scalable web applications built with modern tech.', bn: 'আধুনিক প্রযুক্তিতে তৈরি উচ্চ-ক্ষমতাসম্পন্ন এবং স্কেলেবল ওয়েব অ্যাপ্লিকেশন।' },
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '02',
    title: { en: 'UI/UX Design', bn: 'ইউআই/ইউএক্স ডিজাইন' },
    description: { en: 'User-centric designs that deliver premium digital experiences.', bn: 'প্রিমিয়াম ডিজিটাল অভিজ্ঞতা প্রদানের জন্য ইউজার-কেন্দ্রিক ডিজাইন।' },
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '03',
    title: { en: 'AI & Automation', bn: 'এআই ও অটোমেশন' },
    description: { en: 'Integrating intelligent systems to streamline your business.', bn: 'ব্যবসা সহজ করতে ইন্টেলিজেন্ট সিস্টেমের ইন্টিগ্রেশন।' },
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '04',
    title: { en: 'Digital Marketing', bn: 'ডিজিটাল মার্কেটিং' },
    description: { en: 'Strategic growth through data-driven marketing campaigns.', bn: 'ডাটা-ড্রিভেন মার্কেটিং ক্যাম্পেইনের মাধ্যমে কৌশলগত প্রবৃদ্ধি।' },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
  },
];

export const ServicesSection: React.FC = () => {
  const { language } = useLanguage();
  const [activeService, setActiveService] = useState<number | null>(null);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const floatingPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ১. লিস্ট আইটেম রিভিল অ্যানিমেশন (Staggered)
    const ctx = gsap.context(() => {
      if (isReducedMotion()) return;

      const items = listRef.current?.querySelectorAll('.service-item');
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, sectionRef);

    // ২. মাউস ট্র্যাকিং ও LERP অ্যানিমেশন লুপ (ফ্লোটিং ইমেজের জন্য)
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const updatePosition = () => {
      if (floatingRef.current) {
        // লিনিয়ার ইন্টারপোলেশন (Lerp) ব্যবহার করে মসৃণ ফলো-আপ
        floatingPos.current.x = lerp(floatingPos.current.x, mousePos.current.x, 0.1);
        floatingPos.current.y = lerp(floatingPos.current.y, mousePos.current.y, 0.1);
        
        floatingRef.current.style.transform = `translate3d(${floatingPos.current.x}px, ${floatingPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId.current = requestAnimationFrame(updatePosition);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#071426] overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          badge={language === 'en' ? 'OUR EXPERTISE' : 'আমাদের দক্ষতা'}
          title={language === 'en' ? 'Core Digital Services' : 'মূল ডিজিটাল সেবাসমূহ'}
          subtitle={language === 'en' ? 'Tailored solutions to elevate your brand in the global digital landscape.' : 'আপনার ব্র্যান্ডকে বৈশ্বিক ডিজিটাল প্ল্যাটফর্মে এগিয়ে নিতে আমরা দিচ্ছি বিশেষ সমাধান।'}
          align="left"
        />

        {/* সার্ভিস লিস্ট */}
        <div ref={listRef} className="mt-12 flex flex-col border-t border-white/10">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              className="service-item group relative py-10 md:py-14 border-b border-white/10 cursor-none flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500 hover:px-4"
              onMouseEnter={() => setActiveService(index)}
              onMouseLeave={() => setActiveService(null)}
            >
              {/* লেফট: নম্বর ও টাইটেল */}
              <div className="flex items-center gap-8 md:gap-16">
                <span className="text-[#168BFF] font-mono text-sm md:text-base">
                  {service.id}
                </span>
                <h3 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-transform duration-500 group-hover:translate-x-4">
                  {language === 'en' ? service.title.en : service.title.bn}
                </h3>
              </div>

              {/* রাইট: ডেসক্রিপশন */}
              <div className="max-w-xs md:text-right">
                <p className="text-white/40 text-sm md:text-base leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                  {language === 'en' ? service.description.en : service.description.bn}
                </p>
              </div>

              {/* ব্যাকগ্রাউন্ড হোভার ইফেক্ট */}
              <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
          ))}
        </div>
      </div>

      {/* ৩. ফ্লোটিং ইমেজ প্রিভিউ (ডেস্কটপের জন্য) */}
      <div
        ref={floatingRef}
        className={`fixed top-0 left-0 w-64 h-80 md:w-80 md:h-96 pointer-events-none z-[100] overflow-hidden rounded-xl transition-opacity duration-500 ease-out hidden lg:block ${
          activeService !== null ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {servicesData.map((service, index) => (
          <div
            key={`img-${service.id}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              activeService === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={service.image}
              alt={service.title.en}
              className="w-full h-full object-cover"
            />
            {/* গ্রেডিয়েন্ট ওভারলে */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/80 to-transparent" />
          </div>
        ))}
      </div>

      {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#168BFF]/5 filter blur-[120px] rounded-full -z-10" />
    </section>
  );
};