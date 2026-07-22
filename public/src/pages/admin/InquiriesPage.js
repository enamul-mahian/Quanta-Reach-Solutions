import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getAllInquiries, updateInquiryStatus, deleteInquiry } from '/src/services/inquiryService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Search, Mail, Phone, Trash2, Eye, X, Download, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
export const InquiriesPage = () => {
    const { language } = useLanguage();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    // ১. ডাটা লোড করা
    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const data = await getAllInquiries();
            setInquiries(data);
        }
        catch (error) {
            toast.error(language === 'en' ? 'Failed to fetch inquiries' : 'ইনকোয়ারি লোড করতে ব্যর্থ হয়েছে');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchInquiries();
    }, []);
    // ২. স্ট্যাটাস আপডেট হ্যান্ডলার
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateInquiryStatus(id, newStatus);
            setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
            toast.success(language === 'en' ? `Status updated to ${newStatus}` : `স্ট্যাটাস ${newStatus} এ আপডেট হয়েছে`);
        }
        catch (error) {
            toast.error(language === 'en' ? 'Update failed' : 'আপডেট ব্যর্থ হয়েছে');
        }
    };
    // ৩. ডিলিট হ্যান্ডলার
    const handleDelete = async (id) => {
        if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this inquiry?' : 'আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?'))
            return;
        try {
            await deleteInquiry(id);
            setInquiries(prev => prev.filter(item => item.id !== id));
            toast.success(language === 'en' ? 'Inquiry deleted' : 'ইনকোয়ারি মুছে ফেলা হয়েছে');
        }
        catch (error) {
            toast.error(language === 'en' ? 'Delete failed' : 'ডিলিট ব্যর্থ হয়েছে');
        }
    };
    // ৪. ফিল্টারিং লজিক
    const filteredInquiries = inquiries.filter(item => {
        const matchesSearch = item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.projectType.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Won': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Lost': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Negotiation': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: language === 'en' ? 'Project Inquiries' : 'প্রজেক্ট ইনকোয়ারি সমূহ' }), _jsx("p", { className: "text-soft-gray text-sm", children: language === 'en' ? `Total ${filteredInquiries.length} leads found` : `মোট ${filteredInquiries.length}টি লিড পাওয়া গেছে` })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" }), _jsx("input", { type: "text", placeholder: language === 'en' ? "Search leads..." : "লিড খুঁজুন...", className: "bg-navy border border-borderColor rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-electric outline-none transition-all w-64", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsxs("select", { className: "bg-navy border border-borderColor rounded-xl px-4 py-2 text-sm text-white focus:border-electric outline-none", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [_jsx("option", { value: "All", children: "All Status" }), _jsx("option", { value: "New", children: "New" }), _jsx("option", { value: "Contacted", children: "Contacted" }), _jsx("option", { value: "Negotiation", children: "Negotiation" }), _jsx("option", { value: "Won", children: "Won" }), _jsx("option", { value: "Lost", children: "Lost" })] })] })] }), _jsx("div", { className: "glass-panel border-borderColor rounded-2xl overflow-hidden overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-white/[0.02] border-b border-borderColor text-xs font-mono uppercase tracking-widest text-soft-gray", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4", children: language === 'en' ? 'Client' : 'ক্লায়েন্ট' }), _jsx("th", { className: "px-6 py-4", children: language === 'en' ? 'Project' : 'প্রজেক্ট' }), _jsx("th", { className: "px-6 py-4", children: language === 'en' ? 'Budget' : 'বাজেট' }), _jsx("th", { className: "px-6 py-4", children: language === 'en' ? 'Status' : 'স্ট্যাটাস' }), _jsx("th", { className: "px-6 py-4", children: language === 'en' ? 'Date' : 'তারিখ' }), _jsx("th", { className: "px-6 py-4 text-right", children: language === 'en' ? 'Actions' : 'অ্যাকশন' })] }) }), _jsx("tbody", { className: "divide-y divide-borderColor", children: loading ? ([...Array(5)].map((_, i) => (_jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 6, className: "px-6 py-6 bg-white/[0.01]" }) }, i)))) : filteredInquiries.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-12 text-center text-soft-gray", children: "No inquiries matching your criteria." }) })) : (filteredInquiries.map((item) => (_jsxs("tr", { className: "hover:bg-white/[0.02] transition-colors group", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm font-bold text-white", children: item.fullName }), _jsx("span", { className: "text-xs text-soft-gray", children: item.email })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm text-white/80", children: item.projectType }), _jsx("span", { className: "text-[10px] text-electric uppercase font-bold", children: item.clientType })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: "text-sm font-mono font-bold text-white", children: [item.currency === 'USD' ? '$' : '৳', item.estimatedBudget] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(item.status)}`, children: item.status }) }), _jsx("td", { className: "px-6 py-4 text-xs text-soft-gray", children: item.createdAt?.toDate().toLocaleDateString() || 'Just now' }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => setSelectedInquiry(item), className: "p-2 hover:bg-electric/10 text-soft-gray hover:text-electric rounded-lg transition-all", title: "View Details", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(item.id), className: "p-2 hover:bg-red-500/10 text-soft-gray hover:text-red-400 rounded-lg transition-all", title: "Delete", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, item.id)))) })] }) }), selectedInquiry && (_jsxs("div", { className: "fixed inset-0 z-[2000] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-[#071426]/90 backdrop-blur-sm", onClick: () => setSelectedInquiry(null) }), _jsxs("div", { className: "relative w-full max-w-2xl bg-navy-surface border border-borderColor rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300", children: [_jsxs("div", { className: "p-6 border-b border-borderColor flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: selectedInquiry.fullName }), _jsx("p", { className: "text-xs text-soft-gray uppercase tracking-widest", children: selectedInquiry.companyName || 'No Company' })] }), _jsx("button", { onClick: () => setSelectedInquiry(null), className: "p-2 hover:bg-white/5 rounded-full text-soft-gray transition-all", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-8 max-h-[70vh] overflow-y-auto space-y-6 custom-scrollbar", children: [_jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-[10px] uppercase font-bold text-soft-gray block mb-1", children: "Contact Information" }), _jsxs("p", { className: "text-sm text-white flex items-center gap-2 mb-1", children: [_jsx(Mail, { className: "w-3.5 h-3.5 text-electric" }), " ", selectedInquiry.email] }), _jsxs("p", { className: "text-sm text-white flex items-center gap-2", children: [_jsx(Phone, { className: "w-3.5 h-3.5 text-electric" }), " ", selectedInquiry.phone] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[10px] uppercase font-bold text-soft-gray block mb-1", children: "Budget & Currency" }), _jsxs("p", { className: "text-lg font-mono font-bold text-white", children: [selectedInquiry.currency === 'USD' ? '$' : '৳', selectedInquiry.estimatedBudget] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[10px] uppercase font-bold text-soft-gray block mb-2", children: "Required Services" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedInquiry.requiredServices.map((s, i) => (_jsx("span", { className: "px-3 py-1 bg-electric/5 border border-electric/20 rounded-full text-[10px] font-medium text-electric", children: s }, i))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[10px] uppercase font-bold text-soft-gray block mb-2", children: "Project Description" }), _jsxs("div", { className: "p-4 bg-navy rounded-xl border border-borderColor text-sm text-white/70 leading-relaxed italic", children: ["\"", selectedInquiry.projectDescription, "\""] })] }), selectedInquiry.fileUrl && (_jsxs("a", { href: selectedInquiry.fileUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-borderColor rounded-xl text-sm font-bold text-white transition-all", children: [_jsx(Download, { className: "w-4 h-4 text-electric" }), " View Attachment Brief"] })), _jsxs("div", { className: "pt-4 border-t border-borderColor flex flex-wrap gap-3", children: [_jsxs("select", { value: selectedInquiry.status, onChange: (e) => handleStatusUpdate(selectedInquiry.id, e.target.value), className: "flex-1 bg-navy border border-borderColor rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-electric", children: [_jsx("option", { value: "New", children: "Status: New" }), _jsx("option", { value: "Contacted", children: "Status: Contacted" }), _jsx("option", { value: "Qualified", children: "Status: Qualified" }), _jsx("option", { value: "Proposal Sent", children: "Status: Proposal Sent" }), _jsx("option", { value: "Negotiation", children: "Status: Negotiation" }), _jsx("option", { value: "Won", children: "Status: Won" }), _jsx("option", { value: "Lost", children: "Status: Lost" })] }), _jsx("a", { href: `mailto:${selectedInquiry.email}`, className: "p-3 bg-electric/20 text-electric rounded-xl hover:bg-electric hover:text-navy transition-all", title: "Send Email", children: _jsx(Mail, { className: "w-5 h-5" }) }), selectedInquiry.whatsappNumber && (_jsx("a", { href: `https://wa.me/${selectedInquiry.whatsappNumber.replace(/[^0-9]/g, '')}`, target: "_blank", className: "p-3 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-navy transition-all", title: "WhatsApp Chat", children: _jsx(MessageSquare, { className: "w-5 h-5" }) }))] })] })] })] }))] }));
};
