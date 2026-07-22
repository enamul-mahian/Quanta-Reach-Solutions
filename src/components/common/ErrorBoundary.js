import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { SITE } from '/src/config/site.js';
export class ErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error(`${SITE.name} application error`, error, info);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("main", { className: "flex min-h-screen items-center justify-center bg-[#071426] px-6 text-center text-white", children: _jsxs("div", { className: "max-w-lg rounded-3xl border border-white/10 bg-[#0D1D33] p-10 shadow-2xl", children: [_jsx("img", { src: SITE.mark, alt: "", className: "mx-auto mb-6 h-20 w-20 object-contain" }), _jsx("h1", { className: "text-3xl font-black", children: "Something went wrong" }), _jsx("p", { className: "mt-4 leading-relaxed text-white/60", children: "The page could not be displayed. Reload the website, or return to the home page." }), _jsxs("div", { className: "mt-7 flex justify-center gap-3", children: [_jsx("button", { onClick: () => window.location.reload(), className: "rounded-full bg-[#168BFF] px-6 py-3 font-bold text-[#071426]", children: "Reload" }), _jsx("a", { href: "/", className: "rounded-full border border-white/15 px-6 py-3 font-bold", children: "Home" })] })] }) }));
        }
        return this.props.children;
    }
}
