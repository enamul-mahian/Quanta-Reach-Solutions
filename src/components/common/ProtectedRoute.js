import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '/src/contexts/AuthContext.js';
export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser, role, loading, hasRole } = useAuth();
    const location = useLocation();
    // ১. মেম্বার অথেনটিকেশন স্টেট ভেরিফাইং স্ক্রিন (যদি লোডিং অবস্থায় থাকে)
    if (loading) {
        return (_jsx("div", { className: "fixed inset-0 w-full h-full bg-[#071426] flex items-center justify-center z-50", children: _jsxs("div", { className: "relative flex flex-col items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full border-2 border-[#168BFF]/20 border-t-[#168BFF] animate-spin" }), _jsx("p", { className: "text-[10px] font-mono text-white/40 tracking-widest uppercase", children: "Verifying Access Keys..." })] }) }));
    }
    // ২. যদি কোনো ইউজার লগইন করা না থাকে, তবে তাকে রিডাইরেক্ট করে লগইন পেজে পাঠানো হবে এবং পূর্ববর্তী লোকেশন সেভ রাখা হবে
    if (!currentUser) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    // ৩. যদি ইউজার লগইন থাকে কিন্তু তার নির্দিষ্ট রোলের জন্য অনুমতি (Permission) না থাকে
    if (allowedRoles && !hasRole(allowedRoles)) {
        // রোল ভিত্তিক সেফ রিডাইরেকশন (যেমন: ক্লায়েন্ট যদি অ্যাডমিন পেজে যাওয়ার চেষ্টা করে তবে তাকে ক্লায়েন্ট ড্যাশবোর্ডে রিডাইরেক্ট করা হবে)
        if (role === 'client') {
            return _jsx(Navigate, { to: "/client/dashboard", replace: true });
        }
        if (role === 'admin' || role === 'super-admin' || role === 'editor') {
            return _jsx(Navigate, { to: "/admin/dashboard", replace: true });
        }
        // অন্যথায় ডিফল্ট হোমপেজে রিডাইরেক্ট করা হবে
        return _jsx(Navigate, { to: "/", replace: true });
    }
    // ৪. যদি ইউজার লগইন থাকে এবং অনুমতিপ্রাপ্ত রোলের অধিকারী হয়, তবে তাকে চাইল্ড এলিমেন্টটি শো করা হবে
    return _jsx(_Fragment, { children: children });
};
