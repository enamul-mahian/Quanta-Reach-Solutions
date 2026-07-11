import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';
import { 
  createSupportTicket, 
  getTicketsByClient, 
  SupportTicket 
} from '../../services/ticketService';
import {
  Layout,
  CheckSquare,
  CreditCard,
  LifeBuoy,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Download,
  Send,
  Clock,
  User,
  Mail,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Bell,
  Globe,
  ExternalLink
} from 'lucide-react';

// ইনভয়েস ইন্টারফেস
interface Invoice {
  id: string;
  amount: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

// মাইলস্টোন ইন্টারফেস
interface Milestone {
  id: string;
  phase: string;
  percentage: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  items: string[];
}

// ট্রান্সলেশন ডিকশনারি
const t = {
  en: {
    overview: 'Client Hub',
    milestones: 'Project Timeline',
    billing: 'Invoices & Support',
    myProject: 'My Active Project',
    progress: 'Overall Progress',
    totalInvoiced: 'Total Invoiced',
    amountPaid: 'Amount Paid',
    balanceDue: 'Balance Due',
    pmTitle: 'Your Dedicated Manager',
    supportDesk: 'Support Ticketing Desk',
    ticketSubject: 'Ticket Subject',
    ticketCategory: 'Category',
    ticketPriority: 'Priority',
    ticketMsg: 'Describe your issue or request...',
    submitTicket: 'Submit Ticket',
    recentTickets: 'Support Log',
    recentInvoices: 'Invoice Records',
    invoiceId: 'Invoice ID',
    statusPaid: 'Paid',
    statusUnpaid: 'Unpaid',
    statusOverdue: 'Overdue',
    mTitle: 'Development Roadmap',
    nextMilestone: 'Next Milestone',
    toastTicketAdded: 'Support ticket submitted successfully!',
    toastInvoiceAlert: 'Invoice download simulated successfully.',
    techStack: 'Assigned Tech Stack',
    loadingTickets: 'Loading tickets from secure vault...'
  },
  bn: {
    overview: 'ক্লায়েন্ট পোর্টাল',
    milestones: 'প্রজেক্ট টাইমলাইন',
    billing: 'ইনভয়েস ও সাপোর্ট',
    myProject: 'চলমান প্রজেক্ট',
    progress: 'সার্বিক অগ্রগতি',
    totalInvoiced: 'মোট বিল পরিমাণ',
    amountPaid: 'পরিশোধিত অর্থ',
    balanceDue: 'বকেয়া বিল',
    pmTitle: 'ডেডিকেটেড প্রজেক্ট ম্যানেজার',
    supportDesk: 'সাপোর্ট টিকিট সাবমিশন',
    ticketSubject: 'টিকিটের বিষয়',
    ticketCategory: 'ক্যাটেগরি',
    ticketPriority: 'গুরুত্ব',
    ticketMsg: 'আপনার সমস্যা বা অনুরোধটি বিস্তারিত লিখুন...',
    submitTicket: 'টিকিট জমা দিন',
    recentTickets: 'সাপোর্ট টিকিট লগ',
    recentInvoices: 'ইনভয়েস রেকর্ড সমূহ',
    invoiceId: 'ইনভয়েস নং',
    statusPaid: 'পরিশোধিত',
    statusUnpaid: 'বকেয়া',
    statusOverdue: 'অতিক্রান্ত',
    mTitle: 'ডেভেলপমেন্ট রোডম্যাপ',
    nextMilestone: 'পরবর্তী মাইলস্টোন',
    toastTicketAdded: 'সাপোর্ট টিকিট সফলভাবে সাবমিট করা হয়েছে!',
    toastInvoiceAlert: 'ইনভয়েস ডাউনলোড সফলভাবে সিমুলেট হয়েছে।',
    techStack: 'প্রযুক্তিগত কাঠামো',
    loadingTickets: 'সুরক্ষিত টিকিট হিস্ট্রি লোড হচ্ছে...'
  }
};

export const ClientDashboard: React.FC = () => {
  const { language } = useLanguage();
  const currentLang = language === 'bn' ? 'bn' : 'en';
  const { currentUser, logout } = useAuth(); 

  // স্টেট ম্যানেজমেন্ট
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'billing'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // টিকিট ফর্ম ও ডাটাবেস স্টেট
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Bug Fix');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newMsg, setNewMsg] = useState('');

  // মাইলস্টোন ডেটা
  const milestones: Milestone[] = [
    { id: '1', phase: 'UI/UX Interface Engineering', percentage: 100, status: 'Completed', items: ['Figma High-Fidelity Design', 'Component Design System approved', 'Interactive Prototypes'] },
    { id: '2', phase: 'Frontend Layout Development', percentage: 80, status: 'In Progress', items: ['Responsive React Layout setup', 'GSAP Premium Animation Integration', 'Bilingual Hooks and Engine Routing'] },
    { id: '3', phase: 'Backend API & Database Connection', percentage: 0, status: 'Upcoming', items: ['Firebase Firestore Security Rules', 'Real-time database sync logic', 'Admin panel CMS bindings'] },
    { id: '4', phase: 'Production Launch & Telemetry', percentage: 0, status: 'Upcoming', items: ['Live Cloud Server Hosting migration', 'CDNs and Error Log Telemetry', 'Search Console SEO Setup'] }
  ];

  // ইনভয়েস ডেটা
  const invoices: Invoice[] = [
    { id: 'INV-2026-004', amount: '৳১,২০,০০০', dueDate: '2026-07-25', status: 'Unpaid' },
    { id: 'INV-2026-003', amount: '৳২,৫০,০০০', dueDate: '2026-06-15', status: 'Paid' },
    { id: 'INV-2026-001', amount: '৳১,০০,০০০', dueDate: '2026-05-10', status: 'Paid' }
  ];

  const dashboardRef = useRef<HTMLDivElement>(null);

  // ফায়ারস্টোর থেকে ইউজারের নিজস্ব টিকিট লোড করার লজিক
  const fetchClientTickets = async () => {
    if (!currentUser?.uid) return;
    setTicketsLoading(true);
    try {
      const data = await getTicketsByClient(currentUser.uid);
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientTickets();
  }, [currentUser]);

  // কাস্টম টোস্ট নোটিফিকেশন ট্র্যাকার
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ডাইনামিক টিকিট সাবমিট হ্যান্ডলার
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    try {
      const ticketData = {
        clientUid: currentUser?.uid || 'anonymous',
        clientName: currentUser?.displayName || 'Client Partner',
        subject: newSubject,
        category: newCategory,
        priority: newPriority,
        description: newMsg
      };

      await createSupportTicket(ticketData);
      triggerToast(t[currentLang].toastTicketAdded);
      
      setNewSubject('');
      setNewMsg('');
      fetchClientTickets(); 
    } catch (error) {
      triggerToast(language === 'en' ? 'Submission failed' : 'টিকিট পাঠানো ব্যর্থ হয়েছে');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // মূল সাইটে ভিজিট করার হ্যান্ডলার
  const visitPublicSite = () => {
    window.open('/', '_blank');
  };

  // GSAP এন্ট্রান্স অ্যানিমেশন
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.client-stat-card',
        { opacity: 0, y: 25, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );

      gsap.fromTo('.radial-progress-ring',
        { strokeDashoffset: 201 }, 
        { strokeDashoffset: 201 - (201 * 0.45), duration: 1.2, ease: 'power2.out', delay: 0.2 }
      );
    }, dashboardRef);

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#071426] text-white flex overflow-hidden font-sans" ref={dashboardRef}>
      
