import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '/src/contexts/AuthContext.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { LayoutDashboard, MessageSquareText, CalendarDays, Briefcase, Layers, Tag, FileText, Star, Users, Target, FolderOpen, Scale, Shield, Settings, LogOut, Menu, X, Globe, ExternalLink // ExternalLink আইকন ইম্পোর্ট করা হলো
 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SITE } from '/src/config/site.js';
// অ্যাডমিন মেনু আইটেমের তালিকা
const adminMenuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' } },
    { path: '/admin/inquiries', icon: MessageSquareText, label: { en: 'Inquiries & Leads', bn: 'ইনকোয়ারি ও লিডস' } },
    { path: '/admin/meetings', icon: CalendarDays, label: { en: 'Meeting Requests', bn: 'মিটিং রিকোয়েস্ট' } },
    { path: '/admin/services', icon: Layers, label: { en: 'Services', bn: 'সেবাসমূহ' } },
    { path: '/admin/portfolio', icon: Briefcase, label: { en: 'Portfolio', bn: 'পোর্টফোলিও' } },
    { path: '/admin/pricing', icon: Tag, label: { en: 'Pricing Packages', bn: 'প্রাইসিং প্যাকেজ' } },
    { path: '/admin/blog', icon: FileText, label: { en: 'Blog & Insights', bn: 'ব্লগ ও ইনসাইটস' } },
    { path: '/admin/testimonials', icon: Star, label: { en: 'Testimonials', bn: 'রিভিউ' } },
    { path: '/admin/team', icon: Users, label: { en: 'Team Members', bn: 'টিম মেম্বার' } },
    { path: '/admin/targets', icon: Target, label: { en: 'Business Targets', bn: 'বিজনেস টার্গেট' } },
    { path: '/admin/media', icon: FolderOpen, label: { en: 'Media Library', bn: 'মিডিয়া লাইব্রেরি' } },
    { path: '/admin/users', icon: Shield, label: { en: 'User Management', bn: 'ইউজার অ্যাক্সেস' } },
    { path: '/admin/legal-pages', icon: Scale, label: { en: 'Legal Pages', bn: 'লিগ্যাল পেজ' } },
    { path: '/admin/settings', icon: Settings, label: { en: 'Website Settings', bn: 'গ্লোবাল সেটিংস' } },
];
export const AdminLayout = () => {
    const { language, setLanguage } = useLanguage();
    const { currentUser, role, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // রাউট চেঞ্জ হলে মোবাইল মেনু বন্ধ করা
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);
    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
        }
        catch (error) {
            toast.error('Failed to log out');
        }
    };
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'bn' : 'en');
    };
    // মূল সাইটে ভিজিট করার হ্যান্ডলার
    const visitPublicSite = () => {
        window.open('/', '_blank');
    };
    return (_jsxs("div", { className: "flex h-screen bg-[#071426] text-white overflow-hidden font-sans", children: [isMobileMenuOpen && (_jsx("div", { className: "fixed inset-0 bg-navy/80 backdrop-blur-sm z-40 lg:hidden", onClick: () => setIsMobileMenuOpen(false) })), _jsxs("aside", { className: `fixed inset-y-0 left-0 z-50 w-72 bg-[#0a1d37]/90 border-r border-white/[0.05] backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`, children: [_jsxs("div", { className: "h-20 flex items-center justify-between px-6 border-b border-borderColor shrink-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: SITE.mark, alt: "", className: "h-10 w-10 object-contain" }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-lg leading-none tracking-tight", children: "Quanta Reach" }), _jsx("p", { className: "text-[9px] font-mono tracking-[0.2em] text-electric uppercase mt-1", children: "Admin Portal" })] })] }), _jsx("button", { className: "lg:hidden p-2 text-soft-gray hover:text-white", onClick: () => setIsMobileMenuOpen(false), children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("nav", { className: "flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-1.5", children: adminMenuItems.map((item) => {
                            const Icon = item.icon;
                            // সিকিউরিটি চেক: ইউজার পেজ শুধু সুপার-অ্যাডমিনের জন্য
                            if (item.path === '/admin/users' && role !== 'super-admin')
                                return null;
                            // সীমিত ম্যানেজমেন্ট পেজগুলো এডিটরদের জন্য হাইড করা
                            if (role === 'editor' && ['/admin/targets', '/admin/media', '/admin/settings'].includes(item.path))
                                return null;
                            return (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                  ${isActive
                                    ? 'bg-electric/10 text-electric border border-electric/20 shadow-[0_0_15px_rgba(22,139,255,0.05)]'
                                    : 'text-soft-gray hover:text-white hover:bg-white/[0.02] border border-transparent'}
                `, children: [_jsx(Icon, { className: `w-4 h-4 transition-colors ${location.pathname === item.path ? 'text-electric' : 'text-soft-gray group-hover:text-white'}` }), language === 'en' ? item.label.en : item.label.bn] }, item.path));
                        }) }), _jsxs("div", { className: "p-4 border-t border-borderColor shrink-0 bg-white/[0.01]", children: [_jsxs("button", { onClick: visitPublicSite, className: "w-full flex items-center justify-between px-4 py-3 mb-4 text-electric hover:bg-electric/10 border border-electric/20 rounded-xl text-sm font-bold transition-all group", children: [_jsxs("span", { className: "flex items-center gap-3.5", children: [_jsx(Globe, { className: "w-4 h-4" }), language === 'en' ? 'View Live Site' : 'ওয়েবসাইট দেখুন'] }), _jsx(ExternalLink, { className: "w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" })] }), _jsxs("div", { className: "flex items-center gap-3 px-4 py-3 mb-2 bg-navy rounded-xl border border-borderColor", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-electric/20 text-electric flex items-center justify-center font-bold text-xs", children: currentUser?.email?.charAt(0).toUpperCase() || 'A' }), _jsxs("div", { className: "flex-1 overflow-hidden", children: [_jsx("p", { className: "text-xs font-bold text-white truncate", children: currentUser?.displayName || 'Admin User' }), _jsx("p", { className: "text-[10px] text-soft-gray uppercase tracking-widest", children: role })] })] }), _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-3.5 px-4 py-3 text-soft-gray hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-all", children: [_jsx(LogOut, { className: "w-4 h-4" }), language === 'en' ? 'Sign Out' : 'লগআউট'] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden relative", children: [_jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-electric/5 filter blur-[150px] rounded-full pointer-events-none -z-10" }), _jsxs("header", { className: "h-20 bg-navy-surface/80 backdrop-blur-xl border-b border-borderColor px-6 flex items-center justify-between shrink-0 z-20", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => setIsMobileMenuOpen(true), className: "lg:hidden p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors border border-borderColor", children: _jsx(Menu, { className: "w-5 h-5" }) }), _jsxs("div", { className: "hidden md:block", children: [_jsx("p", { className: "text-xs text-soft-gray font-mono uppercase tracking-widest", children: "Workspace" }), _jsx("h2", { className: "text-sm font-bold text-white", children: "Quanta Reach Operations" })] })] }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs("button", { onClick: toggleLanguage, className: "flex items-center gap-2 px-4 py-2 rounded-xl border border-borderColor text-soft-gray hover:text-white hover:border-electric/50 transition-all text-xs font-bold uppercase bg-navy", children: [_jsx(Globe, { className: "w-4 h-4 text-electric" }), _jsx("span", { children: language === 'en' ? 'বাংলা' : 'EN' })] }) })] }), _jsx("main", { className: "flex-1 overflow-y-auto custom-scrollbar relative z-10", children: _jsx(Outlet, {}) })] })] }));
};
