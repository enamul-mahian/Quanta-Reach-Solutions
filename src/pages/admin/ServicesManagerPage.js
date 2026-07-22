import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getServices, createService, updateService, deleteService, toggleFeatured } from '/src/services/serviceService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Plus, Search, Edit3, Trash2, Star, Globe, DollarSign, Layout, X, Check, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';
export const ServicesManagerPage = () => {
    const { language } = useLanguage();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    // ফর্মের প্রফেশনাল স্টেট
    const initialFormState = {
        title: { en: '', bn: '' },
        slug: '',
        shortDescription: { en: '', bn: '' },
        fullContent: { en: '', bn: '' },
        icon: 'Layout',
        coverImage: '',
        gallery: [],
        keyBenefits: { en: [], bn: [] },
        deliverables: { en: [], bn: [] },
        process: { en: [], bn: [] },
        timeline: '',
        startingPriceBDT: 0,
        startingPriceUSD: 0,
        pricingType: 'Custom Quote',
        faqs: [],
        seo: { title: '', description: '', keywords: [], ogImage: '' },
        status: 'Draft',
        isFeatured: false,
        sortOrder: 0
    };
    const [formData, setFormData] = useState(initialFormState);
    // ১. ডাটা ফেচিং
    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await getServices(true); // ড্রাফটসহ সব লোড হবে
            setServices(data);
        }
        catch (error) {
            toast.error('Failed to load services');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchServices();
    }, []);
    // ২. স্লাগ জেনারেশন লজিক
    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };
    // ৩. ইনপুট হ্যান্ডলিং
    const handleTitleChange = (val, lang) => {
        setFormData(prev => {
            const newState = { ...prev, title: { ...prev.title, [lang]: val } };
            if (lang === 'en' && !editMode) {
                newState.slug = generateSlug(val);
            }
            return newState;
        });
    };
    // ৪. সাবমিট হ্যান্ডলার (Create & Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.en || !formData.slug) {
            toast.error('English Title and Slug are required!');
            return;
        }
        try {
            if (editMode && currentId) {
                await updateService(currentId, formData);
                toast.success('Service updated successfully');
            }
            else {
                await createService(formData);
                toast.success('Service created successfully');
            }
            setIsModalOpen(false);
            fetchServices();
        }
        catch (error) {
            toast.error('An error occurred during submission');
        }
    };
    // ৫. এডিট মুড ওপেন
    const openEditModal = (service) => {
        setEditMode(true);
        setCurrentId(service.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...rest } = service;
        setFormData(rest);
        setIsModalOpen(true);
    };
    // ৬. ডিলিট হ্যান্ডলার
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service permanently?'))
            return;
        try {
            await deleteService(id);
            toast.success('Service deleted');
            fetchServices();
        }
        catch (error) {
            toast.error('Failed to delete');
        }
    };
    const filteredServices = services.filter(s => s.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.bn.includes(searchQuery));
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Settings2, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Services Management' : 'সার্ভিস ম্যানেজমেন্ট'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Create and manage bilingual service offerings with real-time updates." })] }), _jsxs("button", { onClick: () => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }, className: "flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-bright text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)] active:scale-95", children: [_jsx(Plus, { className: "w-5 h-5" }), language === 'en' ? 'Add New Service' : 'নতুন সার্ভিস যোগ করুন'] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsxs("div", { className: "lg:col-span-3 relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: language === 'en' ? "Search services..." : "সার্ভিস খুঁজুন...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsxs("div", { className: "bg-navy-surface border border-borderColor rounded-2xl p-4 flex items-center justify-between", children: [_jsx("span", { className: "text-soft-gray text-sm font-medium", children: "Total Published" }), _jsx("span", { className: "text-2xl font-bold text-electric", children: services.filter(s => s.status === 'Published').length })] })] }), _jsx("div", { className: "glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray", children: _jsxs("tr", { children: [_jsx("th", { className: "px-8 py-5", children: "Service Overview" }), _jsx("th", { className: "px-6 py-5", children: "Pricing (USD / BDT)" }), _jsx("th", { className: "px-6 py-5", children: "Featured" }), _jsx("th", { className: "px-6 py-5", children: "Status" }), _jsx("th", { className: "px-8 py-5 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-borderColor/50", children: loading ? ([...Array(3)].map((_, i) => (_jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 5, className: "px-8 py-10 bg-white/[0.01]" }) }, i)))) : filteredServices.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-8 py-20 text-center text-soft-gray font-light", children: "No services found. Start by adding one." }) })) : (filteredServices.map((service) => (_jsxs("tr", { className: "group hover:bg-white/[0.02] transition-colors", children: [_jsx("td", { className: "px-8 py-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-electric/10 border border-electric/20 flex items-center justify-center text-electric group-hover:scale-110 transition-transform", children: _jsx(Layout, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-base font-bold text-white group-hover:text-electric transition-colors", children: service.title.en }), _jsx("p", { className: "text-xs text-soft-gray mt-0.5", children: service.title.bn })] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsxs("div", { className: "flex flex-col", children: [_jsxs("span", { className: "text-sm font-mono font-bold text-white", children: ["$", service.startingPriceUSD] }), _jsxs("span", { className: "text-xs text-soft-gray", children: ["\u09F3", service.startingPriceBDT] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsx("button", { onClick: () => toggleFeatured(service.id, service.isFeatured).then(fetchServices), className: `p-2 rounded-xl transition-all ${service.isFeatured ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-soft-gray bg-white/5 border border-white/5'}`, children: _jsx(Star, { className: `w-5 h-5 ${service.isFeatured ? 'fill-current' : ''}` }) }) }), _jsx("td", { className: "px-6 py-6", children: _jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${service.status === 'Published'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-white/5 text-white/40 border-white/10'}`, children: service.status }) }), _jsx("td", { className: "px-8 py-6 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => openEditModal(service), className: "p-2.5 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-xl transition-all", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(service.id), className: "p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, service.id)))) })] }) }) }), isModalOpen && (_jsxs("div", { className: "fixed inset-0 z-[3000] flex items-center justify-center p-4 lg:p-8", children: [_jsx("div", { className: "absolute inset-0 bg-navy/95 backdrop-blur-md", onClick: () => setIsModalOpen(false) }), _jsxs("div", { className: "relative w-full max-w-5xl bg-navy-surface border border-borderColor rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-300", children: [_jsxs("div", { className: "p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [editMode ? _jsx(Edit3, { className: "text-electric" }) : _jsx(Plus, { className: "text-electric" }), editMode ? 'Edit Service Listing' : 'Create New Agency Service'] }), _jsx("p", { className: "text-xs text-soft-gray uppercase tracking-widest mt-1", children: "Global & Local Sync Enabled" })] }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "p-3 hover:bg-white/5 rounded-2xl text-soft-gray hover:text-white transition-all border border-transparent hover:border-borderColor", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-8 overflow-y-auto custom-scrollbar flex-1 space-y-10", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-sm font-bold text-electric uppercase tracking-widest flex items-center gap-2", children: [_jsx("span", { className: "w-8 h-[1px] bg-electric/30" }), " 1. Core Identity"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "Service Title (English)" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.title.en, onChange: (e) => handleTitleChange(e.target.value, 'en'), placeholder: "e.g. Enterprise Web Development" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "\u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u099F\u09BE\u0987\u099F\u09C7\u09B2 (\u09AC\u09BE\u0982\u09B2\u09BE)" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.title.bn, onChange: (e) => handleTitleChange(e.target.value, 'bn'), placeholder: "\u09AF\u09C7\u09AE\u09A8: \u098F\u09A8\u09CD\u099F\u09BE\u09B0\u09AA\u09CD\u09B0\u09BE\u0987\u099C \u0993\u09AF\u09BC\u09C7\u09AC \u09A1\u09C7\u09AD\u09C7\u09B2\u09AA\u09AE\u09C7\u09A8\u09CD\u099F" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "URL Slug (Auto-generated)" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Globe, { className: "w-4 h-4 text-soft-gray" }), _jsx("input", { required: true, type: "text", className: "flex-1 bg-navy/50 border border-borderColor rounded-xl px-4 py-3 text-electric font-mono text-sm outline-none", value: formData.slug, onChange: (e) => setFormData({ ...formData, slug: generateSlug(e.target.value) }) })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-sm font-bold text-electric uppercase tracking-widest flex items-center gap-2", children: [_jsx("span", { className: "w-8 h-[1px] bg-electric/30" }), " 2. Commercials & Status"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "Price (USD)" }), _jsxs("div", { className: "relative", children: [_jsx(DollarSign, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" }), _jsx("input", { type: "number", className: "w-full bg-navy border border-borderColor rounded-xl pl-10 pr-4 py-3 text-white focus:border-electric outline-none", value: formData.startingPriceUSD, onChange: (e) => setFormData({ ...formData, startingPriceUSD: Number(e.target.value) }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "Price (BDT)" }), _jsxs("div", { className: "relative font-sans font-bold flex items-center", children: [_jsx("span", { className: "absolute left-4 text-soft-gray", children: "\u09F3" }), _jsx("input", { type: "number", className: "w-full bg-navy border border-borderColor rounded-xl pl-10 pr-4 py-3 text-white focus:border-electric outline-none", value: formData.startingPriceBDT, onChange: (e) => setFormData({ ...formData, startingPriceBDT: Number(e.target.value) }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "Status" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none", value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { value: "Draft", children: "Draft (Hidden)" }), _jsx("option", { value: "Published", children: "Published (Live)" })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-sm font-bold text-electric uppercase tracking-widest flex items-center gap-2", children: [_jsx("span", { className: "w-8 h-[1px] bg-electric/30" }), " 3. Content Strategy"] }), _jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "Short Description (English)" }), _jsx("textarea", { rows: 3, className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none resize-none", value: formData.shortDescription.en, onChange: (e) => setFormData({ ...formData, shortDescription: { ...formData.shortDescription, en: e.target.value } }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "\u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4 \u09AC\u09B0\u09CD\u09A3\u09A8\u09BE (\u09AC\u09BE\u0982\u09B2\u09BE)" }), _jsx("textarea", { rows: 3, className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none resize-none", value: formData.shortDescription.bn, onChange: (e) => setFormData({ ...formData, shortDescription: { ...formData.shortDescription, bn: e.target.value } }) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-sm font-bold text-electric uppercase tracking-widest flex items-center gap-2", children: [_jsx("span", { className: "w-8 h-[1px] bg-electric/30" }), " 4. Search Engine Optimization"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "SEO Meta Title" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.seo.title, onChange: (e) => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-mono text-soft-gray uppercase", children: "SEO Keywords (Comma separated)" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none font-mono text-xs", placeholder: "web development, react, agency", onChange: (e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value.split(',') } }) })] })] })] }), _jsxs("div", { className: "pt-10 border-t border-borderColor flex items-center justify-end gap-4", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all", children: "Discard Changes" }), _jsxs("button", { type: "submit", className: "px-10 py-3.5 bg-electric hover:bg-electric-bright text-navy font-black rounded-2xl transition-all shadow-[0_10px_30px_rgba(22,139,255,0.3)] active:scale-95 flex items-center gap-2", children: [_jsx(Check, { className: "w-5 h-5" }), editMode ? 'Update Database' : 'Publish Service'] })] })] })] })] }))] }));
};
