import { jsx as _jsx } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Main React Entry Point
// =========================================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '/src/app/providers.js';
import { router } from '/src/app/router.js';
import { ErrorBoundary } from '/src/components/common/ErrorBoundary.js';
import 'react-quill/dist/quill.snow.css';
// গ্লোবাল স্টাইল এবং টাইপোগ্রাফি ইমপোর্ট করা হচ্ছে


const rootElement = document.getElementById('root');
if (!rootElement)
    throw new Error('Application root element was not found.');
ReactDOM.createRoot(rootElement).render(_jsx(React.StrictMode, { children: _jsx(ErrorBoundary, { children: _jsx(AppProviders, { children: _jsx(RouterProvider, { router: router }) }) }) }));
