import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getAllMeetings, updateMeetingDetails, deleteMeetingRequest } from '/src/services/meetingService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { CalendarDays, Search, Video, MapPin, Clock, User, Mail, Phone, Globe2, Link as LinkIcon, MessageSquare, Trash2, X, Check, Eye, CalendarCheck2 } from 'lucide-react';
import toast from 'react-hot-toast';
export const MeetingRequestsPage = () => {
    const { language } = useLanguage();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    // মডালের জন্য এডিটেবল স্টেট
    const [modalStatus, setModalStatus] = useState('Pending');
    const [modalLink, setModalLink] = useState('');
    const [modalInstructions, setModalInstructions] = useState('');
    const [modalNotes, setModalNotes] = useState('');
    // ১. ডাটা ফেচিং
    const fetchMeetings = async () => {
        setLoading(true);
        try {
            const data = await getAllMeetings();
            setMeetings(data);
        }
        catch (error) {
            toast.error('Failed to load meeting requests');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMeetings();
    }, []);
    // ২. মডাল ওপেন হ্যান্ডলার
    const openModal = (meeting) => {
        setSelectedMeeting(meeting);
        setModalStatus(meeting.status);
        setModalLink(meeting.meetingLink || '');
        setModalInstructions(meeting.officeInstructions || '');
        setModalNotes(meeting.adminNotes || '');
        setIsModalOpen(true);
    };
    // ৩. আপডেট হ্যান্ডলার
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedMeeting?.id)
            return;
        setUpdateLoading(true);
        try {
            await updateMeetingDetails(selectedMeeting.id, {
                status: modalStatus,
                meetingLink: modalLink,
                officeInstructions: modalInstructions,
                adminNotes: modalNotes
            });
            toast.success('Meeting updated successfully');
            setIsModalOpen(false);
            fetchMeetings();
        }
        catch (error) {
            toast.error('Failed to update meeting');
        }
        finally {
            setUpdateLoading(false);
        }
    };
    // ৪. ডিলিট হ্যান্ডলার
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this meeting request?'))
            return;
        try {
            await deleteMeetingRequest(id);
            toast.success('Meeting request deleted');
            setMeetings(prev => prev.filter(m => m.id !== id));
        }
        catch (error) {
            toast.error('Failed to delete request');
        }
    };
    // ফিল্টারিং
    const filteredMeetings = meetings.filter(m => {
        const matchesSearch = m.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.meetingTopic.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-electric/10 text-electric border-electric/20';
            case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Rescheduled': return 'bg-purple/10 text-purple border-purple/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(CalendarDays, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Meeting Requests' : 'মিটিং রিকোয়েস্ট সমূহ'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Manage client consultations, schedule online calls, and setup office visits." })] }) }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Search by client, company, or topic...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsxs("select", { className: "bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none font-bold", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [_jsx("option", { value: "All", children: "All Statuses" }), _jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "Approved", children: "Approved" }), _jsx("option", { value: "Rescheduled", children: "Rescheduled" }), _jsx("option", { value: "Completed", children: "Completed" }), _jsx("option", { value: "Rejected", children: "Rejected" })] })] }), _jsx("div", { className: "glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray", children: _jsxs("tr", { children: [_jsx("th", { className: "px-8 py-5", children: "Client Info" }), _jsx("th", { className: "px-6 py-5", children: "Topic & Type" }), _jsx("th", { className: "px-6 py-5", children: "Requested Schedule" }), _jsx("th", { className: "px-6 py-5", children: "Status" }), _jsx("th", { className: "px-8 py-5 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-borderColor/50", children: loading ? ([...Array(4)].map((_, i) => (_jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 5, className: "px-8 py-10 bg-white/[0.01]" }) }, i)))) : filteredMeetings.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-8 py-20 text-center text-soft-gray", children: "No meeting requests found." }) })) : (filteredMeetings.map((meeting) => (_jsxs("tr", { className: "group hover:bg-white/[0.02] transition-colors", children: [_jsx("td", { className: "px-8 py-6", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm font-bold text-white group-hover:text-electric transition-colors", children: meeting.clientName }), _jsxs("span", { className: "text-xs text-soft-gray flex items-center gap-1 mt-0.5", children: [meeting.companyName || 'Individual Client', _jsx("span", { className: "w-1 h-1 rounded-full bg-white/20 mx-1" }), _jsx("span", { className: `uppercase tracking-wider ${meeting.clientType === 'Global' ? 'text-purple' : 'text-amber-500'}`, children: meeting.clientType })] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("span", { className: "text-sm font-medium text-white/90 line-clamp-1", children: meeting.meetingTopic }), _jsxs("span", { className: "flex items-center gap-1.5 text-[10px] uppercase font-bold text-soft-gray", children: [meeting.meetingType === 'Online' ? _jsx(Video, { className: "w-3.5 h-3.5 text-electric" }) : _jsx(MapPin, { className: "w-3.5 h-3.5 text-amber-500" }), meeting.meetingType, " Meeting"] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsxs("div", { className: "flex flex-col gap-1 text-xs", children: [_jsxs("span", { className: "font-mono text-white flex items-center gap-1.5", children: [_jsx(CalendarDays, { className: "w-3.5 h-3.5 text-soft-gray" }), " ", meeting.preferredDate] }), _jsxs("span", { className: "font-mono text-electric flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-soft-gray" }), " ", meeting.preferredTime, " (", meeting.timeZone, ")"] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsx("span", { className: `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(meeting.status)}`, children: meeting.status }) }), _jsx("td", { className: "px-8 py-6 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => openModal(meeting), className: "p-2.5 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-xl transition-all", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(meeting.id), className: "p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, meeting.id)))) })] }) }) }), isModalOpen && selectedMeeting && (_jsxs("div", { className: "fixed inset-0 z-[4000] flex items-center justify-center p-4 lg:p-8", children: [_jsx("div", { className: "absolute inset-0 bg-navy/95 backdrop-blur-md", onClick: () => !updateLoading && setIsModalOpen(false) }), _jsxs("div", { className: "relative w-full max-w-5xl bg-navy-surface border border-borderColor rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-300", children: [_jsxs("div", { className: "p-6 lg:p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-electric/10 flex items-center justify-center text-electric", children: _jsx(CalendarCheck2, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Review Meeting Request" }), _jsxs("p", { className: "text-[10px] text-soft-gray uppercase tracking-widest font-mono mt-1", children: ["Submitted: ", selectedMeeting.createdAt?.toDate().toLocaleDateString()] })] })] }), _jsx("button", { disabled: updateLoading, onClick: () => setIsModalOpen(false), className: "p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all disabled:opacity-50", children: _jsx(X, {}) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 flex flex-col lg:flex-row gap-10", children: [_jsxs("div", { className: "w-full lg:w-1/2 space-y-8", children: [_jsxs("div", { className: "space-y-4 bg-navy border border-borderColor rounded-2xl p-6", children: [_jsx("h3", { className: "text-xs font-black text-electric uppercase tracking-widest border-b border-borderColor pb-3", children: "Client Identity" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("p", { className: "text-sm text-white flex items-center gap-3", children: [_jsx(User, { className: "w-4 h-4 text-soft-gray" }), " ", _jsx("strong", { children: selectedMeeting.clientName }), " (", selectedMeeting.companyName || 'Individual', ")"] }), _jsxs("p", { className: "text-sm text-white flex items-center gap-3", children: [_jsx(Mail, { className: "w-4 h-4 text-soft-gray" }), " ", _jsx("a", { href: `mailto:${selectedMeeting.email}`, className: "hover:text-electric transition-colors", children: selectedMeeting.email })] }), _jsxs("p", { className: "text-sm text-white flex items-center gap-3", children: [_jsx(Phone, { className: "w-4 h-4 text-soft-gray" }), " ", selectedMeeting.phone] }), _jsxs("p", { className: "text-sm text-white flex items-center gap-3", children: [_jsx(Globe2, { className: "w-4 h-4 text-soft-gray" }), " Language: ", _jsx("span", { className: "uppercase text-xs font-bold text-electric ml-1", children: selectedMeeting.preferredLanguage })] })] })] }), _jsxs("div", { className: "space-y-4 bg-navy border border-borderColor rounded-2xl p-6", children: [_jsx("h3", { className: "text-xs font-black text-purple uppercase tracking-widest border-b border-borderColor pb-3", children: "Meeting Specs" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "block text-[10px] text-soft-gray uppercase mb-1", children: "Requested Date" }), _jsx("span", { className: "text-sm font-bold text-white font-mono", children: selectedMeeting.preferredDate })] }), _jsxs("div", { children: [_jsx("span", { className: "block text-[10px] text-soft-gray uppercase mb-1", children: "Requested Time" }), _jsx("span", { className: "text-sm font-bold text-electric font-mono", children: selectedMeeting.preferredTime })] })] }), _jsxs("div", { children: [_jsx("span", { className: "block text-[10px] text-soft-gray uppercase mb-1 mt-2", children: "Client Timezone" }), _jsx("span", { className: "text-xs text-white/70", children: selectedMeeting.timeZone })] })] })] }), _jsxs("div", { className: "space-y-4 bg-navy border border-borderColor rounded-2xl p-6", children: [_jsx("h3", { className: "text-xs font-black text-amber-500 uppercase tracking-widest border-b border-borderColor pb-3", children: "Project Summary" }), _jsx("p", { className: "text-sm font-bold text-white mb-2", children: selectedMeeting.meetingTopic }), _jsxs("p", { className: "text-xs text-soft-gray leading-relaxed p-3 bg-navy-surface rounded-xl border border-white/5 italic", children: ["\"", selectedMeeting.projectSummary, "\""] })] })] }), _jsxs("form", { onSubmit: handleUpdate, className: "w-full lg:w-1/2 space-y-8 flex flex-col h-full", children: [_jsxs("div", { className: "space-y-6 flex-1", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Update Status" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3.5 text-white font-bold focus:border-electric outline-none appearance-none", value: modalStatus, onChange: (e) => setModalStatus(e.target.value), children: [_jsx("option", { value: "Pending", children: "\uD83D\uDD52 Pending" }), _jsx("option", { value: "Approved", children: "\u2705 Approved (Ready to Meet)" }), _jsx("option", { value: "Rescheduled", children: "\uD83D\uDD04 Needs Reschedule" }), _jsx("option", { value: "Completed", children: "\uD83C\uDFC6 Completed" }), _jsx("option", { value: "Rejected", children: "\u274C Rejected / Cancelled" })] })] }), selectedMeeting.meetingType === 'Online' ? (_jsxs("div", { className: "space-y-2 animate-in fade-in slide-in-from-top-2", children: [_jsxs("label", { className: "text-[10px] font-bold text-electric uppercase tracking-widest flex items-center gap-1.5", children: [_jsx(LinkIcon, { className: "w-3 h-3" }), " Video Call Link"] }), _jsx("input", { type: "url", placeholder: "https://meet.google.com/...", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-sm font-mono text-white focus:border-electric outline-none", value: modalLink, onChange: (e) => setModalLink(e.target.value) }), _jsx("p", { className: "text-[10px] text-soft-gray", children: "Client will see this link in their dashboard if approved." })] })) : (_jsxs("div", { className: "space-y-2 animate-in fade-in slide-in-from-top-2", children: [_jsxs("label", { className: "text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-3 h-3" }), " Office Meeting Instructions"] }), _jsx("textarea", { rows: 3, placeholder: "Full address, floor number, contact person...", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-sm text-white focus:border-electric outline-none resize-none", value: modalInstructions, onChange: (e) => setModalInstructions(e.target.value) })] })), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest flex items-center gap-1.5", children: [_jsx(MessageSquare, { className: "w-3 h-3" }), " Internal Admin Notes"] }), _jsx("textarea", { rows: 4, placeholder: "Add private notes (not visible to client)...", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-sm text-white focus:border-electric outline-none resize-none", value: modalNotes, onChange: (e) => setModalNotes(e.target.value) })] })] }), _jsxs("div", { className: "pt-8 border-t border-borderColor flex items-center justify-end gap-4 mt-auto", children: [_jsx("button", { type: "button", disabled: updateLoading, onClick: () => setIsModalOpen(false), className: "px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-50", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: updateLoading, className: "px-10 py-3 bg-electric hover:bg-electric-bright text-navy font-black rounded-xl transition-all shadow-[0_10px_30px_rgba(22,139,255,0.3)] flex items-center gap-2 disabled:opacity-50", children: [_jsx(Check, { className: "w-5 h-5" }), updateLoading ? 'Saving...' : 'Save Configuration'] })] })] })] })] })] }))] }));
};
