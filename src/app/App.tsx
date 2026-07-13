import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Preloader } from '../components/animations/Preloader';
import { PageTransition } from '../components/animations/PageTransition';
import { CustomCursor } from '../components/layout/CustomCursor';
import { AuthProvider } from '../contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-[#071426] text-white selection:bg-[#168BFF]/30 selection:text-white">
        {/* ১. সেশন-পারসিস্টেন্ট থ্রি-ডিজিট নিউমেরিক্যাল প্রিলোডার */}
        <Preloader />

        {/* ২. জিপিইউ-অপ্টিমাইজড ল্যাগ-ফ্রি কাস্টম কার্সার (মাউস ট্র্যাকিং) */}
        <CustomCursor />

        {/* ৩. ডাবল-প্যানেল মেটাল কার্টেইন পেজ ট্রানজিশন */}
        <PageTransition />

        {/* ৪. গ্লোবাল নোটিফিকেশন টোস্টার কন্টেইনার (কোয়ান্টা রিচ থিম ও ফন্ট এলাইনড) */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            className: 'quantareach-toast',
            duration: 4000,
            style: {
              background: '#0D1D33',
              color: '#FFFFFF',
              border: '1px solid rgba(22, 139, 255, 0.2)',
              borderRadius: '4px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              boxShadow: '0 10px 30px -10px rgba(7, 20, 38, 0.5)',
            },
            success: {
              iconTheme: {
                primary: '#168BFF',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF4B4B',
                secondary: '#FFFFFF',
              },
            },
          }}
        />

        {/* ৫. রিয়্যাক্ট রাউটার আউটিলেট (যা চাইল্ড পেজসমূহকে এখানে রেন্ডার করবে) */}
        <Outlet />
      </div>
    </AuthProvider>
  );
}