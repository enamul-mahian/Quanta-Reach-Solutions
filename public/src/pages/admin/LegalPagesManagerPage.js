import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';

import { getAllLegalPages, updateLegalPage } from '/src/services/legalPageService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Scale, ShieldCheck, FileSignature, RefreshCcw, LockKeyhole, Edit3, X, Check, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
// ফিক্সড ৪টি লিগ্যাল পেজের কনফিগারেশন
const LEGAL_PAGES_CONFIG = [
    { type: 'privacy-policy', icon: ShieldCheck, title: 'Privacy Policy', desc: 'Rules on user data collection and processing.' },
    { type: 'terms-and-conditions', icon: FileSignature, title: 'Terms & Conditions', desc: 'General rules and guidelines for using the services.' },
    { type: 'refund-policy', icon: RefreshCcw, title: 'Refund Policy', desc: 'Conditions under which clients can request refunds.' },
    { type: 'nda-and-confidentiality', icon: LockKeyhole, title: 'NDA & Confidentiality', desc: 'Non-disclosure and privacy agreements for projects.' }
];
export const LegalPagesManagerPage = () => {
    const { language } = useLanguage();
    const [dbPages, setDbPages] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    // এডিটর ফর্ম স্টেট
    const initialFormState = {
        title: { en: '', bn: '' },
        content: { en: '', bn: '' },
        seo: { title: '', description: '', keywords: [] },
        status: 'Draft'
    };
    const [formData, setFormData] = useState(initialFormState);
    const [tagInput, setTagInput] = useState('');
    // ১. ডাটা ফেচিং
    const fetchLegalPages = async () => {
        setLoading(true);
        try {
            const data = await getAllLegalPages();
            // ডাটাবেস থেকে আসা অ্যারে-কে অবজেক্টে রূপান্তর করা হলো সহজে খোঁজার জন্য
            const pagesMap = {};
            data.forEach(page => {
                pagesMap[page.type] = page;
            });
            setDbPages(pagesMap);
        }
        catch (error) {
            toast.error('Failed to load legal pages');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchLegalPages();
    }, []);
    // ২. Quill এডিটর কনফিগারেশন
    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    }), []);
    // ৩. এডিটর ওপেন করা
    const openEditor = (type) => {
        setSelectedType(type);
        const existingData = dbPages[type];
        if (existingData) {
            setFormData({
                title: existingData.title,
                content: existingData.content,
                seo: existingData.seo || { title: '', description: '', keywords: [] },
                status: existingData.status
            });
        }
        else {
            // যদি ডাটাবেসে না থাকে, তাহলে ডিফল্ট টাইটেল দিয়ে শুরু হবে
            const config = LEGAL_PAGES_CONFIG.find(c => c.type === type);
            setFormData({
                ...initialFormState,
                title: { en: config?.title || '', bn: '' }
            });
        }
        setIsModalOpen(true);
    };
    // ৪. সাবমিট হ্যান্ডলার
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedType)
            return;
        if (!formData.title.en) {
            toast.error('English Title is required');
            return;
        }
        try {
            await updateLegalPage(selectedType, formData);
            toast.success('Legal page updated successfully');
            setIsModalOpen(false);
            fetchLegalPages();
        }
        catch (error) {
            console.error(error);
            toast.error('Failed to update legal page');
        }
    };
    const handleTagAdd = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.seo.keywords.includes(tagInput.trim())) {
                setFormData({
                    ...formData,
                    seo: { ...formData.seo, keywords: [...formData.seo.keywords, tagInput.trim()] }
                });
            }
            setTagInput('');
        }
    };
    const removeTag = (tag) => {
        setFormData({
            ...formData,
            seo: { ...formData.seo, keywords: formData.seo.keywords.filter(t => t !== tag) }
        });
    };
    if (loading) {
        return (_jsx("div", { className: "flex min-h-[60vh] items-center justify-center", role: "status", "aria-label": "Loading legal pages", children: _jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-2 border-electric border-t-transparent" }) }));
    }
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Scale, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Legal & Policy Pages' : 'লিগ্যাল পেজ ম্যানেজমেন্ট'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Manage your agency's privacy policies, terms, and NDAs." })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6", children: LEGAL_PAGES_CONFIG.map((config) => {
                    const pageData = dbPages[config.type];
                    const isPublished = pageData?.status === 'Published';
                    const Icon = config.icon;
                    return (_jsxs("div", { className: "glass-panel border-borderColor rounded-3xl p-6 flex flex-col justify-between group hover:border-electric transition-colors h-[280px]", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: `w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${pageData ? 'bg-electric/10 text-electric' : 'bg-navy border border-borderColor text-soft-gray'}`, children: _jsx(Icon, { className: "w-6 h-6" }) }), pageData && (_jsx("span", { className: `px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`, children: pageData.status }))] }), _jsx("h3", { className: "text-lg font-bold text-white mb-2", children: config.title }), _jsx("p", { className: "text-xs text-soft-gray leading-relaxed", children: config.desc })] }), _jsxs("div", { className: "mt-6 pt-6 border-t border-borderColor/50 flex items-center justify-between", children: [_jsx("span", { className: "text-[10px] font-mono text-soft-gray", children: pageData?.updatedAt ? `Updated: ${pageData.updatedAt.toDate().toLocaleDateString()}` : 'Not Created Yet' }), _jsx("button", { onClick: () => openEditor(config.type), className: `p-2.5 rounded-xl transition-all ${pageData ? 'bg-white/5 hover:bg-electric text-white hover:text-navy' : 'bg-electric hover:bg-electric-bright text-navy font-bold shadow-[0_5px_15px_rgba(22,139,255,0.2)]'}`, children: _jsx(Edit3, { className: "w-4 h-4" }) })] })] }, config.type));
                }) }), isModalOpen && selectedType && (_jsxs("div", { className: "fixed inset-0 z-[4000] flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-navy/98 backdrop-blur-xl" }), _jsxs("div", { className: "relative w-full h-full lg:w-[95%] lg:h-[95vh] bg-navy-surface border border-borderColor lg:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500", children: [_jsxs("div", { className: "p-6 lg:p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-electric/10 flex items-center justify-center text-electric", children: _jsx(Scale, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold text-white", children: [dbPages[selectedType] ? 'Edit' : 'Create', " ", LEGAL_PAGES_CONFIG.find(c => c.type === selectedType)?.title] }), _jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [_jsx("span", { className: "text-[10px] text-soft-gray uppercase tracking-widest font-mono", children: "Status" }), _jsx(ChevronRight, { className: "w-3 h-3 text-white/20" }), _jsx("span", { className: "text-[10px] text-electric uppercase tracking-widest font-mono", children: formData.status })] })] })] }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 space-y-16 pb-32", children: [_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 01. Legal Document Title"] }), _jsxs("div", { className: "space-y-4", children: [_jsx("input", { required: true, type: "text", placeholder: "Title (EN) - e.g. Privacy Policy", className: "w-full bg-navy border border-borderColor rounded-2xl px-6 py-4 text-lg font-bold text-white focus:border-electric outline-none", value: formData.title.en, onChange: (e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } }) }), _jsx("input", { type: "text", placeholder: "\u099F\u09BE\u0987\u099F\u09C7\u09B2 (\u09AC\u09BE\u0982\u09B2\u09BE) - \u09AF\u09C7\u09AE\u09A8: \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u09AA\u09B2\u09BF\u09B8\u09BF", className: "w-full bg-navy border border-borderColor rounded-2xl px-6 py-4 text-lg font-bold text-white focus:border-electric outline-none", value: formData.title.bn, onChange: (e) => setFormData({ ...formData, title: { ...formData.title, bn: e.target.value } }) })] })] }) }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 02. English Policy Content"] }), _jsx("div", { className: "bg-navy border border-borderColor rounded-3xl overflow-hidden min-h-[400px]", children: _jsx(ReactQuill, { theme: "snow", value: formData.content.en, onChange: (val) => setFormData({ ...formData, content: { ...formData.content, en: val } }), modules: quillModules, className: "h-[350px] text-white" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-purple uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-purple/30" }), " 03. \u09AC\u09BE\u0982\u09B2\u09BE \u09AA\u09B2\u09BF\u09B8\u09BF \u0995\u09A8\u09CD\u099F\u09C7\u09A8\u09CD\u099F (BN)"] }), _jsx("div", { className: "bg-navy border border-borderColor rounded-3xl overflow-hidden min-h-[400px]", children: _jsx(ReactQuill, { theme: "snow", value: formData.content.bn, onChange: (val) => setFormData({ ...formData, content: { ...formData.content, bn: val } }), modules: quillModules, className: "h-[350px] text-white" }) })] }), _jsxs("div", { className: "space-y-6 pb-20", children: [_jsxs("h3", { className: "text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-amber-500/30" }), " 04. Metadata & Status"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 bg-navy/30 border border-borderColor rounded-3xl p-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: "SEO Meta Title", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white", value: formData.seo.title, onChange: (e) => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } }) }), _jsx("textarea", { rows: 3, placeholder: "Meta Description for Search Engines", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white resize-none", value: formData.seo.description, onChange: (e) => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "text", placeholder: "Keywords (Press Enter)", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white", value: tagInput, onChange: (e) => setTagInput(e.target.value), onKeyDown: handleTagAdd }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: formData.seo.keywords.map(tag => (_jsxs("span", { className: "flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-soft-gray rounded-md", children: [tag, " ", _jsx("button", { type: "button", onClick: () => removeTag(tag), children: _jsx(X, { className: "w-3 h-3 hover:text-white" }) })] }, tag))) })] }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white outline-none appearance-none", value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { value: "Draft", children: "Save as Draft (Hidden)" }), _jsx("option", { value: "Published", children: "Publish Live" })] })] })] })] }), _jsxs("div", { className: "fixed bottom-0 left-0 right-0 p-6 bg-navy-surface/80 backdrop-blur-xl border-t border-borderColor z-10 flex items-center justify-end gap-4 shadow-[0_-10px_40px_rgba(7,20,38,0.5)]", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-8 py-3 bg-white/5 text-white font-bold rounded-xl transition-all", children: "Discard" }), _jsxs("button", { type: "submit", className: "px-12 py-3 bg-electric hover:bg-electric-bright text-navy font-black rounded-xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2", children: [_jsx(Check, { className: "w-5 h-5" }), dbPages[selectedType] ? 'Update Policy' : 'Create Policy'] })] })] })] })] }))] }));
};
