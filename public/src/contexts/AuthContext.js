import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '/src/lib/apiClient.js';
const AuthContext = createContext(undefined);
const VALID_ROLES = ['super-admin','admin','editor','client','user'];
const normalizeRole = (value) => typeof value === 'string' && VALID_ROLES.includes(value) ? value : 'user';
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within an AuthProvider'); return context; };
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const backendReady = true;
    const refresh = async () => {
        try { const user = await api.get('/auth/me'); setCurrentUser(user); setRole(user ? normalizeRole(user.role) : null); return user; }
        catch (error) { console.warn('Session check failed.', error); setCurrentUser(null); setRole(null); return null; }
        finally { setLoading(false); }
    };
    const login = async (email, password) => { setLoading(true); try { const user = await api.post('/auth/login', { email: email.trim(), password }); setCurrentUser(user); setRole(normalizeRole(user.role)); return user; } finally { setLoading(false); } };
    const logout = async () => { setLoading(true); try { await api.post('/auth/logout', {}); setCurrentUser(null); setRole(null); } finally { setLoading(false); } };
    const resetPassword = async (email) => api.post('/auth/forgot-password', { email: email.trim() });
    useEffect(() => { refresh(); }, []);
    const value = useMemo(() => ({ currentUser, role, loading, backendReady, login, logout, resetPassword, refresh, hasRole: (allowedRoles) => Boolean(role && allowedRoles.includes(role)) }), [currentUser, role, loading]);
    return _jsx(AuthContext.Provider, { value, children: loading ? _jsx("div", { className: "fixed inset-0 z-[10001] flex h-full w-full items-center justify-center bg-[#071426]", children: _jsxs("div", { className: "relative flex flex-col items-center gap-4", children: [_jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-2 border-[#168BFF]/20 border-t-[#168BFF]" }), _jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-white/40", children: "Securing Workspace..." })] }) }) : children });
};
