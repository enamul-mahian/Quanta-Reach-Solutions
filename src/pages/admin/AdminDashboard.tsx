import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '@/hooks/useLanguage';
import { getAllInquiries, ProjectInquiry } from '@/services/inquiryService';
import { getProjects, PortfolioProject } from '@/services/portfolioService';
import { 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Users, 
  FileText,
  Activity
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const currentLang = language === 'bn' ? 'bn' : 'en';

  // ডাইনামিক স্টেট
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);

  // ফায়ারস্টোর থেকে রিয়েল-টাইম ডাটা ফেচিং
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [inquiriesData, projectsData] = await Promise.all([
          getAllInquiries(),
          getProjects({ includeDrafts: true })
        ]);
        setInquiries(inquiriesData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // অ্যানিমেশন
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 30, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );

      gsap.fromTo('.table-container',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );

      if (chartPathRef.current) {
        const pathLength = chartPathRef.current.getTotalLength();
        gsap.fromTo(chartPathRef.current,
          { strokeDasharray: pathLength, strokeDashoffset: pathLength },
          { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', delay: 0.4 }
        );
      }
    }, mainContentRef);

    return () => ctx.revert();
  }, [loading]);

  // স্ট্যাটিসটিক্স ক্যালকুলেশন (এররটি এখানে সংশোধন করা হয়েছে)
  const pendingLeads = inquiries.filter(i => i.status === 'New').length;
  const activeProjects = projects.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-electric border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto" ref={mainContentRef}>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Operations Overview' : 'অপারেশনাল ওভারভিউ'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">Real-time metrics and system analytics.</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Revenue (Mocked for now) */}
        <div className="stat-card relative bg-navy-surface border border-borderColor hover:border-amber-500/30 p-6 rounded-3xl shadow-xl transition-all duration-500 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 filter blur-xl rounded-full" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-soft-gray tracking-widest uppercase">Est. Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1 font-mono">
            {language === 'bn' ? '৳১১,৪০,০০০' : '$9,450'}
          </h3>
          <p className="text-xs text-emerald-400 flex items-center gap-1 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% <span className="text-soft-gray font-normal ml-1">vs last month</span>
          </p>
        </div>

        {/* Card 2: Active Projects */}
        <div className="stat-card relative bg-navy-surface border border-borderColor hover:border-electric/30 p-6 rounded-3xl shadow-xl transition-all duration-500 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-electric/5 filter blur-xl rounded-full" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-soft-gray tracking-widest uppercase">Portfolio Projects</span>
            <div className="w-8 h-8 rounded-xl bg-electric/10 flex items-center justify-center border border-electric/20 text-electric">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1 font-mono">
            {activeProjects}
          </h3>
          <p className="text-xs text-electric flex items-center gap-1 font-bold mt-2">
            <Clock className="w-3.5 h-3.5" /> Published & Drafts
          </p>
        </div>

        {/* Card 3: Pending Leads */}
        <div className="stat-card relative bg-navy-surface border border-borderColor hover:border-purple/30 p-6 rounded-3xl shadow-xl transition-all duration-500 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple/5 filter blur-xl rounded-full" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-soft-gray tracking-widest uppercase">New Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-purple/10 flex items-center justify-center border border-purple/20 text-purple">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1 font-mono">
            {pendingLeads}
          </h3>
          <p className="text-xs text-amber-500 flex items-center gap-1 font-bold mt-2">
            Needs review
          </p>
        </div>

        {/* Card 4: Total Leads */}
        <div className="stat-card relative bg-navy-surface border border-borderColor hover:border-emerald-500/30 p-6 rounded-3xl shadow-xl transition-all duration-500 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 filter blur-xl rounded-full" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-soft-gray tracking-widest uppercase">Total Leads</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1 font-mono">
            {inquiries.length}
          </h3>
          <p className="text-xs text-soft-gray flex items-center gap-1 mt-2">
            All time records
          </p>
        </div>

      </div>

      {/* Charts & Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Growth Graph (2 Columns) */}
        <div className="table-container lg:col-span-2 bg-navy-surface border border-borderColor rounded-3xl p-8 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-white">Monthly Growth Analytics</h3>
              <p className="text-xs text-soft-gray mt-1">Inbound leads volume vs conversions over time.</p>
            </div>
            <span className="text-[10px] font-bold font-mono px-3 py-1 bg-electric/10 text-electric rounded-lg border border-electric/20 uppercase tracking-widest">
              Live Telemetry
            </span>
          </div>

          {/* Premium SVG Custom Chart */}
          <div className="relative h-64 w-full mt-4 bg-navy border border-borderColor rounded-2xl overflow-hidden p-2 flex items-end">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#168BFF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7457FF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#168BFF" />
                  <stop offset="50%" stopColor="#7457FF" />
                  <stop offset="100%" stopColor="#168BFF" />
                </linearGradient>
              </defs>
              <path d="M0 150 L0 110 Q50 90 100 120 T200 60 T300 80 T400 30 T500 40 L500 150 Z" fill="url(#chartGlow)" />
              <path 
                ref={chartPathRef}
                d="M0 110 Q50 90 100 120 T200 60 T300 80 T400 30 T500 40" 
                fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round"
                style={{ willChange: 'stroke-dashoffset' }}
              />
            </svg>
            <div className="w-full flex justify-between px-6 text-[10px] text-soft-gray font-mono font-bold uppercase tracking-widest z-10 select-none pb-3">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul (Current)</span>
            </div>
          </div>
        </div>

        {/* Informational Panel */}
        <div className="table-container bg-navy-surface border border-borderColor rounded-3xl p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-white mb-6">Service Popularity</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-white/80 mb-2">
                  <span>Web Development</span><span>45%</span>
                </div>
                <div className="h-1.5 w-full bg-navy rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-electric to-cyan-400 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-white/80 mb-2">
                  <span>UI/UX Interface Design</span><span>30%</span>
                </div>
                <div className="h-1.5 w-full bg-navy rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple to-electric rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-white/80 mb-2">
                  <span>Software Consulting</span><span>15%</span>
                </div>
                <div className="h-1.5 w-full bg-navy rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-purple rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-white/80 mb-2">
                  <span>Brand Marketing</span><span>10%</span>
                </div>
                <div className="h-1.5 w-full bg-navy rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};