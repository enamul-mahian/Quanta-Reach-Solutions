// =========================================================================
// MetaFore Technologies - Featured Portfolio Section
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';

export const FeaturedPortfolio: React.FC = () => {
  const { t, language } = useLanguage();

  // পোর্টফোলিও প্রজেক্টের ডামি ডেটা (পরবর্তীতে ফায়ারবেস থেকে আসবে)
  const portfolioItems = [
    {
      id: 1,
      slug: 'global-fintech-dashboard',
      image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=800&auto=format&fit=crop',
      title: {
        en: 'Global FinTech Analytics Dashboard',
        bn: 'গ্লোবাল ফিনটেক অ্যানালিটিক্স ড্যাশবোর্ড'
      },
      category: {
        en: 'Web Application',
        bn: 'ওয়েব অ্যাপ্লিকেশন'
      },
      metric: {
        en: '+45% User Retention',
        bn: '+৪৫% ইউজার রিটেনশন'
      },
      clientType: 'Global'
    },
    {
      id: 2,
      slug: 'enterprise-ecommerce-app',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      title: {
        en: 'Enterprise E-commerce Platform',
        bn: 'এন্টারপ্রাইজ ই-কমার্স প্ল্যাটফর্ম'
      },
      category: {
        en: 'Mobile & Web App',
        bn: 'মোবাইল ও ওয়েব অ্যাপ'
      },
      metric: {
        en: '3x Sales Growth',
        bn: '৩ গুণ সেলস বৃদ্ধি'
      },
      clientType: 'Local'
    }
  ];

  return (
    <section className="py-24 bg-navy-surface relative border-t border-borderColor">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading 
            badge={t.navigation.portfolio}
            title={language === 'en' ? 'Our Featured Work' : 'আমাদের কিছু সেরা কাজ'}
            subtitle={language === 'en' 
              ? 'Explore how we have helped businesses scale and succeed through innovative digital solutions.' 
              : 'দেখুন কীভাবে আমরা আধুনিক ডিজিটাল সমাধানের মাধ্যমে বিভিন্ন ব্যবসাকে সফল হতে সাহায্য করেছি।'}
            align="left"
            className="mb-0" // ওভাররাইড করে মার্জিন জিরো করা হলো কারণ আমরা কাস্টম ফ্লেক্স লেআউট ব্যবহার করছি
          />
          
          <div className="hidden md:block shrink-0 pb-4">
            <Link to="/portfolio">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t.common.seeAll}
              </Button>
            </Link>
          </div>
        </div>

        {/* পোর্টফোলিও কার্ড গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {portfolioItems.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden glass-panel border-borderColor hover:border-electric/50 transition-colors duration-500">
              
              {/* ইমেইজ কন্টেইনার */}
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src={item.image} 
                  alt={language === 'en' ? item.title.en : item.title.bn}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                {/* ট্যাগস */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-navy/80 text-white backdrop-blur-md border border-white/10">
                    {language === 'en' ? item.category.en : item.category.bn}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md border border-white/10 ${
                    item.clientType === 'Global' ? 'bg-electric/80 text-white' : 'bg-purple-accent/80 text-white'
                  }`}>
                    {item.clientType} Client
                  </span>
                </div>
              </div>

              {/* কন্টেন্ট এরিয়া */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-electric transition-colors">
                  {language === 'en' ? item.title.en : item.title.bn}
                </h3>
                
                {/* সাকসেস মেট্রিক্স */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-electric/10 border border-electric/20 text-electric-bright mb-6">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {language === 'en' ? item.metric.en : item.metric.bn}
                  </span>
                </div>

                <div className="pt-6 border-t border-borderColor flex justify-between items-center">
                  <Link 
                    to={`/portfolio/${item.slug}`}
                    className="inline-flex items-center text-soft-gray hover:text-white font-medium transition-colors"
                  >
                    {t.common.readMore}
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to={`/portfolio/${item.slug}`}
                    className="w-10 h-10 rounded-full bg-navy-surface border border-borderColor flex items-center justify-center text-soft-gray hover:text-white hover:bg-electric hover:border-electric transition-all"
                    aria-label="View Project Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* মোবাইল ভিউয়ের জন্য See All বাটন */}
        <div className="mt-10 md:hidden text-center">
          <Link to="/portfolio">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t.common.seeAll}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};