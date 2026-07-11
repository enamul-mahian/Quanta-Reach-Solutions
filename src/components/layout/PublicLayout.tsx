import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-[#071426]">
      {/* ১. টপ বার (সব পেজের জন্য) */}
      <TopBar />

      {/* ২. প্রিমিয়াম গ্লাস হেডফোন (Sticky) */}
      <Header />
      
      {/* ৩. মেইন কন্টেন্ট এরিয়া */}
      {/* 
          এখানে absolute পজিশনিং এবং framer-motion সরিয়ে ফেলা হয়েছে। 
          এখন এটি স্ট্যান্ডার্ড ভার্টিকাল ফ্লো অনুসরণ করবে যা GSAP ScrollTrigger এর জন্য অত্যাবশ্যক।
      */}
      <main className="flex-grow flex flex-col relative">
        <div className="w-full">
          <Outlet />
        </div>

        {/* 
           ফুটার ইন্টিগ্রেশন: 
           হোমপেজ অলরেডি তার নিজের ভেতরে ফুটার রিভিল ইফেক্ট হ্যান্ডেল করছে, 
           তাই হোমপেজ বাদে বাকি পেজগুলোতে সাধারণ ফুটার দেখানো হবে।
        */}
        {!isHomePage && <Footer />}
      </main>
      
      {/* ৪. মোবাইল বটম নেভিগেশন */}
      <MobileBottomNav />
    </div>
  );
};