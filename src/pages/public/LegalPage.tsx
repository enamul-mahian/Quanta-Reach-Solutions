// =========================================================================
// MetaFore Technologies - Dynamic Legal Pages Component
// =========================================================================

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';

export const LegalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // সিমুলেশন: ভবিষ্যতে এটি Firestore থেকে ডাটা ফেচ করবে
  useEffect(() => {
    setLoading(true);
    // এখানে আমরা ডামি ডাটা দিয়েছি, ভবিষ্যতে Firestore query হবে
    const mockLegalData: any = {
      'privacy-policy': {
        title: { en: 'Privacy Policy', bn: 'প্রাইভেসি পলিসি' },
        body: { en: 'This privacy policy explains how MetaFore Technologies collects and uses your data...', bn: 'এই প্রাইভেসি পলিসি ব্যাখ্যা করে যে মেটাফোর টেকনোলজিস কীভাবে আপনার ডেটা সংগ্রহ এবং ব্যবহার করে...' }
      },
      'terms-and-conditions': {
        title: { en: 'Terms and Conditions', bn: 'শর্তাবলী' },
        body: { en: 'By using our services, you agree to these terms...', bn: 'আমাদের সার্ভিস ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলীর সাথে একমত পোষণ করছেন...' }
      },
      'refund-policy': {
        title: { en: 'Refund Policy', bn: 'রিফান্ড পলিসি' },
        body: { en: 'We strive for client satisfaction. Please review our refund criteria...', bn: 'আমরা ক্লায়েন্টদের সন্তুষ্টির জন্য কাজ করি। অনুগ্রহ করে আমাদের রিফান্ড ক্রাইটেরিয়াগুলো দেখুন...' }
      },
      'nda-and-confidentiality': {
        title: { en: 'NDA & Confidentiality', bn: 'এনডিএ এবং গোপনীয়তা' },
        body: { en: 'Your ideas are safe with us. We sign NDAs for all sensitive projects...', bn: 'আপনার আইডিয়া আমাদের কাছে নিরাপদ। সব স্পর্শকাতর প্রজেক্টের জন্য আমরা এনডিএ (NDA) স্বাক্ষর করি...' }
      }
    };

    const data = mockLegalData[slug || ''] || { 
      title: { en: 'Page Not Found', bn: 'পেজটি পাওয়া যায়নি' },
      body: { en: 'The requested page does not exist.', bn: 'অনুরোধকৃত পেজটি খুঁজে পাওয়া যায়নি।' }
    };
    
    setContent(data);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-soft-gray">
        {language === 'en' ? 'Loading...' : 'লোড হচ্ছে...'}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-navy py-24">
      <Helmet>
        <title>{language === 'en' ? content.title.en : content.title.bn} | MetaFore Technologies</title>
      </Helmet>

      <Container className="max-w-4xl">
        <div className="glass-panel p-8 md:p-12 rounded-2xl border-borderColor">
          <SectionHeading 
            title={language === 'en' ? content.title.en : content.title.bn}
            align="left"
            className="mb-8"
          />
          <div className={`prose prose-invert max-w-none text-soft-gray leading-relaxed ${language === 'bn' ? 'bn-text-safe' : ''}`}>
            <p>{language === 'en' ? content.body.en : content.body.bn}</p>
            {/* আরও বিস্তারিত কন্টেন্ট এখানে যুক্ত হবে যখন আমরা CMS কানেক্ট করব */}
            <p className="mt-8 text-sm italic opacity-70">
              {language === 'en' ? 'Last updated: July 10, 2026' : 'সর্বশেষ আপডেট: জুলাই ১০, ২০২৬'}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};