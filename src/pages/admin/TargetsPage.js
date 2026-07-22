import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getBusinessTargets, createBusinessTarget, updateBusinessTarget, deleteBusinessTarget, calculateTargetProgress } from '/src/services/targetService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Target, Plus, Search, Edit3, Trash2, X, Check, TrendingUp, Calendar, Users, Briefcase, BarChart, ListTodo } from 'lucide-react';
import toast from 'react-hot-toast';
export const TargetsPage = () => {
    const { language } = useLanguage();
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [periodFilter, setPeriodFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    // Form State
    const initialFormState = {
        title: '',
        category: 'Revenue',
        period: 'Monthly',
        targetAmount: 0,
        achievedAmount: 0,
        deadline: new Date().toISOString().split('T')[0],
        responsibleTeam: '',
        status: 'On Track',
        notes: '',
        actionItems: []
    };
    const [formData, setFormData] = useState(initialFormState);
    const [actionInput, setActionInput] = useState('');
    // Data Fetching
    const fetchTargets = async () => {
        setLoading(true);
        try {
            const data = await getBusinessTargets({ period: periodFilter !== 'All' ? periodFilter : undefined, status: statusFilter !== 'All' ? statusFilter : undefined });
            setTargets(data);
        }
        catch (error) {
            toast.error('Failed to load business targets');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTargets();
    }, [periodFilter, statusFilter]);
    // Actions Handling
    const addActionItem = (e) => {
        if (e.key === 'Enter' && actionInput.trim()) {
            e.preventDefault();
            if (!formData.actionItems.includes(actionInput.trim())) {
                setFormData({ ...formData, actionItems: [...formData.actionItems, actionInput.trim()] });
            }
            setActionInput('');
        }
    };
    const removeActionItem = (item) => {
        setFormData({ ...formData, actionItems: formData.actionItems.filter(i => i !== item) });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || formData.targetAmount <= 0) {
            toast.error('Title and a valid Target Amount are required');
            return;
        }
        try {
            if (editMode && currentId) {
                await updateBusinessTarget(currentId, formData);
                toast.success('Target progress updated');
            }
            else {
                await createBusinessTarget(formData);
                toast.success('New business target created');
            }
            setIsModalOpen(false);
            fetchTargets();
        }
        catch (error) {
            toast.error('Failed to save target');
        }
    };
    const openEditModal = (target) => {
        setEditMode(true);
        setCurrentId(target.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...rest } = target;
        setFormData(rest);
        setIsModalOpen(true);
    };
    const handleDelete = async (id) => {
        if (!window.confirm('WARNING: Are you sure you want to delete this business target record?'))
            return;
        try {
            await deleteBusinessTarget(id);
            toast.success('Target record deleted');
            fetchTargets();
        }
        catch (error) {
            toast.error('Failed to delete target');
        }
    };
    // Filter local state
    const filteredTargets = targets.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.responsibleTeam.toLowerCase().includes(searchQuery.toLowerCase()));
    // UI Helpers
    const getStatusColor = (status) => {
        switch (status) {
            case 'Achieved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'On Track': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'At Risk': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'Missed': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-soft-gray bg-white/5 border-white/10';
        }
    };
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Revenue': return _jsx(TrendingUp, { className: "w-5 h-5 text-emerald-400" });
            case 'Lead Generation': return _jsx(Users, { className: "w-5 h-5 text-electric" });
            case 'Project Completion': return _jsx(Briefcase, { className: "w-5 h-5 text-purple" });
            default: return _jsx(BarChart, { className: "w-5 h-5 text-amber-500" });
        }
    };
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Target, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Internal Business Targets' : 'বিজনেস টার্গেট ও লক্ষ্যমাত্রা'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Confidential area: Track revenue, leads, and operational goals." })] }), _jsxs("button", { onClick: () => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }, className: "flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-bright text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)] active:scale-95", children: [_jsx(Plus, { className: "w-5 h-5" }), language === 'en' ? 'Set New Target' : 'নতুন টার্গেট নির্ধারণ করুন'] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Search by objective or team...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsxs("select", { className: "bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none appearance-none font-bold", value: periodFilter, onChange: (e) => setPeriodFilter(e.target.value), children: [_jsx("option", { value: "All", children: "All Periods" }), _jsx("option", { value: "Monthly", children: "Monthly Goals" }), _jsx("option", { value: "Quarterly", children: "Quarterly Goals" }), _jsx("option", { value: "Yearly", children: "Yearly Goals" })] }), _jsxs("select", { className: "bg-navy-surface border border-borderColor rounded-2xl px-6 py-3.5 text-white focus:border-electric outline-none appearance-none font-bold", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [_jsx("option", { value: "All", children: "All Statuses" }), _jsx("option", { value: "On Track", children: "On Track" }), _jsx("option", { value: "At Risk", children: "At Risk" }), _jsx("option", { value: "Achieved", children: "Achieved" }), _jsx("option", { value: "Missed", children: "Missed" })] })] }), loading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => _jsx("div", { className: "h-64 bg-white/[0.02] border border-borderColor rounded-3xl animate-pulse" }, i)) })) : filteredTargets.length === 0 ? (_jsxs("div", { className: "glass-panel border-borderColor rounded-3xl p-20 flex flex-col items-center justify-center text-center", children: [_jsx(Target, { className: "w-16 h-16 text-white/10 mb-4" }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "No Targets Found" }), _jsx("p", { className: "text-soft-gray text-sm", children: "Create a new objective to start tracking progress." })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredTargets.map((target) => {
                    const progress = calculateTargetProgress(target.achievedAmount, target.targetAmount);
                    return (_jsxs("div", { className: "bg-navy-surface border border-borderColor rounded-3xl p-6 flex flex-col justify-between hover:border-electric transition-colors group relative overflow-hidden shadow-xl", children: [_jsx("div", { className: "absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none" }), _jsxs("div", { children: [_jsx("div", { className: "flex justify-between items-start mb-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2.5 bg-navy border border-borderColor rounded-xl", children: getCategoryIcon(target.category) }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] uppercase font-bold tracking-widest text-soft-gray", children: target.period }), _jsx("h3", { className: "font-bold text-white leading-tight", children: target.title })] })] }) }), _jsxs("div", { className: "my-6", children: [_jsxs("div", { className: "flex justify-between text-xs mb-2", children: [_jsx("span", { className: "text-soft-gray", children: "Progress" }), _jsxs("span", { className: "font-bold text-white", children: [progress.toFixed(1), "%"] })] }), _jsx("div", { className: "w-full bg-navy border border-borderColor rounded-full h-2.5 overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' :
                                                        progress > 50 ? 'bg-electric' : 'bg-amber-500'}`, style: { width: `${progress}%` } }) }), _jsxs("div", { className: "flex justify-between text-xs mt-2 font-mono", children: [_jsxs("span", { className: "text-white/60", children: [target.category === 'Revenue' ? '$' : '', target.achievedAmount.toLocaleString()] }), _jsxs("span", { className: "text-soft-gray", children: ["Goal: ", target.category === 'Revenue' ? '$' : '', target.targetAmount.toLocaleString()] })] })] })] }), _jsxs("div", { className: "pt-4 border-t border-borderColor flex items-center justify-between", children: [_jsx("span", { className: `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(target.status)}`, children: target.status }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => openEditModal(target), className: "p-2 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-lg transition-all", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(target.id), className: "p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "mt-4 flex gap-4 text-[10px] text-soft-gray uppercase font-bold", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), " ", target.deadline] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { className: "w-3 h-3" }), " ", target.responsibleTeam] })] })] }, target.id));
                }) })), isModalOpen && (_jsxs("div", { className: "fixed inset-0 z-[4000] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-navy/98 backdrop-blur-xl", onClick: () => setIsModalOpen(false) }), _jsxs("div", { className: "relative w-full max-w-4xl bg-navy-surface border border-borderColor rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300", children: [_jsxs("div", { className: "p-6 lg:p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-electric/10 flex items-center justify-center text-electric", children: _jsx(Target, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: editMode ? 'Update Progress' : 'Set New Target' }), _jsx("p", { className: "text-[10px] text-soft-gray uppercase tracking-widest font-mono mt-0.5", children: "Performance Management" })] })] }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 space-y-12 pb-32", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 01. Objective Definition"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2 md:col-span-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Target Title" }), _jsx("input", { required: true, type: "text", placeholder: "e.g. Q3 North America Revenue", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Category" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none", value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), children: [_jsx("option", { value: "Revenue", children: "Revenue ($)" }), _jsx("option", { value: "Lead Generation", children: "Lead Generation" }), _jsx("option", { value: "Project Completion", children: "Project Completion" }), _jsx("option", { value: "Client Retention", children: "Client Retention" }), _jsx("option", { value: "Team Growth", children: "Team Growth" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Evaluation Period" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none", value: formData.period, onChange: (e) => setFormData({ ...formData, period: e.target.value }), children: [_jsx("option", { value: "Monthly", children: "Monthly" }), _jsx("option", { value: "Quarterly", children: "Quarterly" }), _jsx("option", { value: "Yearly", children: "Yearly" })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-purple uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-purple/30" }), " 02. Metrics & Logistics"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Target Amount (Goal)" }), _jsx("input", { required: true, type: "number", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white font-mono focus:border-electric outline-none", value: formData.targetAmount, onChange: (e) => setFormData({ ...formData, targetAmount: Number(e.target.value) }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Achieved Amount (Current)" }), _jsx("input", { required: true, type: "number", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white font-mono focus:border-electric outline-none", value: formData.achievedAmount, onChange: (e) => setFormData({ ...formData, achievedAmount: Number(e.target.value) }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Deadline" }), _jsx("input", { required: true, type: "date", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white font-mono focus:border-electric outline-none", value: formData.deadline, onChange: (e) => setFormData({ ...formData, deadline: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Responsible Team / Person" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.responsibleTeam, onChange: (e) => setFormData({ ...formData, responsibleTeam: e.target.value }) })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-amber-500/30" }), " 03. Evaluation & Plan"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Current Status" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none", value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { value: "On Track", children: "On Track" }), _jsx("option", { value: "At Risk", children: "At Risk" }), _jsx("option", { value: "Achieved", children: "Achieved" }), _jsx("option", { value: "Missed", children: "Missed" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase", children: "Internal Notes" }), _jsx("textarea", { rows: 3, className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none resize-none", value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), placeholder: "Why is this on track or at risk?" })] })] }), _jsxs("div", { className: "space-y-2 bg-navy border border-borderColor rounded-2xl p-6", children: [_jsxs("label", { className: "text-[10px] font-bold text-electric uppercase flex items-center gap-1.5 mb-2", children: [_jsx(ListTodo, { className: "w-3.5 h-3.5" }), " Action Items"] }), _jsx("input", { type: "text", placeholder: "Type step & press Enter...", className: "w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-2.5 text-xs text-white focus:border-electric outline-none mb-3", value: actionInput, onChange: (e) => setActionInput(e.target.value), onKeyDown: addActionItem }), _jsxs("ul", { className: "space-y-2 max-h-40 overflow-y-auto custom-scrollbar", children: [formData.actionItems.map((item, idx) => (_jsxs("li", { className: "flex justify-between items-start gap-2 text-xs text-soft-gray bg-white/[0.02] p-2 rounded-lg", children: [_jsxs("span", { className: "leading-tight", children: [_jsx("span", { className: "text-electric mr-1", children: "\u2022" }), item] }), _jsx("button", { type: "button", onClick: () => removeActionItem(item), className: "text-red-400 hover:text-red-300", children: _jsx(X, { className: "w-3 h-3" }) })] }, idx))), formData.actionItems.length === 0 && _jsx("p", { className: "text-xs text-white/20 italic text-center py-4", children: "No action items defined." })] })] })] })] }), _jsxs("div", { className: "fixed bottom-0 left-0 right-0 p-6 bg-navy-surface/80 backdrop-blur-xl border-t border-borderColor z-10 flex items-center justify-end gap-4 shadow-[0_-10px_40px_rgba(7,20,38,0.5)]", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-8 py-3 bg-white/5 text-white font-bold rounded-xl transition-all", children: "Discard" }), _jsxs("button", { type: "submit", className: "px-12 py-3 bg-electric hover:bg-electric-bright text-navy font-black rounded-xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2", children: [_jsx(Check, { className: "w-5 h-5" }), editMode ? 'Update Progress' : 'Set Objective'] })] })] })] })] }))] }));
};
