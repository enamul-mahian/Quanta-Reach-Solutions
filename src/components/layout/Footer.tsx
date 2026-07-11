import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  ArrowUpRight, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useMagnetic, isReducedMotion } from '../../lib/motion';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);
  
  // ম্যাগনেটিক হুকস (সোশ্যাল আইকন ও CTA-এর জন্য)
  const ctaBtnRef = useMagnetic<HTMLAnchorElement>(0.3, 0.1);
  const ghRef = useMagnetic<HTMLAnchorElement>(0.4, 0.2);
  const liRef = useMagnetic<HTMLAnchorElement>(0.4, 0.2);
  const twRef = useMagnetic<HTMLAnchorElement>(0.4, 0.2);
  const inRef = useMagnetic<HTMLAnchorElement>(0.4, 0.2);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (isReducedMotion()) return;

      // ১. ফুটার রিভিল প্যারালাক্স অ্যানিমেশন
      gsap.fromTo(footerRef.current,
        { yPercent: -50 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          }
        }
      );

      // ২. বিগ ওয়াটারমার্ক টেক্সট মুভমেন্ট
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to(bigTextRef.current, {
          x: xPos,
          y: yPos,
          duration: 1,
          ease: 'power2.out'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="relative w-full bg-[#071426] pt-24 pb-12 overflow-hidden z-0"
    >
      {/* ব্যাকগ্রাউন্ড ওভারসাইজড ওয়াটারমার্ক */}
      <div 
        ref={bigTextRef}
        className="absolute bottom-0 left-0 w-full text-center pointer-events-none select-none opacity-[0.03] leading-none"
      >
        <span className="text-[20vw] font-black tracking-tighter text-white">
          METAFORE
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* টপ সেকশন: বড় CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="max-w-2xl">
            <h2 className="text-white text-5xl md:text-8xl font-bold tracking-tighter leading-[0.85] mb-8">
              {language === 'en' ? (
                <>LET'S BUILD <br /> <span className="text-[#168BFF]">WHAT'S NEXT.</span></>
              ) : (
                <>আসুন গড়ি <br /> <span className="text-[#168BFF]">ভবিষ্যৎ।</span></>
              )}
            </h2>
            <p className="text-white/40 text-lg md:text-xl font-light">
              {language === 'en' 
                ? 'Ready to transform your digital presence? Reach out to our team of experts.' 
                : 'আপনার ডিজিটাল উপস্থিতি পরিবর্তন করতে প্রস্তুত? আমাদের বিশেষজ্ঞ টিমের সাথে যোগাযোগ করুন।'}
            </p>
          </div>

          <Link
            to="/contact"
            ref={ctaBtnRef}
            className="group w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#168BFF] flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <div className="text-[#071426] flex flex-col items-center">
              <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest mt-2">
                {language === 'en' ? 'Start' : 'শুরু'}
              </span>
            </div>
          </Link>
        </div>

        {/* মিডেল সেকশন: গ্রিড লিঙ্কস */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16 border-y border-white/5">
          {/* কলাম ১: যোগাযোগ */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white text-sm font-mono tracking-widest uppercase opacity-40">
              {language === 'en' ? 'Contact' : 'যোগাযোগ'}
            </h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:hello@metafore.tech" className="flex items-center gap-3 text-white/60 hover:text-[#168BFF] transition-colors">
                <Mail className="w-4 h-4" /> <span>hello@metafore.tech</span>
              </a>
              <a href="tel:+880123456789" className="flex items-center gap-3 text-white/60 hover:text-[#168BFF] transition-colors">
                <Phone className="w-4 h-4" /> <span>+880 1234 567890</span>
              </a>
              <div className="flex items-start gap-3 text-white/60">
                <MapPin className="w-4 h-4 mt-1" /> <span>Dhanmondi, Dhaka,<br />Bangladesh</span>
              </div>
            </div>
          </div>

          {/* কলাম ২: সেবাসমূহ */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white text-sm font-mono tracking-widest uppercase opacity-40">
              {language === 'en' ? 'Services' : 'সেবাসমূহ'}
            </h4>
            <div className="flex flex-col gap-3">
              {['Web Design', 'Development', 'AI Solutions', 'Marketing'].map(item => (
                <Link key={item} to="/services" className="text-white/60 hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          {/* কলাম ৩: কোম্পানি */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white text-sm font-mono tracking-widest uppercase opacity-40">
              {language === 'en' ? 'Company' : 'কোম্পানি'}
            </h4>
            <div className="flex flex-col gap-3">
              {['About Us', 'Portfolio', 'Pricing', 'Blog'].map(item => (
                <Link key={item} to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-white/60 hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          {/* কলাম ৪: সোশ্যাল মিডিয়া */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white text-sm font-mono tracking-widest uppercase opacity-40">
              {language === 'en' ? 'Follow Us' : 'অনুসরণ করুন'}
            </h4>
            <div className="flex items-center gap-4">
              {[
                { icon: <Github />, ref: ghRef, link: '#' },
                { icon: <Linkedin />, ref: liRef, link: '#' },
                { icon: <Twitter />, ref: twRef, link: '#' },
                { icon: <Instagram />, ref: inRef, link: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  ref={social.ref}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-[#168BFF] hover:border-[#168BFF] transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* বটম সেকশন: কপিরাইট ও লিগ্যাল */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
          <p className="text-white/20 text-xs font-mono">
            © 2024 METAFORE TECHNOLOGIES. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-8">
            <Link to="/legal/privacy" className="text-white/20 hover:text-white text-xs uppercase tracking-widest transition-colors">
              {language === 'en' ? 'Privacy Policy' : 'প্রাইভেসি পলিসি'}
            </Link>
            <Link to="/legal/terms" className="text-white/20 hover:text-white text-xs uppercase tracking-widest transition-colors">
              {language === 'en' ? 'Terms & Conditions' : 'শর্তাবলী'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};