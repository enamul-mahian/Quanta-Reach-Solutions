import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { useAuth } from '/src/contexts/AuthContext.js';
import { createSupportTicket, getTicketsByClient } from '/src/services/ticketService.js';
import { Layout, CheckSquare, CreditCard, LifeBuoy, Download, Send, Mail, CheckCircle2, AlertTriangle, Menu, X, Bell, Globe, ExternalLink } from 'lucide-react';
import { SITE } from '/src/config/site.js';
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
        toastInvoiceAlert: 'Invoice record downloaded successfully.',
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
        toastInvoiceAlert: 'ইনভয়েস রেকর্ড সফলভাবে ডাউনলোড হয়েছে।',
        techStack: 'প্রযুক্তিগত কাঠামো',
        loadingTickets: 'সুরক্ষিত টিকিট হিস্ট্রি লোড হচ্ছে...'
    }
};
export const ClientDashboard = () => {
    const { language } = useLanguage();
    const currentLang = language === 'bn' ? 'bn' : 'en';
    const { currentUser, logout } = useAuth();
    // স্টেট ম্যানেজমেন্ট
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);
    // টিকিট ফর্ম ও ডাটাবেস স্টেট
    const [tickets, setTickets] = useState([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [newCategory, setNewCategory] = useState('Bug Fix');
    const [newPriority, setNewPriority] = useState('Medium');
    const [newMsg, setNewMsg] = useState('');
    // মাইলস্টোন ডেটা
    const milestones = [
        { id: '1', phase: 'UI/UX Interface Engineering', percentage: 100, status: 'Completed', items: ['Figma High-Fidelity Design', 'Component Design System approved', 'Interactive Prototypes'] },
        { id: '2', phase: 'Frontend Layout Development', percentage: 80, status: 'In Progress', items: ['Responsive React Layout setup', 'GSAP Premium Animation Integration', 'Bilingual Hooks and Engine Routing'] },
        { id: '3', phase: 'Backend API & Database Connection', percentage: 0, status: 'Upcoming', items: ['Firebase Firestore Security Rules', 'Real-time database sync logic', 'Admin panel CMS bindings'] },
        { id: '4', phase: 'Production Launch & Telemetry', percentage: 0, status: 'Upcoming', items: ['Live Cloud Server Hosting migration', 'CDNs and Error Log Telemetry', 'Search Console SEO Setup'] }
    ];
    // ইনভয়েস ডেটা
    const invoices = [
        { id: 'INV-2026-004', amount: '৳১,২০,০০০', dueDate: '2026-07-25', status: 'Unpaid' },
        { id: 'INV-2026-003', amount: '৳২,৫০,০০০', dueDate: '2026-06-15', status: 'Paid' },
        { id: 'INV-2026-001', amount: '৳১,০০,০০০', dueDate: '2026-05-10', status: 'Paid' }
    ];
    const dashboardRef = useRef(null);
    // ফায়ারস্টোর থেকে ইউজারের নিজস্ব টিকিট লোড করার লজিক
    const fetchClientTickets = async () => {
        if (!currentUser?.uid)
            return;
        setTicketsLoading(true);
        try {
            const data = await getTicketsByClient(currentUser.uid);
            setTickets(data);
        }
        catch (error) {
            console.error('Failed to load tickets:', error);
        }
        finally {
            setTicketsLoading(false);
        }
    };
    useEffect(() => {
        fetchClientTickets();
    }, [currentUser]);
    // কাস্টম টোস্ট নোটিফিকেশন ট্র্যাকার
    const triggerToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };
    // ডাইনামিক টিকিট সাবমিট হ্যান্ডলার
    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        if (!newSubject.trim())
            return;
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
        }
        catch (error) {
            triggerToast(language === 'en' ? 'Submission failed' : 'টিকিট পাঠানো ব্যর্থ হয়েছে');
        }
    };
    const downloadInvoice = (invoice) => {
        const content = `<!doctype html><html><head><meta charset="utf-8"><title>${invoice.id}</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:48px auto;color:#152238}header{display:flex;justify-content:space-between;border-bottom:2px solid #168BFF;padding-bottom:20px}table{width:100%;border-collapse:collapse;margin-top:30px}td,th{border:1px solid #d9e2ef;padding:12px;text-align:left}.amount{font-size:24px;font-weight:700;color:#168BFF}footer{margin-top:40px;font-size:12px;color:#64748b}</style></head><body><header><div><h1>${SITE.name}</h1><p>${SITE.email} · ${SITE.phoneDisplay}</p></div><div><strong>INVOICE RECORD</strong><p>${invoice.id}</p></div></header><table><tr><th>Invoice ID</th><td>${invoice.id}</td></tr><tr><th>Amount</th><td class="amount">${invoice.amount}</td></tr><tr><th>Due date</th><td>${invoice.dueDate}</td></tr><tr><th>Status</th><td>${invoice.status}</td></tr></table><footer>This record was generated from the ${SITE.name} client portal. Contact ${SITE.email} for the signed tax invoice or payment receipt.</footer></body></html>`;
        const url = URL.createObjectURL(new Blob([content], { type: 'text/html;charset=utf-8' }));
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${invoice.id}.html`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        triggerToast(t[currentLang].toastInvoiceAlert);
    };
    const handleLogout = async () => {
        try {
            await logout();
        }
        catch (error) {
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
            gsap.fromTo('.client-stat-card', { opacity: 0, y: 25, filter: 'blur(3px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power2.out' });
            gsap.fromTo('.radial-progress-ring', { strokeDashoffset: 201 }, { strokeDashoffset: 201 - (201 * 0.45), duration: 1.2, ease: 'power2.out', delay: 0.2 });
        }, dashboardRef);
        return () => ctx.revert();
    }, [activeTab]);
    return (_jsxs("div", { className: "min-h-screen bg-[#071426] text-white flex overflow-hidden font-sans", ref: dashboardRef, children: [toastMessage && (_jsxs("div", { className: "fixed top-24 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-[#168BFF]/20 to-[#7457FF]/20 border border-[#168BFF]/40 backdrop-blur-xl px-5 py-4 rounded-xl shadow-[0_0_20px_rgba(22,139,255,0.2)] animate-pulse", children: [_jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-400" }), _jsx("span", { className: "text-sm font-medium", children: toastMessage })] })), _jsxs("aside", { className: `fixed inset-y-0 left-0 z-40 w-64 bg-[#0a1d37]/90 border-r border-white/[0.05] backdrop-blur-md transform transition-transform duration-300 flex flex-col justify-between py-6 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-screen`, children: [_jsxs("div", { children: [_jsxs("div", { className: "px-6 flex items-center justify-between mb-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: SITE.mark, alt: "", className: "h-10 w-10 object-contain" }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-base tracking-tight", children: "Quanta Reach" }), _jsx("p", { className: "text-[10px] font-mono tracking-widest text-[#7457FF] uppercase", children: t[currentLang].overview })] })] }), _jsx("button", { className: "lg:hidden", onClick: () => setSidebarOpen(false), children: _jsx(X, { className: "w-5 h-5 text-white/60 hover:text-white" }) })] }), _jsxs("nav", { className: "px-4 space-y-1", children: [_jsxs("button", { onClick: () => { setActiveTab('overview'); if (window.innerWidth < 1024)
                                            setSidebarOpen(false); }, className: `w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview'
                                            ? 'bg-gradient-to-r from-[#168BFF]/10 to-transparent text-[#168BFF] border-l-2 border-[#168BFF]'
                                            : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'}`, children: [_jsx(Layout, { className: "w-4 h-4" }), t[currentLang].overview] }), _jsxs("button", { onClick: () => { setActiveTab('milestones'); if (window.innerWidth < 1024)
                                            setSidebarOpen(false); }, className: `w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'milestones'
                                            ? 'bg-gradient-to-r from-[#168BFF]/10 to-transparent text-[#168BFF] border-l-2 border-[#168BFF]'
                                            : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'}`, children: [_jsx(CheckSquare, { className: "w-4 h-4" }), t[currentLang].milestones] }), _jsxs("button", { onClick: () => { setActiveTab('billing'); if (window.innerWidth < 1024)
                                            setSidebarOpen(false); }, className: `w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'billing'
                                            ? 'bg-gradient-to-r from-[#168BFF]/10 to-transparent text-[#168BFF] border-l-2 border-[#168BFF]'
                                            : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'}`, children: [_jsx(LifeBuoy, { className: "w-4 h-4" }), t[currentLang].billing] })] })] }), _jsxs("div", { className: "px-4", children: [_jsxs("button", { onClick: visitPublicSite, className: "w-full flex items-center justify-between px-4 py-3 mb-2 text-[#168BFF] hover:bg-[#168BFF]/10 border border-[#168BFF]/20 rounded-xl text-sm font-bold transition-all group", children: [_jsxs("span", { className: "flex items-center gap-3.5", children: [_jsx(Globe, { className: "w-4 h-4" }), language === 'en' ? 'View Live Site' : 'ওয়েবসাইট দেখুন'] }), _jsx(ExternalLink, { className: "w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" })] }), _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-3.5 px-4 py-3 text-white/40 hover:text-[#FF4A4A] hover:bg-red-500/5 rounded-xl text-sm font-medium transition-all", children: [_jsx(X, { className: "w-4 h-4" }), language === 'en' ? 'Sign Out' : 'লগআউট'] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col h-screen overflow-y-auto", children: [_jsxs("header", { className: "sticky top-0 z-30 bg-[#071426]/80 backdrop-blur-md border-b border-white/[0.05] px-6 py-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => setSidebarOpen(true), className: "lg:hidden p-2 hover:bg-white/[0.05] rounded-lg transition-colors", children: _jsx(Menu, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsxs("h1", { className: "text-sm md:text-base font-bold tracking-tight", children: [activeTab === 'overview' && t[currentLang].overview, activeTab === 'milestones' && t[currentLang].milestones, activeTab === 'billing' && t[currentLang].billing] }), _jsx("p", { className: "text-[10px] md:text-xs text-[#168BFF] font-mono", children: "Project: Quanta Reach Interactive Web-App Portal" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { className: "relative p-2 hover:bg-white/[0.03] border border-white/[0.04] rounded-xl transition-all", children: [_jsx(Bell, { className: "w-4 h-4 text-white/70" }), _jsx("span", { className: "absolute top-1 right-1 w-2 h-2 rounded-full bg-[#168BFF] shadow-[0_0_8px_#168BFF]" })] }), _jsxs("div", { className: "flex items-center gap-3 pl-2 border-l border-white/[0.05]", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-tr from-[#168BFF] to-[#7457FF] p-[1.5px]", children: _jsx("div", { className: "w-full h-full bg-[#0a1d37] rounded-full flex items-center justify-center font-bold text-xs", children: currentUser?.displayName?.charAt(0).toUpperCase() || 'C' }) }), _jsxs("div", { className: "hidden sm:block leading-none", children: [_jsx("p", { className: "text-xs font-semibold", children: currentUser?.displayName || 'Client Partner' }), _jsxs("span", { className: "text-[9px] text-white/30 font-mono", children: ["ID: ", currentUser?.uid?.substring(0, 8).toUpperCase()] })] })] })] })] }), _jsxs("main", { className: "p-6 md:p-8 flex-1 space-y-8 max-w-7xl w-full mx-auto", children: [activeTab === 'overview' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "client-stat-card bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs font-mono text-white/40 block mb-1 uppercase", children: t[currentLang].progress }), _jsx("h3", { className: "text-2xl font-bold tracking-tight text-white mb-2", children: "45% Complete" }), _jsxs("span", { className: "text-xs px-2.5 py-1 bg-[#168BFF]/10 text-[#168BFF] border border-[#168BFF]/20 rounded-full", children: [t[currentLang].nextMilestone, ": Backend API"] })] }), _jsxs("div", { className: "relative w-20 h-20 flex items-center justify-center", children: [_jsxs("svg", { className: "w-full h-full transform -rotate-90", children: [_jsx("circle", { cx: "40", cy: "40", r: "32", className: "stroke-white/[0.04]", strokeWidth: "6", fill: "transparent" }), _jsx("circle", { cx: "40", cy: "40", r: "32", className: "radial-progress-ring stroke-[#168BFF]", strokeWidth: "6", fill: "transparent", strokeDasharray: "201", strokeDashoffset: "110", strokeLinecap: "round", style: { willChange: 'stroke-dashoffset' } })] }), _jsx("span", { className: "absolute text-xs font-mono font-bold", children: "45%" })] })] }), _jsxs("div", { className: "client-stat-card bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl flex flex-col justify-between", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-xs font-mono text-white/40 uppercase", children: t[currentLang].amountPaid }), _jsx(CreditCard, { className: "w-4 h-4 text-emerald-400" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-3xl font-mono font-bold mb-1", children: "\u09F3\u09E9,\u09EB\u09E6,\u09E6\u09E6\u09E6" }), _jsx("p", { className: "text-xs text-white/40 flex items-center gap-1.5", children: _jsxs("span", { children: [t[currentLang].totalInvoiced, ": \u09F3\u09EA,\u09ED\u09E6,\u09E6\u09E6\u09E6"] }) })] })] }), _jsxs("div", { className: "client-stat-card bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl flex flex-col justify-between", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-xs font-mono text-white/40 uppercase", children: t[currentLang].balanceDue }), _jsx(AlertTriangle, { className: "w-4 h-4 text-amber-500 animate-pulse" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-3xl font-mono font-bold mb-1 text-amber-500", children: "\u09F3\u09E7,\u09E8\u09E6,\u09E6\u09E6\u09E6" }), _jsx("p", { className: "text-xs text-white/40", children: "Next Due: July 25, 2026" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 bg-[#0a1d37]/20 border border-white/[0.03] rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "font-bold text-base", children: t[currentLang].techStack }), _jsx("span", { className: "text-[10px] font-mono px-3 py-1 bg-white/[0.04] text-white/60 rounded-full border border-white/[0.06]", children: "Enterprise Grade Setup" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl", children: [_jsx("p", { className: "text-xs text-white/30 font-mono uppercase mb-2", children: "Frontend Stack" }), _jsx("p", { className: "text-sm font-semibold", children: "Vite React + TS" }), _jsx("p", { className: "text-xs text-[#168BFF] mt-1", children: "Tailwind CSS & GSAP" })] }), _jsxs("div", { className: "p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl", children: [_jsx("p", { className: "text-xs text-white/30 font-mono uppercase mb-2", children: "Backend & Database" }), _jsx("p", { className: "text-sm font-semibold", children: "Firebase Cloud" }), _jsx("p", { className: "text-xs text-[#7457FF] mt-1", children: "Real-time DB Sync" })] }), _jsxs("div", { className: "p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl", children: [_jsx("p", { className: "text-xs text-white/30 font-mono uppercase mb-2", children: "Media & CDNs" }), _jsx("p", { className: "text-sm font-semibold", children: "Cloudinary CDN" }), _jsx("p", { className: "text-xs text-emerald-400 mt-1", children: "Direct Secure Upload" })] })] })] }), _jsxs("div", { className: "bg-[#0a1d37]/30 border border-white/[0.03] rounded-2xl p-6 text-center flex flex-col justify-between items-center relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-[#168BFF]/5 filter blur-2xl rounded-full" }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-mono text-white/40 uppercase block mb-4", children: t[currentLang].pmTitle }), _jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-tr from-[#168BFF] to-[#7457FF] p-0.5 mx-auto mb-3", children: _jsx("div", { className: "w-full h-full bg-[#0a1d37] rounded-full flex items-center justify-center font-bold text-lg", children: "SA" }) }), _jsx("h4", { className: "font-bold text-base text-white", children: "Saimun Al-Mamun" }), _jsx("p", { className: "text-xs text-[#168BFF] font-mono", children: "Senior Accounts Manager" })] }), _jsx("div", { className: "w-full mt-6 space-y-2", children: _jsxs("a", { href: "mailto:hello@quantareach.solutions", className: "flex items-center justify-center gap-2 w-full py-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-[#168BFF]/20 rounded-xl text-xs transition-all", children: [_jsx(Mail, { className: "w-3.5 h-3.5 text-white/60" }), "hello@quantareach.solutions"] }) })] })] })] })), activeTab === 'milestones' && (_jsxs("div", { className: "bg-[#0a1d37]/20 border border-white/[0.03] rounded-2xl p-6 md:p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "font-bold text-lg md:text-xl", children: t[currentLang].mTitle }), _jsx("p", { className: "text-xs text-white/40", children: "Real-time development phase updates and deliverables confirmation checklist." })] }), _jsx("div", { className: "space-y-6", children: milestones.map((milestone) => (_jsxs("div", { className: `p-6 rounded-2xl border transition-all ${milestone.status === 'Completed' && 'bg-white/[0.01] border-white/[0.03] opacity-60'} ${milestone.status === 'In Progress' && 'bg-[#168BFF]/5 border-[#168BFF]/30 shadow-[0_0_15px_rgba(22,139,255,0.05)]'} ${milestone.status === 'Upcoming' && 'bg-white/[0.005] border-white/[0.02] opacity-40'}`, children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${milestone.status === 'Completed' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'} ${milestone.status === 'In Progress' && 'bg-[#168BFF]/20 text-[#168BFF] border border-[#168BFF]/30'} ${milestone.status === 'Upcoming' && 'bg-white/5 text-white/30 border border-white/10'}`, children: milestone.id }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-sm md:text-base", children: milestone.phase }), _jsxs("span", { className: "text-[10px] font-mono text-white/30", children: ["Phase Status: ", milestone.status] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-xs font-mono text-white/60", children: [milestone.percentage, "% Done"] }), _jsx("div", { className: "w-24 h-1.5 bg-white/5 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full ${milestone.status === 'Completed' ? 'bg-emerald-500' : 'bg-[#168BFF]'}`, style: { width: `${milestone.percentage}%` } }) })] })] }), _jsx("div", { className: "mt-4 pl-11 space-y-2 border-l border-white/[0.04]", children: milestone.items.map((item, idx) => (_jsxs("div", { className: "flex items-center gap-2.5 text-xs text-white/55", children: [_jsx(CheckCircle2, { className: `w-3.5 h-3.5 ${milestone.status === 'Completed' ? 'text-emerald-500' : 'text-white/20'}` }), _jsx("span", { children: item })] }, idx))) })] }, milestone.id))) })] })), activeTab === 'billing' && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-8", children: [_jsxs("div", { className: "lg:col-span-3 bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl", children: [_jsx("h3", { className: "font-bold text-base mb-2", children: t[currentLang].supportDesk }), _jsx("p", { className: "text-xs text-white/40 mb-6", children: "Open a ticket directly to our engineers. Priority tasks are handled in under 4 hours." }), _jsxs("form", { onSubmit: handleTicketSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-white/40 uppercase mb-2", children: t[currentLang].ticketSubject }), _jsx("input", { type: "text", required: true, value: newSubject, onChange: (e) => setNewSubject(e.target.value), placeholder: "e.g. Integrate custom analytics dashboard API", className: "w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl px-4 py-3 text-xs transition-colors" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-white/40 uppercase mb-2", children: t[currentLang].ticketCategory }), _jsxs("select", { value: newCategory, onChange: (e) => setNewCategory(e.target.value), className: "w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl px-4 py-3 text-xs transition-colors cursor-pointer", children: [_jsx("option", { value: "Bug Fix", children: "Bug Fix / Issue" }), _jsx("option", { value: "Feature Request", children: "Feature Request" }), _jsx("option", { value: "Design Modification", children: "Design Change" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-white/40 uppercase mb-2", children: t[currentLang].ticketPriority }), _jsxs("select", { value: newPriority, onChange: (e) => setNewPriority(e.target.value), className: "w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl px-4 py-3 text-xs transition-colors cursor-pointer", children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High (Urgent)" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-white/40 uppercase mb-2", children: t[currentLang].ticketMsg }), _jsx("textarea", { rows: 4, value: newMsg, onChange: (e) => setNewMsg(e.target.value), className: "w-full bg-[#071426] border border-white/[0.05] focus:border-[#168BFF]/30 outline-none rounded-xl px-4 py-3 text-xs transition-colors resize-none" })] }), _jsxs("button", { type: "submit", className: "flex items-center justify-center gap-2 w-full py-3 bg-[#168BFF] hover:bg-[#168BFF]/90 text-white font-semibold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(22,139,255,0.2)]", children: [_jsx(Send, { className: "w-3.5 h-3.5" }), t[currentLang].submitTicket] })] }), _jsxs("div", { className: "mt-8 border-t border-white/[0.04] pt-6", children: [_jsx("h4", { className: "font-bold text-xs font-mono text-white/35 uppercase mb-4", children: t[currentLang].recentTickets }), _jsx("div", { className: "space-y-3", children: ticketsLoading ? (_jsx("p", { className: "text-xs text-soft-gray italic animate-pulse", children: t[currentLang].loadingTickets })) : tickets.length === 0 ? (_jsx("p", { className: "text-xs text-white/20 italic", children: "No tickets submitted yet." })) : (tickets.map((ticket) => (_jsxs("div", { className: "p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-[9px] font-mono text-[#168BFF] block", children: [ticket.id, " \u2022 ", ticket.createdAt?.toDate().toLocaleDateString() || 'Just now'] }), _jsx("h5", { className: "font-bold text-xs text-white/80 mt-1", children: ticket.subject })] }), _jsx("span", { className: `inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${ticket.status === 'Open' && 'text-amber-500 bg-amber-500/5'} ${ticket.status === 'In Review' && 'text-[#168BFF] bg-[#168BFF]/5'} ${ticket.status === 'Resolved' && 'text-emerald-500 bg-emerald-500/5'}`, children: ticket.status })] }, ticket.id)))) })] })] }), _jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs("div", { className: "bg-[#0a1d37]/30 border border-white/[0.03] p-6 rounded-2xl", children: [_jsx("h3", { className: "font-bold text-base mb-2", children: t[currentLang].recentInvoices }), _jsx("p", { className: "text-xs text-white/40 mb-6", children: "Review payment schedules and download generated transaction records." }), _jsx("div", { className: "space-y-4", children: invoices.map((inv) => (_jsxs("div", { className: "p-4 bg-[#071426]/50 border border-white/[0.02] rounded-xl hover:border-white/10 transition-all flex flex-col justify-between gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[10px] text-white/30 font-mono uppercase", children: t[currentLang].invoiceId }), _jsx("h4", { className: "font-bold text-xs mt-0.5", children: inv.id })] }), _jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${inv.status === 'Paid' ? 'text-emerald-500 bg-emerald-500/5' : 'text-amber-500 bg-amber-500/5'}`, children: inv.status === 'Paid' ? t[currentLang].statusPaid : t[currentLang].statusUnpaid })] }), _jsxs("div", { className: "flex items-center justify-between border-t border-white/[0.03] pt-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[9px] text-white/20 font-mono", children: "DUE DATE" }), _jsx("p", { className: "text-xs font-medium", children: inv.dueDate })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-bold font-mono text-[#168BFF] mb-1", children: inv.amount }), _jsxs("button", { onClick: () => downloadInvoice(inv), className: "text-[10px] text-white/40 hover:text-white flex items-center gap-1 inline-flex transition-all", children: [_jsx(Download, { className: "w-3 h-3" }), language === 'en' ? 'Download' : 'ডাউনলোড'] })] })] })] }, inv.id))) })] }) })] }))] })] })] }));
};
