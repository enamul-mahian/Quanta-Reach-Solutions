import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '/src/components/layout/Footer.js';
import { Header } from '/src/components/layout/Header.js';
import { MobileBottomNav } from '/src/components/layout/MobileBottomNav.js';
import { TopBar } from '/src/components/layout/TopBar.js';
export const PublicLayout = () => (_jsxs("div", { className: "flex min-h-screen flex-col bg-[#071426] pb-[calc(4.75rem+env(safe-area-inset-bottom))] lg:pb-0", children: [_jsx(TopBar, {}), _jsx(Header, {}), _jsxs("main", { className: "relative flex flex-grow flex-col", children: [_jsx("div", { className: "w-full flex-grow", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }), _jsx(MobileBottomNav, {})] }));
