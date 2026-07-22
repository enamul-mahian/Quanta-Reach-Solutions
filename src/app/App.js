import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Preloader } from '/src/components/animations/Preloader.js';
import { PageTransition } from '/src/components/animations/PageTransition.js';
import { CustomCursor } from '/src/components/layout/CustomCursor.js';
import { AuthProvider } from '/src/contexts/AuthContext.js';
export default function App() {
    return (_jsx(AuthProvider, { children: _jsxs("div", { className: "relative min-h-screen bg-[#071426] text-white selection:bg-[#168BFF]/30 selection:text-white", children: [_jsx(Preloader, {}), _jsx(CustomCursor, {}), _jsx(PageTransition, {}), _jsx(Toaster, { position: "top-right", reverseOrder: false, gutter: 8, toastOptions: {
                        className: 'quantareach-toast',
                        duration: 4000,
                        style: {
                            background: '#0D1D33',
                            color: '#FFFFFF',
                            border: '1px solid rgba(22, 139, 255, 0.2)',
                            borderRadius: '4px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: '14px',
                            boxShadow: '0 10px 30px -10px rgba(7, 20, 38, 0.5)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#168BFF',
                                secondary: '#FFFFFF',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#FF4B4B',
                                secondary: '#FFFFFF',
                            },
                        },
                    } }), _jsx(Outlet, {})] }) }));
}
