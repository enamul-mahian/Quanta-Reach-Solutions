// =========================================================================
// Quanta Reach Solutions - Top Information Bar
// =========================================================================

import React from 'react';
import { Mail, Phone, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Container } from '@/components/common/Container';

export const TopBar: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="bg-navy-surface border-b border-borderColor hidden lg:block py-2 relative z-50">
      <Container>
        <div className="flex justify-between items-center text-xs text-soft-gray font-medium">
          
          {/* বাম পাশ: কন্টাক্ট এবং অফিসের সময় */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-electric" />
              <span>{t.contact.businessHours}: 10:00 AM - 07:00 PM</span>
            </div>
            
            <a 
              href="mailto:hello@quantareach.solutions" 
              className="flex items-center space-x-2 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-electric" />
              <span>hello@quantareach.solutions</span>
            </a>
            
            <a 
              href="tel:+8801234567890" 
              className="flex items-center space-x-2 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-electric" />
              <span>+880 1234 567890</span>
            </a>
          </div>

          {/* ডান পাশ: ল্যাঙ্গুয়েজ সুইচার */}
          <div className="flex items-center space-x-3">
            <span className="uppercase tracking-wider opacity-70">Language:</span>
            <div className="flex items-center bg-navy rounded-full border border-borderColor p-0.5">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full transition-all duration-300 ${
                  language === 'en' 
                    ? 'bg-electric text-white shadow-premium' 
                    : 'hover:text-white'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 rounded-full transition-all duration-300 ${
                  language === 'bn' 
                    ? 'bg-electric text-white shadow-premium' 
                    : 'hover:text-white'
                }`}
                aria-label="Switch to Bengali"
              >
                বাংলা
              </button>
            </div>
          </div>
          
        </div>
      </Container>
    </div>
  );
};