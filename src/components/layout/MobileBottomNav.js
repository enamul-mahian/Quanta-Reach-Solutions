import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Mobile App-like Bottom Navigation
// =========================================================================
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Grid, MessageSquare, PhoneCall } from 'lucide-react';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { SITE } from '/src/config/site.js';
export const MobileBottomNav = () => {
    const { t } = useLanguage();
    const navItems = [
        { name: t.navigation.home, path: '/', icon: _jsx(Home, { className: "w-5 h-5" }) },
        { name: t.navigation.services, path: '/services', icon: _jsx(Briefcase, { className: "w-5 h-5" }) },
        { name: t.navigation.portfolio, path: '/portfolio', icon: _jsx(Grid, { className: "w-5 h-5" }) },
        { name: t.navigation.contact, path: '/contact', icon: _jsx(PhoneCall, { className: "w-5 h-5" }) },
        { name: t.common.whatsappUs, path: SITE.whatsappHref, icon: _jsx(MessageSquare, { className: "w-5 h-5" }), external: true },
    ];
    return (_jsx("div", { className: "lg:hidden fixed bottom-0 left-0 w-full z-50 bg-navy/90 backdrop-blur-md border-t border-borderColor shadow-[0_-10px_30px_rgba(7,20,38,0.5)]", children: _jsx("div", { className: "flex items-center justify-around px-2 py-3", style: { paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }, children: navItems.map((item) => {
                // বাহ্যিক লিংক (যেমন: হোয়াটসঅ্যাপ) হলে <a> ট্যাগ ব্যবহার করবে
                if (item.external) {
                    return (_jsxs("a", { href: item.path, target: "_blank", rel: "noopener noreferrer", className: "flex flex-col items-center justify-center space-y-1 text-soft-gray hover:text-electric transition-colors w-16", children: [item.icon, _jsx("span", { className: "text-[10px] font-medium text-center leading-tight", children: item.name })] }, item.path));
                }
                // ওয়েবসাইটের ভেতরের লিংকের জন্য <NavLink> ব্যবহার করবে
                return (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => `flex flex-col items-center justify-center space-y-1 transition-all duration-300 w-16 ${isActive ? 'text-electric scale-110' : 'text-soft-gray hover:text-white'}`, children: [item.icon, _jsx("span", { className: "text-[10px] font-medium text-center leading-tight whitespace-nowrap", children: item.name })] }, item.path));
            }) }) }));
};
