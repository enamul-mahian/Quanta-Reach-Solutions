import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { api } from '/src/lib/apiClient.js';
import { useAuth } from '/src/contexts/AuthContext.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Shield, Search, User as UserIcon, Mail, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
export const UsersPage = () => {
    const { language } = useLanguage();
    const { currentUser, role: currentUserRole } = useAuth(); // কারেন্ট ইউজারের রোল চেক করার জন্য
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);
    // ১. ইউজার ডাটা ফেচিং
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const fetchedUsers = await api.get('/users');
            setUsers(fetchedUsers);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users database');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    // ২. রোল আপডেট লজিক
    const handleRoleChange = async (uid, newRole) => {
        // সিকিউরিটি চেক: শুধুমাত্র সুপার-অ্যাডমিন রোল পরিবর্তন করতে পারবে
        if (currentUserRole !== 'super-admin') {
            toast.error(language === 'en' ? 'Only Super Admins can change roles.' : 'শুধুমাত্র সুপার-অ্যাডমিন রোল পরিবর্তন করতে পারবেন।');
            return;
        }
        // নিজে নিজের রোল পরিবর্তন করতে পারবে না (লক-আউট এড়ানোর জন্য)
        if (uid === currentUser?.uid) {
            toast.error('You cannot change your own role!');
            return;
        }
        setUpdatingId(uid);
        try {
            await api.patch(`/users/${encodeURIComponent(uid)}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
            toast.success(`User role updated to ${newRole}`);
        }
        catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role');
        }
        finally {
            setUpdatingId(null);
        }
    };
    // ৩. ফিল্টারিং
    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.displayName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });
    // UI Helpers
    const getRoleColor = (userRole) => {
        switch (userRole) {
            case 'super-admin': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            case 'admin': return 'bg-electric/10 text-electric border-electric/30';
            case 'editor': return 'bg-purple/10 text-purple border-purple/30';
            case 'client': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            default: return 'bg-white/5 text-soft-gray border-white/10';
        }
    };
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Shield, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'User Access & Roles' : 'ইউজার ও অ্যাক্সেস ম্যানেজমেন্ট'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Control permissions, assign admin roles, and manage client portal access." })] }) }), currentUserRole !== 'super-admin' && (_jsxs("div", { className: "bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-amber-500 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-amber-500", children: "Restricted Access" }), _jsxs("p", { className: "text-xs text-amber-500/70 mt-1", children: ["You are viewing this page as an ", currentUserRole, ". Only Super Admins can modify user roles."] })] })] })), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Search by name or email...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsxs("select", { className: "bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none appearance-none font-bold", value: roleFilter, onChange: (e) => setRoleFilter(e.target.value), children: [_jsx("option", { value: "All", children: "All Roles" }), _jsx("option", { value: "super-admin", children: "Super Admins" }), _jsx("option", { value: "admin", children: "Admins" }), _jsx("option", { value: "editor", children: "Editors" }), _jsx("option", { value: "client", children: "Clients" }), _jsx("option", { value: "user", children: "General Users" })] })] }), _jsx("div", { className: "glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray", children: _jsxs("tr", { children: [_jsx("th", { className: "px-8 py-5", children: "User Profile" }), _jsx("th", { className: "px-6 py-5", children: "System Role" }), _jsx("th", { className: "px-6 py-5", children: "Joined Date" }), _jsx("th", { className: "px-8 py-5 text-right", children: "Access Control" })] }) }), _jsx("tbody", { className: "divide-y divide-borderColor/50", children: loading ? ([...Array(4)].map((_, i) => (_jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 4, className: "px-8 py-8 bg-white/[0.01]" }) }, i)))) : filteredUsers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-8 py-20 text-center text-soft-gray", children: "No users found." }) })) : (filteredUsers.map((user) => (_jsxs("tr", { className: "group hover:bg-white/[0.02] transition-colors", children: [_jsx("td", { className: "px-8 py-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-navy border border-borderColor overflow-hidden flex items-center justify-center", children: user.photoURL ? (_jsx("img", { src: user.photoURL, alt: "", className: "w-full h-full object-cover" })) : (_jsx(UserIcon, { className: "w-5 h-5 text-white/20" })) }), _jsxs("div", { children: [_jsxs("h4", { className: "text-sm font-bold text-white flex items-center gap-2", children: [user.displayName || 'Unnamed User', user.uid === currentUser?.uid && _jsx("span", { className: "text-[9px] px-1.5 py-0.5 bg-electric/20 text-electric rounded-md uppercase", children: "You" })] }), _jsxs("p", { className: "text-[11px] text-soft-gray flex items-center gap-1.5 mt-1 font-mono", children: [_jsx(Mail, { className: "w-3 h-3" }), " ", user.email] })] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsx("span", { className: `px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleColor(user.role)}`, children: user.role }) }), _jsx("td", { className: "px-6 py-6", children: _jsxs("p", { className: "text-xs text-soft-gray flex items-center gap-1.5 font-mono", children: [_jsx(Calendar, { className: "w-3.5 h-3.5" }), user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Unknown'] }) }), _jsx("td", { className: "px-8 py-6 text-right", children: _jsxs("select", { disabled: currentUserRole !== 'super-admin' || user.uid === currentUser?.uid || updatingId === user.uid, value: user.role, onChange: (e) => handleRoleChange(user.uid, e.target.value), className: "bg-navy border border-borderColor rounded-xl px-4 py-2.5 text-xs text-white focus:border-electric outline-none disabled:opacity-30 disabled:cursor-not-allowed appearance-none min-w-[140px] text-center cursor-pointer transition-all hover:bg-navy-surface", children: [_jsx("option", { value: "super-admin", children: "Super Admin" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "editor", children: "Editor" }), _jsx("option", { value: "client", children: "Client" }), _jsx("option", { value: "user", children: "User" })] }) })] }, user.uid)))) })] }) }) })] }));
};
