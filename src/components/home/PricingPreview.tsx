// =========================================================================
// MetaFore Technologies - Home Page Pricing Preview Section
// =========================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';

export const PricingPreview: React.FC = () => {
  const { t, language } = useLanguage();
  // ডিফল্টভাবে Local ক্লায়েন্ট সিলেক্ট করা থাকবে
  const [clientType, setClientType] = useState<'local' | 'global'>('local');

  // ডামি প্রাইসিং ডেটা (পরবর্তীতে ফায়ারবেস থেকে ডায়নামিক করা হবে)
  const pricingPlans = {
    local: [
      {
        id: 'local-1',
        name: { en: 'Corporate Website', bn: 'কর্পোরেট ওয়েবসাইট' },
        price: '৳ ২৫,০০০',
        description: { en: 'Perfect for small businesses and agencies.', bn: 'ছোট ব্যবসা এবং এজেন্সির জন্য পারফেক্ট।' },
        isPopular: false,
        features: {
          en: ['Up to 10 Pages', 'Mobile Responsive', 'Contact Form', '1 Month Free Support', 'Bangla Consultation'],
          bn: ['সর্বোচ্চ ১০টি পেজ', 'মোবাইল রেস্পন্সিভ', 'কন্টাক্ট ফর্ম', '১ মাসের ফ্রি সাপোর্ট', 'বাংলায় কনসালটেশন']
        }
      },
      {
        id: 'local-2',
        name: { en: 'E-commerce Platform', bn: 'ই-কমার্স প্ল্যাটফর্ম' },
        price: '৳ ৫০,০০০',
        description: { en: 'Complete online store with payment gateway.', bn: 'পেমেন্ট গেটওয়ে সহ সম্পূর্ণ অনলাইন স্টোর।' },
        isPopular: true,
        features: {
          en: ['Unlimited Products', 'Payment Gateway Integration', 'Admin Dashboard', '3 Months Free Support', 'Flexible Installments'],
          bn: ['আনলিমিটেড প্রোডাক্ট', 'পেমেন্ট গেটওয়ে ইন্টিগ্রেশন', 'অ্যাডমিন ড্যাশবোর্ড', '৩ মাসের ফ্রি সাপোর্ট', 'সহজ কিস্তির সুবিধা']
        }
      }
    ],
    global: [
      {
        id: 'global-1',
        name: { en: 'Business MVP', bn: 'বিজনেস এমভিপি (MVP)' },
        price: '$999',
        description: { en: 'Best for startups validating their idea.', bn: 'স্টার্টআপদের আইডিয়া যাচাইয়ের জন্য সেরা।' },
        isPopular: false,
        features: {
          en: ['Custom UI/UX Design', 'Frontend Development', 'Basic Backend API', 'Strict NDA', 'Dedicated Project Manager'],
          bn: ['কাস্টম UI/UX ডিজাইন', 'ফ্রন্টএন্ড ডেভেলপমেন্ট', 'বেসিক ব্যাকএন্ড এপিআই', 'কঠোর এনডিএ (NDA)', 'ডেডিকেটেড প্রজেক্ট ম্যানেজার']
        }
      },
      {
        id: 'global-2',
        name: { en: 'Custom Web App', bn: 'কাস্টম ওয়েব অ্যাপ' },
        price: '$2,499',
        description: { en: 'Scalable SaaS or Enterprise web applications.', bn: 'স্কেলেবল স্যাস (SaaS) বা এন্টারপ্রাইজ ওয়েব অ্যাপ্লিকেশন।' },
        isPopular: true,
        features: {
          en: ['Full-stack Development', 'Cloud Deployment', 'Advanced Security', 'Fluent English Support', 'Flexible Time Zone'],
          bn: ['ফুল-স্ট্যাক ডেভেলপমেন্ট', 'ক্লাউড ডেপ্লয়মেন্ট', 'অ্যাডভান্সড সিকিউরিটি', 'প্রফেশনাল ইংরেজি সাপোর্ট', 'ফ্লেক্সিবল টাইম জোন']
        }
      }
    ]
  };

  const currentPlans = pricingPlans[clientType];

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Container className="relative z-10">
        <SectionHeading 
          badge={t.navigation.pricing}
          title={language === 'en' ? 'Transparent & Flexible Pricing' : 'স্বচ্ছ এবং সাশ্রয়ী প্রাইসিং'}
          subtitle={language === 'en' 
            ? 'Choose a plan that fits your business needs. No hidden charges, just quality delivery.' 
            : 'আপনার ব্যবসার প্রয়োজন অনুযায়ী সঠিক প্ল্যানটি বেছে নিন। কোনো লুকানো চার্জ নেই, শুধুমাত্র মানসম্মত কাজ।'}
        />

        {/* টগল বাটন (Local vs Global) */}
        <div className="flex justify-center mb-16">
          <div className="bg-navy-surface p-1.5 rounded-full border border-borderColor inline-flex relative shadow-glass">
            <button
              onClick={() => setClientType('local')}
              className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                clientType === 'local' ? 'text-white' : 'text-soft-gray hover:text-white'
              }`}
            >
              {language === 'en' ? 'Local Clients (BDT)' : 'লোকাল ক্লায়েন্ট (BDT)'}
            </button>
            <button
              onClick={() => setClientType('global')}
              className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                clientType === 'global' ? 'text-white' : 'text-soft-gray hover:text-white'
              }`}
            >
              {language === 'en' ? 'Global Clients (USD)' : 'গ্লোবাল ক্লায়েন্ট (USD)'}
            </button>
            
            {/* এক্টিভ স্লাইডার এনিমেশন */}
            <div 
              className={`absolute top-1.5 bottom-1.5 rounded-full bg-electric transition-all duration-300 ease-in-out shadow-premium`}
              style={{
                left: clientType === 'local' ? '6px' : '50%',
                width: 'calc(50% - 6px)',
              }}
            ></div>
          </div>
        </div>

        {/* প্রাইসিং কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {currentPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative glass-panel p-8 md:p-10 rounded-2xl flex flex-col transition-transform duration-300 hover:-translate-y-2 ${
                plan.isPopular ? 'border-electric shadow-[0_0_30px_rgba(22,139,255,0.15)]' : 'border-borderColor'
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-electric-bright to-electric text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-premium">
                  {language === 'en' ? 'Most Popular' : 'সবচেয়ে জনপ্রিয়'}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {language === 'en' ? plan.name.en : plan.name.bn}
                </h3>
                <p className={`text-soft-gray text-sm ${language === 'bn' ? 'bn-text-safe' : ''}`}>
                  {language === 'en' ? plan.description.en : plan.description.bn}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-soft-gray text-sm font-medium uppercase tracking-wider mb-1 block">
                  {t.pricing.startingAt}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-white">
                    {plan.price}
                  </span>
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {(language === 'en' ? plan.features.en : plan.features.bn).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-electric shrink-0 mt-0.5" />
                      <span className="text-soft-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/request-quote" className="mt-auto">
                <Button 
                  variant={plan.isPopular ? 'primary' : 'secondary'} 
                  fullWidth
                >
                  {t.common.requestQuote}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/pricing">
            <Button variant="ghost" rightIcon={<ArrowRight className="w-5 h-5" />}>
              {language === 'en' ? 'View Full Pricing Options' : 'সবগুলো প্রাইসিং অপশন দেখুন'}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};