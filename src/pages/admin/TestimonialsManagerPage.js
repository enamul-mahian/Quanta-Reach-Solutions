import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonialFeatured, toggleTestimonialVerified } from '/src/services/testimonialService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Plus, Search, Edit2, Trash2, Star, Quote, X, Check, User, Building2, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
export const TestimonialsManagerPage = () => {
    const { language } = useLanguage();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    // ইনিশিয়াল ফর্ম স্টেট
    const initialFormState = {
        clientName: '',
        company: '',
        country: '',
        clientType: 'Global',
        photo: '',
        companyLogo: '',
        rating: 5,
        content: { en: '', bn: '' },
        serviceName: '',
        projectLink: '',
        videoUrl: '',
        isFeatured: false,
        isVerified: true,
        status: 'Published',
        sortOrder: 0
    };
    const [formData, setFormData] = useState(initialFormState);
    // ডাটা লোড করা
    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const data = await getTestimonials({ includeDrafts: true });
            setTestimonials(data);
        }
        catch (error) {
            toast.error('Failed to load testimonials');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTestimonials();
    }, []);
    // সাবমিট হ্যান্ডলার
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.clientName || !formData.content.en) {
            toast.error('Client name and English review are required');
            return;
        }
        try {
            if (editMode && currentId) {
                await updateTestimonial(currentId, formData);
                toast.success('Testimonial updated');
            }
            else {
                await createTestimonial(formData);
                toast.success('New testimonial added');
            }
            setIsModalOpen(false);
            fetchTestimonials();
        }
        catch (error) {
            toast.error('An error occurred');
        }
    };
    const openEditModal = (t) => {
        setEditMode(true);
        setCurrentId(t.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...rest } = t;
        setFormData(rest);
        setIsModalOpen(true);
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this testimonial permanently?'))
            return;
        try {
            await deleteTestimonial(id);
            toast.success('Deleted successfully');
            fetchTestimonials();
        }
        catch (error) {
            toast.error('Failed to delete');
        }
    };
    const filteredData = testimonials.filter(t => t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.company.toLowerCase().includes(searchQuery.toLowerCase()));
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Quote, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Client Testimonials' : 'ক্লায়েন্ট টেস্টিমোনিয়াল'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Showcase social proof and build trust with verified client success stories." })] }), _jsxs("button", { onClick: () => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }, className: "flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-bright text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)]", children: [_jsx(Plus, { className: "w-5 h-5" }), language === 'en' ? 'Add Review' : 'রিভিউ যোগ করুন'] })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Search by client name or company...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsx("div", { className: "glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray", children: _jsxs("tr", { children: [_jsx("th", { className: "px-8 py-5", children: "Client Info" }), _jsx("th", { className: "px-6 py-5", children: "Rating & Review" }), _jsx("th", { className: "px-6 py-5", children: "Verification" }), _jsx("th", { className: "px-6 py-5", children: "Featured" }), _jsx("th", { className: "px-8 py-5 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-borderColor/50", children: loading ? ([...Array(3)].map((_, i) => (_jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 5, className: "px-8 py-10 bg-white/[0.01]" }) }, i)))) : filteredData.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-8 py-20 text-center text-soft-gray", children: "No testimonials found." }) })) : (filteredData.map((item) => (_jsxs("tr", { className: "group hover:bg-white/[0.02] transition-colors", children: [_jsx("td", { className: "px-8 py-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-navy border border-borderColor overflow-hidden flex items-center justify-center", children: item.photo ? (_jsx("img", { src: item.photo, alt: "", className: "w-full h-full object-cover" })) : (_jsx(User, { className: "w-5 h-5 text-white/20" })) }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-white group-hover:text-electric transition-colors", children: item.clientName }), _jsxs("p", { className: "text-[11px] text-soft-gray flex items-center gap-1", children: [_jsx(Building2, { className: "w-3 h-3" }), " ", item.company] })] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("div", { className: "flex text-amber-500", children: [...Array(5)].map((_, i) => (_jsx(Star, { className: `w-3 h-3 ${i < item.rating ? 'fill-current' : 'text-white/10'}` }, i))) }), _jsxs("p", { className: "text-xs text-soft-gray line-clamp-2 italic max-w-xs", children: ["\"", item.content.en, "\""] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsxs("button", { onClick: () => toggleTestimonialVerified(item.id, item.isVerified).then(fetchTestimonials), className: `flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${item.isVerified
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    : 'bg-white/5 text-white/20 border-white/5'}`, children: [_jsx(BadgeCheck, { className: "w-3.5 h-3.5" }), item.isVerified ? 'VERIFIED' : 'PENDING'] }) }), _jsx("td", { className: "px-6 py-6", children: _jsx("button", { onClick: () => toggleTestimonialFeatured(item.id, item.isFeatured).then(fetchTestimonials), className: `p-2 rounded-xl transition-all ${item.isFeatured ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-white/10 hover:text-white'}`, children: _jsx(Star, { className: `w-4 h-4 ${item.isFeatured ? 'fill-current' : ''}` }) }) }), _jsx("td", { className: "px-8 py-6 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => openEditModal(item), className: "p-2.5 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-xl transition-all", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(item.id), className: "p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, item.id)))) })] }) }) }), isModalOpen && (_jsxs("div", { className: "fixed inset-0 z-[3000] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-navy/98 backdrop-blur-xl", onClick: () => setIsModalOpen(false) }), _jsxs("div", { className: "relative w-full max-w-4xl bg-navy-surface border border-borderColor rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300", children: [_jsxs("div", { className: "p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [_jsx(Quote, { className: "text-electric" }), editMode ? 'Update Client Feedback' : 'Add New Testimonial'] }), _jsx("p", { className: "text-xs text-soft-gray mt-1 uppercase tracking-widest", children: "Building Proof of Excellence" })] }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-10 overflow-y-auto custom-scrollbar space-y-10", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Client Name" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.clientName, onChange: (e) => setFormData({ ...formData, clientName: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Company / Brand" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.company, onChange: (e) => setFormData({ ...formData, company: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Client Photo (Cloudinary URL)" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none font-mono text-xs", value: formData.photo, onChange: (e) => setFormData({ ...formData, photo: e.target.value }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-end", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Client Satisfaction Rating" }), _jsx("div", { className: "flex gap-2 p-2 bg-navy border border-borderColor rounded-xl w-fit", children: [1, 2, 3, 4, 5].map((star) => (_jsx("button", { type: "button", onClick: () => setFormData({ ...formData, rating: star }), className: `transition-all ${star <= formData.rating ? 'text-amber-500' : 'text-white/10'}`, children: _jsx(Star, { className: `w-6 h-6 ${star <= formData.rating ? 'fill-current' : ''}` }) }, star))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Service Provided" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.serviceName, onChange: (e) => setFormData({ ...formData, serviceName: e.target.value }), placeholder: "e.g. Full Stack Development" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-[10px] font-bold text-electric uppercase tracking-widest", children: "English Review" }), _jsx("textarea", { rows: 5, className: "w-full bg-navy border border-borderColor rounded-2xl px-5 py-4 text-white focus:border-electric outline-none resize-none", value: formData.content.en, onChange: (e) => setFormData({ ...formData, content: { ...formData.content, en: e.target.value } }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-[10px] font-bold text-purple uppercase tracking-widest", children: "\u09AC\u09BE\u0982\u09B2\u09BE \u09B0\u09BF\u09AD\u09BF\u0989 (Bangla)" }), _jsx("textarea", { rows: 5, className: "w-full bg-navy border border-borderColor rounded-2xl px-5 py-4 text-white focus:border-electric outline-none resize-none", value: formData.content.bn, onChange: (e) => setFormData({ ...formData, content: { ...formData.content, bn: e.target.value } }) })] })] }), _jsxs("div", { className: "pt-10 border-t border-borderColor flex items-center justify-end gap-4", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all", children: "Discard" }), _jsxs("button", { type: "submit", className: "px-12 py-4 bg-electric hover:bg-electric-bright text-navy font-black rounded-2xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2", children: [_jsx(Check, { className: "w-5 h-5" }), editMode ? 'Update Testimonial' : 'Publish Review'] })] })] })] })] }))] }));
};