      {/* ১. টোস্ট এলার্ট */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-[#168BFF]/20 to-[#7457FF]/20 border border-[#168BFF]/40 backdrop-blur-xl px-5 py-4 rounded-xl shadow-[0_0_20px_rgba(22,139,255,0.2)] animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ২. লেফট সাইডবার নেভিগেশন */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a1d37]/90 border-r border-white/[0.05] backdrop-blur-md transform transition-transform duration-300 flex flex-col justify-between py-6 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:h-screen`}
      >
        <div>
          {/* হেডার */}
          <div className="px-6 flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#168BFF] to-[#7457FF] flex items-center justify-center font-bold text-lg shadow-[0_0_15px_#168BFF]">
                M
              </div>
              <div>
                <h2 className="font-bold text-base tracking-tight">MetaFore</h2>
                <p className="text-[10px] font-mono tracking-widest text-[#7457FF] uppercase">
                  {t[currentLang].overview}
                </p>
              </div>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5 text-white/60 hover:text-white" />
            </button>
          </div>

          {/* নেভিগেশন লিঙ্ক সমূহ */}
          <nav className="px-4 space-y-1">
            <button 
              onClick={() => { setActiveTab('overview'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-[#168BFF]/10 to-transparent text-[#168BFF] border-l-2 border-[#168BFF]' 
                  : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'
              }`}
            >
              <Layout className="w-4 h-4" />
              {t[currentLang].overview}
            </button>

            <button 
              onClick={() => { setActiveTab('milestones'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'milestones' 
                  ? 'bg-gradient-to-r from-[#168BFF]/10 to-transparent text-[#168BFF] border-l-2 border-[#168BFF]' 
                  : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              {t[currentLang].milestones}
            </button>

            <button 
              onClick={() => { setActiveTab('billing'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'billing' 
                  ? 'bg-gradient-to-r from-[#168BFF]/10 to-transparent text-[#168BFF] border-l-2 border-[#168BFF]' 
                  : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              {t[currentLang].billing}
            </button>
          </nav>
        </div>

        {/* সাইডবার ফুটার (লগআউট ও সাইট ভিজিট) */}
        <div className="px-4">
          <button 
            onClick={visitPublicSite}
            className="w-full flex items-center justify-between px-4 py-3 mb-2 text-[#168BFF] hover:bg-[#168BFF]/10 border border-[#168BFF]/20 rounded-xl text-sm font-bold transition-all group"
          >
            <span className="flex items-center gap-3.5">
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'View Live Site' : 'ওয়েবসাইট দেখুন'}
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-white/40 hover:text-[#FF4A4A] hover:bg-red-500/5 rounded-xl text-sm font-medium transition-all"
          >
            <X className="w-4 h-4" />
            {language === 'en' ? 'Sign Out' : 'লগআউট'}
          </button>
        </div>
      </aside>

      {/* ৩. মেইন প্যানেল */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* টপবার হেডার */}
        <header className="sticky top-0 z-30 bg-[#071426]/80 backdrop-blur-md border-b border-white/[0.05] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-white/[0.05] rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-sm md:text-base font-bold tracking-tight">
                {activeTab === 'overview' && t[currentLang].overview}
                {activeTab === 'milestones' && t[currentLang].milestones}
                {activeTab === 'billing' && t[currentLang].billing}
              </h1>
              <p className="text-[10px] md:text-xs text-[#168BFF] font-mono">
                Project: MetaFore Interactive Web-App Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* নোটিফিকেশন আইকন */}
            <button className="relative p-2 hover:bg-white/[0.03] border border-white/[0.04] rounded-xl transition-all">
              <Bell className="w-4 h-4 text-white/70" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#168BFF] shadow-[0_0_8px_#168BFF]" />
            </button>

            {/* প্রোফাইল বা ক্লায়েন্ট আইডি */}
            <div className="flex items-center gap-3 pl-2 border-l border-white/[0.05]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#168BFF] to-[#7457FF] p-[1.5px]">
                <div className="w-full h-full bg-[#0a1d37] rounded-full flex items-center justify-center font-bold text-xs">
                  {currentUser?.displayName?.charAt(0).toUpperCase() || 'C'}
                </div>
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-xs font-semibold">{currentUser?.displayName || 'Client Partner'}</p>
                <span className="text-[9px] text-white/30 font-mono">ID: {currentUser?.uid?.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* মেইন কন্টেন্ট উইন্ডো */}
        <main className="p-6 md:p-8 flex-1 space-y-8 max-w-7xl w-full mx-auto">
          
          {activeTab === 'overview' && (
            <>
              {/* ওভারভিউ কার্ডস গ্রিড */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* কার্ড ১: সার্বিক অগ্রগতির রিং */}
                <div className="client-stat-card bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-white/40 block mb-1 uppercase">{t[currentLang].progress}</span>
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-2">45% Complete</h3>
                    <span className="text-xs px-2.5 py-1 bg-[#168BFF]/10 text-[#168BFF] border border-[#168BFF]/20 rounded-full">
                      {t[currentLang].nextMilestone}: Backend API
                    </span>
                  </div>
                  {/* কাস্টম রেডিয়াল প্রগ্রেস রিং */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="32" className="stroke-white/[0.04]" strokeWidth="6" fill="transparent" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        r="32" 
                        className="radial-progress-ring stroke-[#168BFF]" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray="201" 
                        strokeDashoffset="110" 
                        strokeLinecap="round"
                        style={{ willChange: 'stroke-dashoffset' }}
                      />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold">45%</span>
                  </div>
                </div>

                {/* কার্ড ২: পেমেন্ট সামারি */}
                <div className="client-stat-card bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-white/40 uppercase">{t[currentLang].amountPaid}</span>
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-mono font-bold mb-1">৳৩,৫০,০০০</h3>
                    <p className="text-xs text-white/40 flex items-center gap-1.5">
                      <span>{t[currentLang].totalInvoiced}: ৳৪,৭০,০০০</span>
                    </p>
                  </div>
                </div>

                {/* কার্ড ৩: বকেয়া বা বাকী বিল */}
                <div className="client-stat-card bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-white/40 uppercase">{t[currentLang].balanceDue}</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-mono font-bold mb-1 text-amber-500">৳১,২০,০০০</h3>
                    <p className="text-xs text-white/40">Next Due: July 25, 2026</p>
                  </div>
                </div>

              </div>

              {/* প্রজেক্ট ম্যানেজার এবং প্রযুক্তিগত বিবরণ ডাবল প্যানেল */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* লেফট প্যানেল: এসাইনড টেকনিক্যাল স্ট্যাক */}
                <div className="lg:col-span-2 bg-[#0a1d37]/20 border border-white/[0.03] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-base">{t[currentLang].techStack}</h3>
                    <span className="text-[10px] font-mono px-3 py-1 bg-white/[0.04] text-white/60 rounded-full border border-white/[0.06]">
                      Enterprise Grade Setup
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                      <p className="text-xs text-white/30 font-mono uppercase mb-2">Frontend Stack</p>
                      <p className="text-sm font-semibold">Vite React + TS</p>
                      <p className="text-xs text-[#168BFF] mt-1">Tailwind CSS & GSAP</p>
                    </div>

                    <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                      <p className="text-xs text-white/30 font-mono uppercase mb-2">Backend & Database</p>
                      <p className="text-sm font-semibold">Firebase Cloud</p>
                      <p className="text-xs text-[#7457FF] mt-1">Real-time DB Sync</p>
                    </div>

                    <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                      <p className="text-xs text-white/30 font-mono uppercase mb-2">Media & CDNs</p>
                      <p className="text-sm font-semibold">Cloudinary CDN</p>
                      <p className="text-xs text-emerald-400 mt-1">Direct Secure Upload</p>
                    </div>
                  </div>
                </div>

                {/* রাইট প্যানেল: ডেডিকেটেড ম্যানেজার কার্ড */}
                <div className="bg-[#0a1d37]/30 border border-white/[0.03] rounded-2xl p-6 text-center flex flex-col justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#168BFF]/5 filter blur-2xl rounded-full" />
                  
                  <div>
                    <span className="text-xs font-mono text-white/40 uppercase block mb-4">{t[currentLang].pmTitle}</span>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#168BFF] to-[#7457FF] p-0.5 mx-auto mb-3">
                      <div className="w-full h-full bg-[#0a1d37] rounded-full flex items-center justify-center font-bold text-lg">
                        SA
                      </div>
                    </div>
                    <h4 className="font-bold text-base text-white">Saimun Al-Mamun</h4>
                    <p className="text-xs text-[#168BFF] font-mono">Senior Accounts Manager</p>
                  </div>

                  <div className="w-full mt-6 space-y-2">
                    <a 
                      href="mailto:saimun@metafore.tech" 
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-[#168BFF]/20 rounded-xl text-xs transition-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-white/60" />
                      saimun@metafore.tech
                    </a>
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'milestones' && (
            <div className="bg-[#0a1d37]/20 border border-white/[0.03] rounded-2xl p-6 md:p-8">
              <div className="mb-8">
                <h3 className="font-bold text-lg md:text-xl">{t[currentLang].mTitle}</h3>
                <p className="text-xs text-white/40">Real-time development phase updates and deliverables confirmation checklist.</p>
              </div>

              {/* প্রজেক্ট মাইলস্টোন কার্ডস */}
              <div className="space-y-6">
                {milestones.map((milestone) => (
                  <div 
                    key={milestone.id}
                    className={`p-6 rounded-2xl border transition-all ${
                      milestone.status === 'Completed' && 'bg-white/[0.01] border-white/[0.03] opacity-60'
                    } ${
                      milestone.status === 'In Progress' && 'bg-[#168BFF]/5 border-[#168BFF]/30 shadow-[0_0_15px_rgba(22,139,255,0.05)]'
                    } ${
                      milestone.status === 'Upcoming' && 'bg-white/[0.005] border-white/[0.02] opacity-40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                          milestone.status === 'Completed' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        } ${
                          milestone.status === 'In Progress' && 'bg-[#168BFF]/20 text-[#168BFF] border border-[#168BFF]/30'
                        } ${
                          milestone.status === 'Upcoming' && 'bg-white/5 text-white/30 border border-white/10'
                        }`}>
                          {milestone.id}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm md:text-base">{milestone.phase}</h4>
                          <span className="text-[10px] font-mono text-white/30">Phase Status: {milestone.status}</span>
                        </div>
                      </div>

                      {/* প্রগ্রেস ইন্ডিকেটর */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-white/60">{milestone.percentage}% Done</span>
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              milestone.status === 'Completed' ? 'bg-emerald-500' : 'bg-[#168BFF]'
                            }`}
                            style={{ width: `${milestone.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* মাইলস্টোন সাব-আইটেমস */}
                    <div className="mt-4 pl-11 space-y-2 border-l border-white/[0.04]">
                      {milestone.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-white/55">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${
                            milestone.status === 'Completed' ? 'text-emerald-500' : 'text-white/20'
                          }`} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* ৩ কলাম: সাপোর্ট টিকিট ফর্ম */}
              <div className="lg:col-span-3 bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl">
                <h3 className="font-bold text-base mb-2">{t[currentLang].supportDesk}</h3>
                <p className="text-xs text-white/40 mb-6">Open a ticket directly to our engineers. Priority tasks are handled in under 4 hours.</p>

                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-2">{t[currentLang].ticketSubject}</label>
                    <input 
                      type="text"
                      required
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="e.g. Integrate custom analytics dashboard API"
                      className="w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl px-4 py-3 text-xs transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-2">{t[currentLang].ticketCategory}</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl px-4 py-3 text-xs transition-colors cursor-pointer"
                      >
                        <option value="Bug Fix">Bug Fix / Issue</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Design Modification">Design Change</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-2">{t[currentLang].ticketPriority}</label>
                      <select 
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as any)}
                        className="w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl px-4 py-3 text-xs transition-colors cursor-pointer"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High (Urgent)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-2">{t[currentLang].ticketMsg}</label>
                    <textarea 
                      rows={4}
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      className="w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl px-4 py-3 text-xs transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#168BFF] hover:bg-[#168BFF]/90 text-white font-semibold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(22,139,255,0.2)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {t[currentLang].submitTicket}
                  </button>
                </form>

                {/* টিকিট হিস্ট্রি লগ (ডাইনামিকালি রেন্ডার হচ্ছে) */}
                <div className="mt-8 border-t border-white/[0.04] pt-6">
                  <h4 className="font-bold text-xs font-mono text-white/35 uppercase mb-4">{t[currentLang].recentTickets}</h4>
                  <div className="space-y-3">
                    {ticketsLoading ? (
                      <p className="text-xs text-soft-gray italic animate-pulse">{t[currentLang].loadingTickets}</p>
                    ) : tickets.length === 0 ? (
                      <p className="text-xs text-white/20 italic">No tickets submitted yet.</p>
                    ) : (
                      tickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-mono text-[#168BFF] block">{ticket.id} • {ticket.createdAt?.toDate().toLocaleDateString() || 'Just now'}</span>
                            <h5 className="font-bold text-xs text-white/80 mt-1">{ticket.subject}</h5>
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                            ticket.status === 'Open' && 'text-amber-500 bg-amber-500/5'
                          } ${
                            ticket.status === 'In Review' && 'text-[#168BFF] bg-[#168BFF]/5'
                          } ${
                            ticket.status === 'Resolved' && 'text-emerald-500 bg-emerald-500/5'
                          }`}>{ticket.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* ২ কলাম: ইনভয়েস ট্র্যাকার */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl">
                  <h3 className="font-bold text-base mb-2">{t[currentLang].recentInvoices}</h3>
                  <p className="text-xs text-white/40 mb-6">Review payment schedules and download generated transaction records.</p>

                  <div className="space-y-4">
                    {invoices.map((inv) => (
                      <div key={inv.id} className="p-4 bg-[#071426]/50 border border-white/[0.02] rounded-xl hover:border-white/10 transition-all flex flex-col justify-between gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-white/30 font-mono uppercase">{t[currentLang].invoiceId}</span>
                            <h4 className="font-bold text-xs mt-0.5">{inv.id}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            inv.status === 'Paid' ? 'text-emerald-500 bg-emerald-500/5' : 'text-amber-500 bg-amber-500/5'
                          }`}>{inv.status === 'Paid' ? t[currentLang].statusPaid : t[currentLang].statusUnpaid}</span>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/[0.03] pt-3">
                          <div>
                            <p className="text-[9px] text-white/20 font-mono">DUE DATE</p>
                            <p className="text-xs font-medium">{inv.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold font-mono text-[#168BFF] mb-1">{inv.amount}</p>
                            <button 
                              onClick={() => triggerToast(t[currentLang].toastInvoiceAlert)}
                              className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 inline-flex transition-all"
                            >
                              <Download className="w-3 h-3" />
                              PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
};