import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { getAllInquiries } from '/src/services/inquiryService.js';
import { getProjects } from '/src/services/portfolioService.js';
import { TrendingUp, Briefcase, Clock, Users, FileText, Activity } from 'lucide-react';
export const AdminDashboard = () => {
    const { language } = useLanguage();
    // ডাইনামিক স্টেট
    const [inquiries, setInquiries] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const mainContentRef = useRef(null);
    const chartPathRef = useRef(null);
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
            }
            catch (error) {
                console.error('Failed to load dashboard data', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);
    // অ্যানিমেশন
    useEffect(() => {
        if (loading)
            return;
        const ctx = gsap.context(() => {
            gsap.fromTo('.stat-card', { opacity: 0, y: 30, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power2.out' });
            gsap.fromTo('.table-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
            if (chartPathRef.current) {
                const pathLength = chartPathRef.current.getTotalLength();
                gsap.fromTo(chartPathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', delay: 0.4 });
            }
        }, mainContentRef);
        return () => ctx.revert();
    }, [loading]);
    // স্ট্যাটিসটিক্স ক্যালকুলেশন (এররটি এখানে সংশোধন করা হয়েছে)
    const pendingLeads = inquiries.filter((inquiry) => inquiry.status === 'New').length;
    const wonLeads = inquiries.filter((inquiry) => inquiry.status === 'Won').length;
    const conversionRate = inquiries.length > 0 ? Math.round((wonLeads / inquiries.length) * 100) : 0;
    const activeProjects = projects.length;
    const monthlyLeads = Array.from({ length: 6 }, (_, index) => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - (5 - index));
        const count = inquiries.filter((inquiry) => {
            const createdAt = inquiry.createdAt?.toDate?.();
            return createdAt && createdAt.getFullYear() === date.getFullYear() && createdAt.getMonth() === date.getMonth();
        }).length;
        return { label: date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short' }), count };
    });
    const maxMonthlyLeads = Math.max(1, ...monthlyLeads.map((item) => item.count));
    const chartPath = monthlyLeads.map((item, index) => {
        const x = (index / Math.max(1, monthlyLeads.length - 1)) * 500;
        const y = 135 - (item.count / maxMonthlyLeads) * 105;
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
    const serviceCounts = inquiries.reduce((counts, inquiry) => {
        inquiry.requiredServices?.forEach((service) => { counts[service] = (counts[service] || 0) + 1; });
        return counts;
    }, {});
    const totalServiceSelections = Math.max(1, Object.values(serviceCounts).reduce((sum, value) => sum + value, 0));
    const servicePopularity = Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, count]) => ({ name, percentage: Math.round((count / totalServiceSelections) * 100) }));
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-full min-h-[60vh]", children: _jsx("div", { className: "w-10 h-10 border-2 border-electric border-t-transparent rounded-full animate-spin" }) }));
    }
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", ref: mainContentRef, children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Activity, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Operations Overview' : 'অপারেশনাল ওভারভিউ'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Real-time metrics and system analytics." })] }) }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs("div", { className: "stat-card relative bg-navy-surface border border-borderColor hover:border-amber-500/30 p-6 rounded-3xl shadow-xl transition-all duration-500 group overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-amber-500/5 filter blur-xl rounded-full" }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-[10px] font-bold text-soft-gray tracking-widest uppercase", children: "Won Leads" }), _jsx("div", { className: "w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500", children: _jsx(TrendingUp, { className: "w-4 h-4" }) })] }), _jsx("h3", { className: "text-2xl md:text-3xl font-black tracking-tight text-white mb-1 font-mono", children: wonLeads }), _jsxs("p", { className: "text-xs text-emerald-400 flex items-center gap-1 font-bold mt-2", children: [_jsx(TrendingUp, { className: "w-3.5 h-3.5" }), " ", conversionRate, "% ", _jsx("span", { className: "text-soft-gray font-normal ml-1", children: "conversion rate" })] })] }), _jsxs("div", { className: "stat-card relative bg-navy-surface border border-borderColor hover:border-electric/30 p-6 rounded-3xl shadow-xl transition-all duration-500 group overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-electric/5 filter blur-xl rounded-full" }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-[10px] font-bold text-soft-gray tracking-widest uppercase", children: "Portfolio Projects" }), _jsx("div", { className: "w-8 h-8 rounded-xl bg-electric/10 flex items-center justify-center border border-electric/20 text-electric", children: _jsx(Briefcase, { className: "w-4 h-4" }) })] }), _jsx("h3", { className: "text-2xl md:text-3xl font-black tracking-tight text-white mb-1 font-mono", children: activeProjects }), _jsxs("p", { className: "text-xs text-electric flex items-center gap-1 font-bold mt-2", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), " Published & Drafts"] })] }), _jsxs("div", { className: "stat-card relative bg-navy-surface border border-borderColor hover:border-purple/30 p-6 rounded-3xl shadow-xl transition-all duration-500 group overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-purple/5 filter blur-xl rounded-full" }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-[10px] font-bold text-soft-gray tracking-widest uppercase", children: "New Inquiries" }), _jsx("div", { className: "w-8 h-8 rounded-xl bg-purple/10 flex items-center justify-center border border-purple/20 text-purple", children: _jsx(FileText, { className: "w-4 h-4" }) })] }), _jsx("h3", { className: "text-2xl md:text-3xl font-black tracking-tight text-white mb-1 font-mono", children: pendingLeads }), _jsx("p", { className: "text-xs text-amber-500 flex items-center gap-1 font-bold mt-2", children: "Needs review" })] }), _jsxs("div", { className: "stat-card relative bg-navy-surface border border-borderColor hover:border-emerald-500/30 p-6 rounded-3xl shadow-xl transition-all duration-500 group overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 filter blur-xl rounded-full" }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-[10px] font-bold text-soft-gray tracking-widest uppercase", children: "Total Leads" }), _jsx("div", { className: "w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400", children: _jsx(Users, { className: "w-4 h-4" }) })] }), _jsx("h3", { className: "text-2xl md:text-3xl font-black tracking-tight text-white mb-1 font-mono", children: inquiries.length }), _jsx("p", { className: "text-xs text-soft-gray flex items-center gap-1 mt-2", children: "All time records" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "table-container lg:col-span-2 bg-navy-surface border border-borderColor rounded-3xl p-8 shadow-xl flex flex-col justify-between", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg text-white", children: "Monthly Growth Analytics" }), _jsx("p", { className: "text-xs text-soft-gray mt-1", children: "Inbound lead volume from the last six calendar months." })] }), _jsx("span", { className: "text-[10px] font-bold font-mono px-3 py-1 bg-electric/10 text-electric rounded-lg border border-electric/20 uppercase tracking-widest", children: "Live Telemetry" })] }), _jsxs("div", { className: "relative h-64 w-full mt-4 bg-navy border border-borderColor rounded-2xl overflow-hidden p-2 flex items-end", children: [_jsxs("svg", { className: "absolute inset-0 w-full h-full", viewBox: "0 0 500 150", preserveAspectRatio: "none", children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "chartGlow", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#168BFF", stopOpacity: "0.2" }), _jsx("stop", { offset: "100%", stopColor: "#7457FF", stopOpacity: "0" })] }), _jsxs("linearGradient", { id: "lineGradient", x1: "0", y1: "0", x2: "1", y2: "0", children: [_jsx("stop", { offset: "0%", stopColor: "#168BFF" }), _jsx("stop", { offset: "50%", stopColor: "#7457FF" }), _jsx("stop", { offset: "100%", stopColor: "#168BFF" })] })] }), _jsx("path", { d: `${chartPath} L500 150 L0 150 Z`, fill: "url(#chartGlow)" }), _jsx("path", { ref: chartPathRef, d: chartPath, fill: "none", stroke: "url(#lineGradient)", strokeWidth: "3", strokeLinecap: "round", style: { willChange: 'stroke-dashoffset' } })] }), _jsx("div", { className: "w-full flex justify-between px-6 text-[10px] text-soft-gray font-mono font-bold uppercase tracking-widest z-10 select-none pb-3", children: monthlyLeads.map((month) => _jsxs("span", { children: [month.label, " (", month.count, ")"] }, month.label)) })] })] }), _jsx("div", { className: "table-container bg-navy-surface border border-borderColor rounded-3xl p-8 shadow-xl flex flex-col justify-between", children: _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg text-white mb-6", children: "Service Popularity" }), _jsx("div", { className: "space-y-5", children: servicePopularity.length > 0 ? servicePopularity.map((service) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs font-bold text-white/80 mb-2", children: [_jsx("span", { children: service.name }), _jsxs("span", { children: [service.percentage, "%"] })] }), _jsx("div", { className: "h-1.5 w-full bg-navy rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-electric to-purple rounded-full", style: { width: `${service.percentage}%` } }) })] }, service.name))) : (_jsx("p", { className: "text-sm text-soft-gray", children: "No service-selection data is available yet." })) })] }) })] })] }));
};
