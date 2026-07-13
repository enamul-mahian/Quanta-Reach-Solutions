import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  LockKeyhole,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// ট্রান্সলেশন ডিকশনারি
const t = {
  en: {
    welcomeBack: 'Welcome Back',
    portalSubtitle: 'Access the Quanta Reach operational command center.',
    emailLabel: 'Email Address',
    passwordLabel: 'Secure Password',
    forgotPassword: 'Forgot Password?',
    signInBtn: 'Sign In to Portal',
    recovering: 'Sending Reset Link...',
    signingIn: 'Authenticating...',
    backToSignIn: 'Back to Sign In',
    recoverTitle: 'Recover Password',
    recoverSubtitle: 'Enter your email to receive a password reset link.',
    sendResetLink: 'Send Recovery Email',
    errorInvalid: 'Invalid email or password. Please try again.',
    resetSuccess: 'Password reset link sent to your email!',
    brandQuote: 'Accelerating digital evolution through cutting-edge engineering.',
    brandSub: 'Quanta Reach client & management workstation.'
  },
  bn: {
    welcomeBack: 'স্বাগতম',
    portalSubtitle: 'কোয়ান্টা রিচ অপারেশনাল কমান্ড সেন্টারে প্রবেশ করুন।',
    emailLabel: 'ইমেইল অ্যাড্রেস',
    passwordLabel: 'নিরাপদ পাসওয়ার্ড',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    signInBtn: 'পোর্টালে প্রবেশ করুন',
    recovering: 'রিসেট লিংক পাঠানো হচ্ছে...',
    signingIn: 'যাচাই করা হচ্ছে...',
    backToSignIn: 'লগইন পেজে ফিরে যান',
    recoverTitle: 'পাসওয়ার্ড পুনরুদ্ধার',
    recoverSubtitle: 'পাসওয়ার্ড রিসেট লিংক পেতে আপনার ইমেইলটি লিখুন।',
    sendResetLink: 'রিকভারি ইমেইল পাঠান',
    errorInvalid: 'ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।',
    resetSuccess: 'পাসওয়ার্ড রিসেট লিংকটি আপনার ইমেইলে পাঠানো হয়েছে!',
    brandQuote: 'অত্যাধুনিক প্রযুক্তির মাধ্যমে ডিজিটাল বিবর্তনকে তরান্বিত করা।',
    brandSub: 'কোয়ান্টা রিচ ক্লায়েন্ট ও ম্যানেজমেন্ট ওয়ার্কস্টেশন।'
  }
};

