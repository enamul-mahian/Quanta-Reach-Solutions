// =========================================================================
// MetaFore Technologies - Mobile App-like Bottom Navigation
// =========================================================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Grid, MessageSquare, PhoneCall } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const MobileBottomNav: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { name: t.navigation.home, path: '/', icon: <Home className="w-5 h-5" /> },
    { name: t.navigation.services, path: '/services', icon: <Briefcase className="w-5 h-5" /> },
    { name: t.navigation.portfolio, path: '/portfolio', icon: <Grid className="w-5 h-5" /> },
    { name: t.navigation.contact, path: '/contact', icon: <PhoneCall className="w-5 h-5" /> },
    { name: t.common.whatsappUs, path: 'https://wa.me/8801983398333', icon: <MessageSquare className="w-5 h-5" />, external: true },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-navy/90 backdrop-blur-md border-t border-borderColor shadow-[0_-10px_30px_rgba(7,20,38,0.5)]">
      {/* আইফোনের সেফ এরিয়া বটম হ্যান্ডেল করার জন্য স্টাইল */}
      <div 
        className="flex items-center justify-around px-2 py-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        {navItems.map((item, index) => {
          // বাহ্যিক লিংক (যেমন: হোয়াটসঅ্যাপ) হলে <a> ট্যাগ ব্যবহার করবে
          if (item.external) {
            return (
              <a
                key={index}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center space-y-1 text-soft-gray hover:text-electric transition-colors w-16"
              >
                {item.icon}
                <span className="text-[10px] font-medium text-center leading-tight">{item.name}</span>
              </a>
            );
          }

          // ওয়েবসাইটের ভেতরের লিংকের জন্য <NavLink> ব্যবহার করবে
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 transition-all duration-300 w-16 ${
                  isActive ? 'text-electric scale-110' : 'text-soft-gray hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="text-[10px] font-medium text-center leading-tight whitespace-nowrap">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};