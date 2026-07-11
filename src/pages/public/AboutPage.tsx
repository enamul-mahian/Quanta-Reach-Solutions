// =========================================================================
// MetaFore Technologies - About Us Page (Premium Animated Edition)
// =========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shield, Target, Zap, Globe2, Users, Trophy, ArrowRight, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/hooks/useLanguage';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import { splitTextBilingual } from '@/lib/motion'; // isReducedMotion ইম্পোর্ট রিমুভ করা হয়েছে

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  // অ্যানিমেশনের জন্য রিফ সেটআপ
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const storyImageRef = useRef<HTMLDivElement>(null);
  const storyTextRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const teamContainerRef = useRef<HTMLDivElement>(null);
  const valuesContainerRef = useRef<HTMLDivElement>(null);

  // টিম মেম্বারদের ডেটা
  const teamMembers = [
    {
      id: '01',
      name: { en: 'Arnab Sharkar', bn: 'অর্ণব সরকার' },
      role: { en: 'Lead Solutions Architect', bn: 'লিড সলিউশন আর্কিটেক্ট' },
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      bio: { en: 'Expert in scalable architecture with 5+ years of experience.', bn: 'স্কেলেবল আর্কিটেকচারে ৫+ বছরের অভিজ্ঞতাসম্পন্ন এক্সপার্ট।' },
      skills: ['React', 'Node.js', 'Firebase']
    },
    {
      id: '02',
      name: { en: 'Sifatullah Khan', bn: 'সিফাতুল্লাহ খান' },
      role: { en: 'Senior Creative Designer', bn: 'সিনিয়র ক্রিয়েটিভ ডিজাইনার' },
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      bio: { en: 'Passionate about creating immersive digital experiences.', bn: 'ইমার্সিভ ডিজিটাল অভিজ্ঞতা তৈরিতে উৎসাহী।' },
      skills: ['UI/UX', 'Three.js', 'Figma']
    },
    {
      id: '03',
      name: { en: 'Tanvir Ahmed', bn: 'তানভীর আহমেদ' },
      role: { en: 'Full Stack Developer', bn: 'ফুল স্ট্যাক ডেভেলপার' },
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600',
      bio: { en: 'Solving complex problems through clean and efficient code.', bn: 'ক্লিন এবং ইফিশিয়েন্ট কোডের মাধ্যমে জটিল সমস্যার সমাধান করেন।' },
      skills: ['Python', 'Cloud Architecture', 'React']
    }
  ];

  // About পেজের কন্টেন্ট (ইংরেজি এবং বাংলা)
  const content = {
    heroTitle: language === 'en' ? 'Driving Digital Transformation Globally' : 'বিশ্বজুড়ে ডিজিটাল রূপান্তরের নেতৃত্ব',
    heroSubtitle: language === 'en' 
      ? 'MetaFore Technologies is a premium digital agency committed to delivering innovative, scalable, and secure technology solutions for businesses of all sizes.' 
      : 'মেটাফোর টেকনোলজিস একটি প্রিমিয়াম ডিজিটাল এজেন্সি, যা যেকোনো আকারের ব্যবসার জন্য উদ্ভাবনী, স্কেলেবল এবং সুরক্ষিত প্রযুক্তি সমাধান প্রদানে প্রতিশ্রুতিবদ্ধ।',
    ourStoryTitle: language === 'en' ? 'Our Brand Means Trust' : 'আমাদের ব্র্যান্ড মানেই বিশ্বাস',
    ourStoryText1: language === 'en'
      ? 'Founded with a vision to bridge the gap between complex technology and business growth, MetaFore Technologies has grown into a trusted partner for both local enterprises in Bangladesh and global startups.'
      : 'জটিল প্রযুক্তি এবং ব্যবসায়িক প্রবৃদ্ধির মধ্যে সেতুবন্ধন তৈরির লক্ষ্য নিয়ে প্রতিষ্ঠিত মেটাফোর টেকনোলজিস আজ বাংলাদেশের স্থানীয় প্রতিষ্ঠান এবং গ্লোবাল স্টার্টআপদের একটি বিশ্বস্ত পার্টনার।',
    ourStoryText2: language === 'en'
      ? 'We don’t just build software; we build future-oriented digital ecosystems. From deep requirement analysis to flawless execution and long-term support, we ensure your investment yields exponential returns.'
      : 'আমরা শুধু সফটওয়্যারই তৈরি করি না; আমরা ভবিষ্যতের উপযোগী ডিজিটাল ইকোসিস্টেম তৈরি করি। প্রজেক্টের গভীর বিশ্লেষণ থেকে শুরু করে নিখুঁত বাস্তবায়ন এবং দীর্ঘমেয়াদী সাপোর্ট—আমরা নিশ্চিত করি আপনার বিনিয়োগ যেন সর্বোচ্চ ফলাফল নিয়ে আসে।'
  };

  const coreValues = [
    {
      id: 1,
      icon: <Shield className="w-6 h-6 text-[#168BFF]" />,
      title: language === 'en' ? 'Trust & Transparency' : 'বিশ্বাস ও স্বচ্ছতা',
      desc: language === 'en' 
        ? 'Clear communication, honest pricing, and strict adherence to NDAs.' 
        : 'স্বচ্ছ যোগাযোগ, সাশ্রয়ী মূল্য এবং এনডিএ (NDA) এর কঠোর অনুসরণ।'
    },
    {
      id: 2,
      icon: <Target className="w-6 h-6 text-[#9C5CFF]" />,
      title: language === 'en' ? 'Result-Oriented' : 'ফলাফলমুখী',
      desc: language === 'en' 
        ? 'Every line of code and design choice is aimed at maximizing your ROI.' 
        : 'আমাদের প্রতিটি কোড এবং ডিজাইন আপনার ব্যবসায়িক সাফল্য বৃদ্ধির লক্ষ্যে তৈরি।'
    },
    {
      id: 3,
      icon: <Zap className="w-6 h-6 text-[#36A3FF]" />,
      title: language === 'en' ? 'Innovation First' : 'উদ্ভাবনে অগ্রাধিকার',
      desc: language === 'en' 
        ? 'Leveraging the latest tech stack like React, Node, and AI to keep you ahead.' 
        : 'আপনাকে এগিয়ে রাখতে রিঅ্যাক্ট, এআই (AI) এর মতো সর্বাধুনিক প্রযুক্তির ব্যবহার।'
    },
    {
      id: 4,
      icon: <Globe2 className="w-6 h-6 text-[#168BFF]" />,
      title: language === 'en' ? 'Global Standards' : 'বিশ্বমানের গুণগত মান',
      desc: language === 'en' 
        ? 'Maintaining international quality assurance and seamless cross-border collaboration.' 
        : 'আন্তর্জাতিক মান নিয়ন্ত্রণ এবং বিদেশি ক্লায়েন্টদের সাথে নিরবচ্ছিন্ন যোগাযোগ।'
    }
  ];

  const stats = [
    { icon: <Trophy className="w-6 h-6" />, targetValue: 5, suffix: '+', label: language === 'en' ? 'Years Experience' : 'বছরের অভিজ্ঞতা' },
    { icon: <Users className="w-6 h-6" />, targetValue: 50, suffix: '+', label: language === 'en' ? 'Expert Team' : 'দক্ষ কর্মী' },
    { icon: <Zap className="w-6 h-6" />, targetValue: 200, suffix: '+', label: language === 'en' ? 'Projects Delivered' : 'প্রজেক্ট ডেলিভারি' },
    { icon: <Globe2 className="w-6 h-6" />, targetValue: 15, suffix: '+', label: language === 'en' ? 'Countries Served' : 'দেশে সেবা প্রদান' },
  ];

  // GSAP অ্যানিমেশন ইন্টিগ্রেশন
  useEffect(() => {
    const ctx = gsap.context(() => {
      // holds isReducedMotion check removed to guarantee animations run!

      // ১. হিরো টাইটেল মাস্ক রিভিল (টাইপসেফ কাস্টিং)
      const heroTitle = heroTitleRef.current;
      if (heroTitle) {
        const headlineText = heroTitle.querySelector('h2') as HTMLElement | null;
        if (headlineText) {
          const splitData = splitTextBilingual(
            headlineText.innerText,
            language === 'en' ? 'chars' : 'words',
            language
          );

          headlineText.innerHTML = splitData.items
            .map(item => `<span class="inline-block overflow-hidden py-1"><span class="hero-reveal inline-block">${item === ' ' ? '&nbsp;' : item}</span></span>`)
            .join(language === 'en' ? '' : ' ');

          const revealItems = headlineText.querySelectorAll('.hero-reveal');

          const heroTl = gsap.timeline();
          heroTl.fromTo(revealItems,
            { yPercent: 100, rotateX: 45, opacity: 0 },
            { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.02, ease: 'power4.out' }
          );
        }
      }

      // ২. আওয়ার স্টোরি ইমেজ ও টেক্সট রিভিল
      if (storyImageRef.current && storyTextRef.current) {
        gsap.fromTo(storyImageRef.current,
          { opacity: 0, scale: 0.9, x: -50 },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: storyImageRef.current,
              start: 'top 80%',
            }
          }
        );

        gsap.fromTo(storyTextRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: storyTextRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // ৩. টিম কার্ডস স্ট্যাগারড এন্ট্রি
      const teamCards = teamContainerRef.current?.querySelectorAll('.team-card');
      if (teamCards) {
        gsap.fromTo(teamCards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: teamContainerRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // ৪. সংখ্যাবাচক পরিসংখ্যান অ্যানিমেশন (Interactive Digital Count-up)
      const statNumbers = statsContainerRef.current?.querySelectorAll('.stat-number');
      if (statNumbers) {
        statNumbers.forEach((el) => {
          const htmlEl = el as HTMLElement; // টাইপসেফ কাস্টিং
          const target = parseInt(htmlEl.getAttribute('data-target') || '0', 10);
          const obj = { val: 0 };
          
          gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: htmlEl,
              start: 'top 85%',
            },
            onUpdate: () => {
              htmlEl.innerText = Math.floor(obj.val).toString();
            }
          });
        });
      }

      // ৫. কোর ভ্যালুজ কার্ড এন্ট্রি
      const valueCards = valuesContainerRef.current?.querySelectorAll('.value-card');
      if (valueCards) {
        gsap.fromTo(valueCards,
          { opacity: 0, scale: 0.95, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: valuesContainerRef.current,
              start: 'top 80%',
            }
          }
        );
      }

    }, pageContainerRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <div ref={pageContainerRef} className="w-full flex flex-col bg-[#071426]">
      <Helmet>
        <title>{t.navigation.about} | MetaFore Technologies</title>
        <meta name="description" content={content.heroSubtitle} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#168BFF]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <Container className="relative z-10 text-center max-w-4xl">
          <div ref={heroTitleRef}>
            <SectionHeading 
              badge={t.navigation.about}
              title={content.heroTitle}
              subtitle={content.heroSubtitle}
              className="mx-auto"
            />
          </div>
        </Container>
      </section>

      {/* Our Story & Mission Section */}
      <section className="py-20 lg:py-28 relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* এনিমেটেড স্টোরি ইমেজ */}
            <div ref={storyImageRef} className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#168BFF] to-[#9C5CFF] opacity-20 blur-xl rounded-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" 
                alt="MetaFore Team" 
                className="relative z-10 w-full rounded-2xl border border-white/10 shadow-2xl object-cover h-[400px]"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#0D1D33]/90 backdrop-blur-md p-6 rounded-2xl border border-[#168BFF]/30 z-20 hidden md:block">
                <div className="text-4xl font-extrabold text-white mb-1">100%</div>
                <div className="text-white/60 text-sm">{language === 'en' ? 'Client Satisfaction' : 'ক্লায়েন্ট সন্তুষ্টি'}</div>
              </div>
            </div>

            {/* এনিমেটেড স্টোরি টেক্সট */}
            <div ref={storyTextRef} className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                {content.ourStoryTitle}
              </h2>
              <div className="space-y-6">
                <p className={`text-white/60 text-lg leading-relaxed ${language === 'bn' ? 'leading-loose' : ''}`}>
                  {content.ourStoryText1}
                </p>
                <p className={`text-white/60 text-lg leading-relaxed ${language === 'bn' ? 'leading-loose' : ''}`}>
                  {content.ourStoryText2}
                </p>
              </div>
              
              <div className="mt-10 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-white/80">
                  <Shield className="w-5 h-5 text-[#168BFF]" />
                  <span className="font-medium text-sm uppercase tracking-wider">{language === 'en' ? 'Secure Development' : 'সুরক্ষিত ডেভেলপমেন্ট'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Zap className="w-5 h-5 text-[#9C5CFF]" />
                  <span className="font-medium text-sm uppercase tracking-wider">{language === 'en' ? 'Fast Delivery' : 'দ্রুত ডেলিভারি'}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Team Section */}
      <section className="py-20 lg:py-28 relative bg-[#0D1D33]/30">
        <Container>
          <SectionHeading title={language === 'en' ? 'Our Expert Team' : 'আমাদের বিশেষজ্ঞ টিম'} />
          <div ref={teamContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                onClick={() => setSelectedMember(member)}
                className="team-card bg-[#071426] p-6 rounded-2xl border border-white/10 cursor-pointer hover:border-[#168BFF] transition-all duration-300 group"
              >
                <img src={member.image} alt={member.name.en} className="w-full h-64 object-cover rounded-xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500" />
                <h3 className="text-xl font-bold text-white">{language === 'en' ? member.name.en : member.name.bn}</h3>
                <p className="text-[#168BFF]">{language === 'en' ? member.role.en : member.role.bn}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
          <div className="bg-[#071426] p-10 rounded-3xl border border-white/10 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 text-white hover:text-[#168BFF]"><X /></button>
            <img src={selectedMember.image} alt="Profile" className="w-32 h-32 rounded-full mb-6 mx-auto object-cover border-2 border-[#168BFF]" />
            <h2 className="text-2xl font-bold text-white text-center">{language === 'en' ? selectedMember.name.en : selectedMember.name.bn}</h2>
            <p className="text-[#168BFF] text-center mb-6">{language === 'en' ? selectedMember.role.en : selectedMember.role.bn}</p>
            <p className="text-white/60 text-center mb-8">{language === 'en' ? selectedMember.bio.en : selectedMember.bio.bn}</p>
            <div className="flex justify-center gap-2">
              {selectedMember.skills.map((s: string) => <span key={s} className="bg-[#168BFF]/10 text-[#168BFF] px-4 py-1 rounded-full text-xs">{s}</span>)}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section - Featuring Live Count-up Animations */}
      <section className="py-20 bg-[#0D1D33] border-y border-white/5 relative overflow-hidden">
        <Container className="relative z-10">
          <div ref={statsContainerRef} className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl bg-[#168BFF]/10 flex items-center justify-center text-[#168BFF] mb-6 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter flex items-center">
                  <span className="stat-number" data-target={stat.targetValue}>0</span>
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-white/40 font-bold text-xs uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Core Values Section - Staggered Entrances */}
      <section className="py-24 lg:py-32 relative">
        <Container>
          <SectionHeading 
            title={language === 'en' ? 'Our Core Values' : 'আমাদের মূল আদর্শ'}
            subtitle={language === 'en' 
              ? 'The foundational principles that guide our work and our relationship with you.' 
              : 'যে নীতিগুলোর ওপর ভিত্তি করে আমাদের কাজের পরিবেশ এবং ক্লায়েন্টদের সাথে আমাদের সম্পর্ক গড়ে ওঠে।'}
          />

          <div ref={valuesContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {coreValues.map((value) => (
              <div key={value.id} className="value-card bg-[#0D1D33]/50 backdrop-blur-sm p-10 rounded-3xl flex flex-col items-start gap-6 border border-white/5 hover:border-[#168BFF]/30 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-[#071426] border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#168BFF] group-hover:text-white transition-all duration-500">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className={`text-white/50 leading-relaxed text-lg ${language === 'bn' ? 'leading-loose' : ''}`}>
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#168BFF] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        <Container className="relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase">
            {language === 'en' ? 'Ready to Transform?' : 'পরিবর্তনের জন্য প্রস্তুত?'}
          </h2>
          <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto font-medium">
            {language === 'en' 
              ? 'Join hands with MetaFore Technologies and let’s build a digital solution that drives real growth.' 
              : 'মেটাফোর টেকনোলজিসের সাথে যুক্ত হোন এবং তৈরি করুন এমন একটি ডিজিটাল সলিউশন যা সত্যিকারের প্রবৃদ্ধি আনে।'}
          </p>
          <div className="flex justify-center">
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-white !text-[#168BFF] font-black uppercase tracking-widest px-12 py-6 rounded-full hover:bg-gray-100 shadow-2xl transition-all hover:scale-105 active:scale-95" 
                rightIcon={<ArrowRight className="w-6 h-6 !text-[#168BFF]" />}
              >
                {language === 'en' ? 'Contact Us Now' : 'যোগাযোগ করুন'}
              </Button>
            </Link>
          </div>
        </Container>
      </section>

    </div>
  );
};