export const LoginPage: React.FC = () => {
  const { language } = useLanguage();
  const currentLang = language === 'bn' ? 'bn' : 'en';
  
  const { login, resetPassword, currentUser, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // স্টেট ম্যানেজমেন্ট
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // অটোমেটিক রিডাইরেক্ট লজিক (রোল রিট্রিভ হওয়ার সাথে সাথে ড্যাশবোর্ডে পাঠাবে)
  useEffect(() => {
    if (currentUser && role) {
      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        // রোল অনুযায়ী রিডাইরেক্ট করা হচ্ছে
        if (role === 'admin' || role === 'super-admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (role === 'client') {
          navigate('/client/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    }
  }, [currentUser, role, navigate, location]);

  // GSAP মাউন্ট অ্যানিমেশন
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.login-panel-brand',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
      );
      gsap.fromTo('.login-form-card',
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [view]);

  // লগইন ফর্ম সাবমিশন
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success(currentLang === 'bn' ? 'লগইন সফল হয়েছে!' : 'Authenticated successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(t[currentLang].errorInvalid);
    } finally {
      setLoading(false);
    }
  };

  // পাসওয়ার্ড রিসেট সাবমিশন
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await resetPassword(email);
      toast.success(t[currentLang].resetSuccess);
      setView('login');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error sending recovery email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#071426] flex items-center justify-center relative overflow-hidden px-4 py-12"
    >
      {/* ব্যাকগ্রাউন্ড ডেকোরেটিভ গ্লো */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#168BFF]/5 filter blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7457FF]/5 filter blur-[120px] rounded-full pointer-events-none" />

      {/* স্প্লিট কন্টেইনার */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-[#0a1d37]/40 border border-white/[0.04] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md relative z-10 min-h-[600px]">
        
        {/* বাম পাশ: ব্র্যান্ড ওভারভিউ প্যানে panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0a1d37]/80 to-[#071426] p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.04] relative overflow-hidden">
          {/* গ্লো ইফেক্ট */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#168BFF]/10 filter blur-[60px] rounded-full" />
          
          <div className="login-panel-brand relative z-10">
            {/* ব্র্যান্ড লোগো */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#168BFF] to-[#7457FF] flex items-center justify-center font-bold text-xl shadow-[0_0_20px_#168BFF]">
                Q
              </div>
              <div>
                <h2 className="font-bold text-lg leading-none tracking-tight">Quanta Reach</h2>
                <span className="text-[9px] font-mono tracking-widest text-[#168BFF] uppercase">Solutions</span>
              </div>
            </div>

            {/* স্লোগান এবং কুওট */}
            <h3 className="text-xl md:text-2xl font-bold leading-snug tracking-tight text-white mb-4">
              {t[currentLang].brandQuote}
            </h3>
            <p className="text-xs text-white/40 leading-relaxed max-w-xs font-light">
              {t[currentLang].brandSub}
            </p>
          </div>

          <div className="relative z-10 text-[10px] font-mono text-white/20 tracking-wider uppercase mt-8 lg:mt-0">
            © 2026 Quanta Reach. All Rights Reserved.
          </div>
        </div>

        {/* ডান পাশ: ইন্টারেক্টিভ গ্লাস ফর্ম কার্ড */}
        <div className="lg:col-span-7 p-8 md:p-14 flex items-center justify-center">
          
          {view === 'login' ? (
            /* ১. সাইন-ইন ফর্ম */
            <div className="login-form-card w-full max-w-md space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
                  {t[currentLang].welcomeBack}
                </h1>
                <p className="text-xs text-white/40 leading-relaxed font-light">
                  {t[currentLang].portalSubtitle}
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* ইমেইল ফিল্ড */}
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                    {t[currentLang].emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@quantareach.solutions"
                      className="w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl pl-10 pr-4 py-3 text-xs transition-colors text-white"
                    />
                  </div>
                </div>

                {/* পাসওয়ার্ড ফিল্ড */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-white/40 uppercase">
                      {t[currentLang].passwordLabel}
                    </label>
                    <button 
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-[11px] font-medium text-[#168BFF] hover:text-[#168BFF]/80 transition-colors"
                    >
                      {t[currentLang].forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl pl-10 pr-11 py-3 text-xs transition-colors text-white"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-white/30 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* সাবমিট বাটন */}
                <button 
                  type="submit"
                  disabled={loading || authLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#168BFF] hover:bg-[#168BFF]/90 text-white font-semibold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(22,139,255,0.2)] disabled:opacity-50"
                >
                  {loading ? t[currentLang].signingIn : (
                    <>
                      <span>{t[currentLang].signInBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ২. পাসওয়ার্ড রিকভারি ফর্ম */
            <div className="login-form-card w-full max-w-md space-y-6">
              <div>
                <button 
                  onClick={() => setView('login')}
                  className="flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-white mb-6 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t[currentLang].backToSignIn}
                </button>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
                  {t[currentLang].recoverTitle}
                </h1>
                <p className="text-xs text-white/40 leading-relaxed font-light">
                  {t[currentLang].recoverSubtitle}
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {/* ইমেইল ফিল্ড */}
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                    {t[currentLang].emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl pl-10 pr-4 py-3 text-xs transition-colors text-white"
                    />
                  </div>
                </div>

                {/* সাবমিট বাটন */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#7457FF] to-[#168BFF] hover:opacity-95 text-white font-semibold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(22,139,255,0.15)] disabled:opacity-50"
                >
                  {loading ? t[currentLang].recovering : (
                    <>
                      <span>{t[currentLang].sendResetLink}</span>
                      <LockKeyhole className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};