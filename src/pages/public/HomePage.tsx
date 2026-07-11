import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../hooks/useLanguage';

// মেটাফোর প্রিমিয়াম সেকশন ইম্পোর্টসমূহ
import { Hero } from '../../components/home/Hero';
import { ServicesSection } from '../../components/home/ServicesSection';
import { PerspectiveVideoSection } from '../../components/home/PerspectiveVideoSection';
import { TestimonialsSection } from '../../components/home/TestimonialsSection';
import { ProcessSection } from '../../components/home/ProcessSection';

/**
 * METAFORE TECHNOLOGIES - HOME PAGE
 * হোমপেজ থেকে টিম সেকশন সরিয়ে শুধুমাত্র কোর সার্ভিস ও প্রসেস রাখা হয়েছে।
 */

export const HomePage: React.FC = () => {
  const { language } = useLanguage();

  // স্ক্রল পজিশন রিসেট (পেজ লোড হওয়ার সময়)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ল্যাঙ্গুয়েজ ভিত্তিক এসইও (SEO) কন্টেন্ট
  const seoData = {
    title: language === 'en' 
      ? 'MetaFore Technologies | Digital Solutions for Global Growth' 
      : 'মেটাফোর টেকনোলজিস | বৈশ্বিক প্রবৃদ্ধির জন্য ডিজিটাল সমাধান',
    description: language === 'en'
      ? 'Award-winning creative agency specializing in premium web development, AI solutions, and digital transformation for global and local clients.'
      : 'প্রিমিয়াম ওয়েব ডেভেলপমেন্ট, এআই সলিউশন এবং ডিজিটাল রূপান্তরে বিশেষজ্ঞ একটি পুরস্কারপ্রাপ্ত ক্রিয়েটিভ এজেন্সি।'
  };

  return (
    <main className="relative w-full bg-[#071426] overflow-x-hidden">
      {/* ১. ডাইনামিক এসইও হেড (React Helmet) */}
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
      </Helmet>

      {/* ২. লিকুইড টাইপোগ্রাফি হিরো সেকশন */}
      <Hero />

      {/* ৩. সার্ভিস সেকশন: Editorial List + Hover Visuals */}
      <ServicesSection />

      {/* ৪. সিনেমাটিক ভিডিও সেকশন: 3D Perspective Scroll */}
      <PerspectiveVideoSection />

      {/* ৫. টেস্টিমোনিয়াল সেকশন: Oversized Editorial Quotes */}
      <TestimonialsSection />

      {/* ৬. প্রসেস সেকশন: 10-Step Scroll-Driven Timeline */}
      <ProcessSection />
      
      {/* ফুটার রিভিল ইফেক্টের জন্য অতিরিক্ত স্পেসিং */}
      <div className="h-20 bg-transparent pointer-events-none" />
    </main>
  );
};