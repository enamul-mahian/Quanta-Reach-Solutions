// =========================================================================
// MetaFore Technologies - 404 Not Found Page
// =========================================================================

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full min-h-screen bg-navy flex items-center justify-center relative overflow-hidden py-20">
      <Helmet>
        <title>404 | MetaFore Technologies</title>
      </Helmet>

      {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Container className="relative z-10 text-center">
        <div className="glass-panel p-12 rounded-3xl border-borderColor max-w-2xl mx-auto">
          <h1 className="text-[120px] md:text-[160px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-electric to-purple-accent leading-none mb-6">
            404
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t.common.notFound}
          </h2>
          
          <p className="text-soft-gray text-lg mb-10 max-w-md mx-auto">
            {t.common.goBack === 'Go Back' 
              ? 'Oops! The page you are looking for does not exist or has been moved.' 
              : 'দুঃখিত! আপনি যে পেজটি খুঁজছেন তা খুঁজে পাওয়া যায়নি বা এটি সরিয়ে ফেলা হয়েছে।'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <Button size="lg" leftIcon={<Home className="w-5 h-5" />}>
                {t.navigation.home}
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="lg" 
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              onClick={() => window.history.back()}
            >
              {t.common.goBack}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};