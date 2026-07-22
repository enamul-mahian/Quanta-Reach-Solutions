import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseReady } from '/src/lib/firebase.js';
const AuthContext = createContext(undefined);
const VALID_ROLES = ['super-admin', 'admin', 'editor', 'client', 'user'];
const normalizeRole = (value) => typeof value === 'string' && VALID_ROLES.includes(value)
    ? value
    : 'user';
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
export const AuthProvider = ({ children }) => {
    const backendReady = isFirebaseReady();
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(backendReady);
    const assertBackend = () => {
        if (!backendReady) {
            throw new Error('The website backend is not configured. Add the Firebase variables and rebuild the project.');
        }
    };
    const login = async (email, password) => {
        assertBackend();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
        }
        catch (error) {
            setLoading(false);
            throw error;
        }
    };
    const logout = async () => {
        assertBackend();
        setLoading(true);
        try {
            await signOut(auth);
            setCurrentUser(null);
            setRole(null);
        }
        catch (error) {
            setLoading(false);
            throw error;
        }
    };
    const resetPassword = async (email) => {
        assertBackend();
        await sendPasswordResetEmail(auth, email.trim());
    };
    useEffect(() => {
        if (!backendReady) {
            setLoading(false);
            return undefined;
        }
        let active = true;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!active)
                return;
            setCurrentUser(user);
            if (!user) {
                setRole(null);
                setLoading(false);
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (!active)
                    return;
                setRole(userDoc.exists() ? normalizeRole(userDoc.data().role) : 'user');
            }
            catch (error) {
                console.warn("Role retrieval failed; using the safe 'user' role.", error);
                if (active)
                    setRole('user');
            }
            finally {
                if (active)
                    setLoading(false);
            }
        });
        return () => {
            active = false;
            unsubscribe();
        };
    }, [backendReady]);
    const value = useMemo(() => ({
        currentUser,
        role,
        loading,
        backendReady,
        login,
        logout,
        resetPassword,
        hasRole: (allowedRoles) => Boolean(role && allowedRoles.includes(role)),
    }), [currentUser, role, loading, backendReady]);
    return (_jsx(AuthContext.Provider, { value: value, children: loading ? (_jsx("div", { className: "fixed inset-0 z-[10001] flex h-full w-full items-center justify-center bg-[#071426]", children: _jsxs("div", { className: "relative flex flex-col items-center gap-4", children: [_jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-2 border-[#168BFF]/20 border-t-[#168BFF]" }), _jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-white/40", children: "Securing Workspace..." })] }) })) : children }));
};
