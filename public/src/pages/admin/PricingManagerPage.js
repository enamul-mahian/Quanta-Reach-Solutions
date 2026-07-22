import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getPricingPackages, createPricingPackage, updatePricingPackage, deletePricingPackage, togglePackageStatus, togglePackageRecommended } from '/src/services/pricingService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Plus, Search, Edit3, Trash2, Star, Tag, X, Check, Clock, RefreshCcw, Zap, Globe2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
export const PricingManagerPage = () => {
    const { language } = useLanguage();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    // ইনিশিয়াল ফর্ম স্টেট
    const initialFormState = {
        name: { en: '', bn: '' },
        description: { en: '', bn: '' },
        priceBDT: 0,
        priceUSD: 0,
        pricingType: 'Starting From',
        features: [],
        deliveryTime: { en: '', bn: '' },
        revisionLimit: 'Unlimited',
        supportPeriod: { en: '', bn: '' },
        availability: 'Both',
        isRecommended: false,
        ctaLabel: { en: 'Get Started', bn: 'শুরু করুন' },
        status: 'Active',
        sortOrder: 0
    };
    const [formData, setFormData] = useState(initialFormState);
    // ডাইনামিক ফিচার স্টেট
    const [newFeature, setNewFeature] = useState({
        text: { en: '', bn: '' },
        included: true
    });
    // ডাটা লোড করা
    const fetchPackages = async () => {
        setLoading(true);
        try {
            const data = await getPricingPackages({ includeInactive: true });
            setPackages(data);
        }
        catch (error) {
            toast.error('Failed to load pricing packages');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPackages();
    }, []);
    // ফিচার হ্যান্ডলিং
    const addFeature = () => {
        if (!newFeature.text.en)
            return;
        setFormData({ ...formData, features: [...formData.features, newFeature] });
        setNewFeature({ text: { en: '', bn: '' }, included: true });
    };
    const removeFeature = (index) => {
        setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
    };
    // সাবমিট হ্যান্ডলার
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.en || formData.priceBDT <= 0) {
            toast.error('Name and Price are required');
            return;
        }
        try {
            if (editMode && currentId) {
                await updatePricingPackage(currentId, formData);
                toast.success('Package updated');
            }
            else {
                await createPricingPackage(formData);
                toast.success('New package created');
            }
            setIsModalOpen(false);
            fetchPackages();
        }
        catch (error) {
            toast.error('Submission failed');
        }
    };
    const openEditModal = (pkg) => {
        setEditMode(true);
        setCurrentId(pkg.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...rest } = pkg;
        setFormData(rest);
        setIsModalOpen(true);
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this pricing package?'))
            return;
        try {
            await deletePricingPackage(id);
            toast.success('Package removed');
            fetchPackages();
        }
        catch (error) {
            toast.error('Delete failed');
        }
    };
    const filteredPackages = packages.filter(p => p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.bn.includes(searchQuery));
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Tag, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Pricing & Packages' : 'প্রাইসিং ও প্যাকেজ সমূহ'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Manage your service tiers, BDT/USD pricing, and feature comparisons." })] }), _jsxs("button", { onClick: () => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }, className: "flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-bright text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)]", children: [_jsx(Plus, { className: "w-5 h-5" }), language === 'en' ? 'Create Package' : 'প্যাকেজ তৈরি করুন'] })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Search packages...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsx("div", { className: "glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray", children: _jsxs("tr", { children: [_jsx("th", { className: "px-8 py-5", children: "Package Identity" }), _jsx("th", { className: "px-6 py-5", children: "Price (BDT / USD)" }), _jsx("th", { className: "px-6 py-5", children: "Availability" }), _jsx("th", { className: "px-6 py-5", children: "Status" }), _jsx("th", { className: "px-8 py-5 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-borderColor/50", children: loading ? ([...Array(3)].map((_, i) => (_jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 5, className: "px-8 py-10 bg-white/[0.01]" }) }, i)))) : filteredPackages.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-8 py-20 text-center text-soft-gray", children: "No packages defined yet." }) })) : (filteredPackages.map((pkg) => (_jsxs("tr", { className: "group hover:bg-white/[0.02] transition-colors", children: [_jsx("td", { className: "px-8 py-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${pkg.isRecommended ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/5 text-white/30'}`, children: _jsx(Zap, { className: `w-5 h-5 ${pkg.isRecommended ? 'fill-current' : ''}` }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-white group-hover:text-electric transition-colors", children: pkg.name.en }), _jsx("p", { className: "text-[11px] text-soft-gray", children: pkg.pricingType })] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsxs("div", { className: "flex flex-col", children: [_jsxs("span", { className: "text-sm font-mono font-bold text-white", children: ["\u09F3", pkg.priceBDT.toLocaleString()] }), _jsxs("span", { className: "text-xs text-soft-gray", children: ["$", pkg.priceUSD] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsxs("span", { className: "flex items-center gap-1.5 text-[10px] font-bold text-white/50 uppercase", children: [pkg.availability === 'Global' ? _jsx(Globe2, { className: "w-3.5 h-3.5 text-purple" }) : _jsx(MapPin, { className: "w-3.5 h-3.5 text-amber-500" }), pkg.availability] }) }), _jsx("td", { className: "px-6 py-6", children: _jsx("button", { onClick: () => togglePackageStatus(pkg.id, pkg.status).then(fetchPackages), className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${pkg.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-white/5 text-white/20 border-white/5'}`, children: pkg.status }) }), _jsx("td", { className: "px-8 py-6 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => togglePackageRecommended(pkg.id, pkg.isRecommended).then(fetchPackages), className: `p-2 rounded-lg transition-all ${pkg.isRecommended ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-white/10 hover:text-white'}`, title: "Set as Recommended", children: _jsx(Star, { className: `w-4 h-4 ${pkg.isRecommended ? 'fill-current' : ''}` }) }), _jsx("button", { onClick: () => openEditModal(pkg), className: "p-2 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-lg transition-all", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(pkg.id), className: "p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, pkg.id)))) })] }) }) }), isModalOpen && (_jsxs("div", { className: "fixed inset-0 z-[3000] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-navy/98 backdrop-blur-xl", onClick: () => setIsModalOpen(false) }), _jsxs("div", { className: "relative w-full max-w-5xl bg-navy-surface border border-borderColor rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300", children: [_jsxs("div", { className: "p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [_jsx(Tag, { className: "text-electric" }), editMode ? 'Modify Pricing Tier' : 'New Pricing Package'] }), _jsx("p", { className: "text-xs text-soft-gray mt-1 uppercase tracking-widest font-mono", children: "Bilingual Revenue Optimization" })] }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-10 overflow-y-auto custom-scrollbar space-y-12", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 01. Naming"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Package Name (EN)" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none", value: formData.name.en, onChange: (e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "\u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C\u09C7\u09B0 \u09A8\u09BE\u09AE (\u09AC\u09BE\u0982\u09B2\u09BE)" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none", value: formData.name.bn, onChange: (e) => setFormData({ ...formData, name: { ...formData.name, bn: e.target.value } }) })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 02. Commercials"] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Price (BDT \u09F3)" }), _jsx("input", { required: true, type: "number", className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none font-mono", value: formData.priceBDT, onChange: (e) => setFormData({ ...formData, priceBDT: Number(e.target.value) }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Price (USD $)" }), _jsx("input", { required: true, type: "number", className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none font-mono", value: formData.priceUSD, onChange: (e) => setFormData({ ...formData, priceUSD: Number(e.target.value) }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Market Availability" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none appearance-none", value: formData.availability, onChange: (e) => setFormData({ ...formData, availability: e.target.value }), children: [_jsx("option", { value: "Both", children: "Global & Local" }), _jsx("option", { value: "Local", children: "Local (Bangladesh) Only" }), _jsx("option", { value: "Global", children: "Global (International) Only" })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 03. Dynamic Feature List"] }), _jsxs("div", { className: "bg-navy border border-borderColor rounded-3xl p-8 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-4 items-end", children: [_jsxs("div", { className: "md:col-span-5 space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Feature (EN)" }), _jsx("input", { type: "text", className: "w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-electric", value: newFeature.text.en, onChange: (e) => setNewFeature({ ...newFeature, text: { ...newFeature.text, en: e.target.value } }), placeholder: "e.g. Free Domain Registration" })] }), _jsxs("div", { className: "md:col-span-5 space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "\u09AB\u09BF\u099A\u09BE\u09B0 (\u09AC\u09BE\u0982\u09B2\u09BE)" }), _jsx("input", { type: "text", className: "w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-electric", value: newFeature.text.bn, onChange: (e) => setNewFeature({ ...newFeature, text: { ...newFeature.text, bn: e.target.value } }) })] }), _jsx("div", { className: "md:col-span-2", children: _jsxs("button", { type: "button", onClick: addFeature, className: "w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-borderColor flex items-center justify-center gap-2 text-xs font-bold transition-all", children: [_jsx(Plus, { className: "w-4 h-4" }), " Add"] }) })] }), _jsxs("div", { className: "space-y-3 pt-4 border-t border-borderColor/30", children: [formData.features.map((feature, idx) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl group", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { type: "button", onClick: () => {
                                                                                    const updated = [...formData.features];
                                                                                    updated[idx].included = !updated[idx].included;
                                                                                    setFormData({ ...formData, features: updated });
                                                                                }, children: _jsx(Check, { className: `w-5 h-5 ${feature.included ? 'text-emerald-400' : 'text-white/10'}` }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-white", children: feature.text.en }), _jsx("p", { className: "text-[10px] text-soft-gray", children: feature.text.bn })] })] }), _jsx("button", { type: "button", onClick: () => removeFeature(idx), className: "opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, idx))), formData.features.length === 0 && _jsx("p", { className: "text-center text-[10px] text-white/10 uppercase tracking-[0.2em] py-4", children: "No features added yet" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Delivery Time (EN)" }), _jsxs("div", { className: "relative", children: [_jsx(Clock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-4 text-white focus:border-electric outline-none", value: formData.deliveryTime.en, onChange: (e) => setFormData({ ...formData, deliveryTime: { ...formData.deliveryTime, en: e.target.value } }), placeholder: "e.g. 15-20 Days" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Revisions" }), _jsxs("div", { className: "relative", children: [_jsx(RefreshCcw, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-4 text-white focus:border-electric outline-none", value: formData.revisionLimit, onChange: (e) => setFormData({ ...formData, revisionLimit: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Sort Order" }), _jsx("input", { type: "number", className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none font-mono", value: formData.sortOrder, onChange: (e) => setFormData({ ...formData, sortOrder: Number(e.target.value) }) })] })] }), _jsxs("div", { className: "pt-10 border-t border-borderColor flex items-center justify-end gap-4", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all", children: "Discard" }), _jsxs("button", { type: "submit", className: "px-12 py-4 bg-electric hover:bg-electric-bright text-navy font-black rounded-2xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2", children: [_jsx(Check, { className: "w-5 h-5" }), editMode ? 'Update Package' : 'Publish Package'] })] })] })] })] }))] }));
};
