import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject, toggleProjectFeatured } from '/src/services/portfolioService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Plus, Search, Edit, Trash2, Star, Briefcase, X, Check, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
export const PortfolioManagerPage = () => {
    const { language } = useLanguage();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    // মাস্টার প্রম্পট অনুযায়ী পোর্টফোলিও ইনিশিয়াল স্টেট
    const initialFormState = {
        projectName: { en: '', bn: '' },
        slug: '',
        clientName: '',
        country: '',
        projectType: 'Global',
        industry: '',
        serviceCategory: 'Web Development',
        projectDuration: '',
        teamSize: 1,
        overview: { en: '', bn: '' },
        challenge: { en: '', bn: '' },
        solution: { en: '', bn: '' },
        process: { en: [], bn: [] },
        technologies: [],
        keyFeatures: { en: [], bn: [] },
        results: { en: '', bn: '' },
        metrics: [],
        coverImage: '',
        gallery: [],
        liveUrl: '',
        completionDate: '',
        seo: { title: '', description: '', keywords: [] },
        status: 'Draft',
        isFeatured: false,
        sortOrder: 0
    };
    const [formData, setFormData] = useState(initialFormState);
    // ডাটা রিট্রিভাল
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await getProjects({ includeDrafts: true });
            setProjects(data);
        }
        catch (error) {
            toast.error('Failed to load portfolio projects');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProjects();
    }, []);
    // স্লাগ জেনারেশন
    const handleNameChange = (val, lang) => {
        setFormData(prev => {
            const newState = { ...prev, projectName: { ...prev.projectName, [lang]: val } };
            if (lang === 'en' && !editMode) {
                newState.slug = val.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
            }
            return newState;
        });
    };
    // সাবমিশন লজিক
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.projectName.en || !formData.slug) {
            toast.error('Project Name and Slug are required');
            return;
        }
        try {
            if (editMode && currentId) {
                await updateProject(currentId, formData);
                toast.success('Project updated successfully');
            }
            else {
                await createProject(formData);
                toast.success('New project added to portfolio');
            }
            setIsModalOpen(false);
            fetchProjects();
        }
        catch (error) {
            toast.error('An error occurred');
        }
    };
    const openEditModal = (project) => {
        setEditMode(true);
        setCurrentId(project.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...rest } = project;
        setFormData(rest);
        setIsModalOpen(true);
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this case study?'))
            return;
        try {
            await deleteProject(id);
            toast.success('Project deleted');
            fetchProjects();
        }
        catch (error) {
            toast.error('Failed to delete');
        }
    };
    const filteredProjects = projects.filter(p => p.projectName.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Briefcase, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Portfolio & Case Studies' : 'পোর্টফোলিও ও কেস স্টাডি'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Manage your project showcase, client results, and success stories." })] }), _jsxs("button", { onClick: () => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }, className: "flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-bright text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)]", children: [_jsx(Plus, { className: "w-5 h-5" }), language === 'en' ? 'Add Project' : 'নতুন প্রজেক্ট যোগ করুন'] })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Search by project name or client...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsx("div", { className: "glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray", children: _jsxs("tr", { children: [_jsx("th", { className: "px-8 py-5", children: "Project Name" }), _jsx("th", { className: "px-6 py-5", children: "Client & Type" }), _jsx("th", { className: "px-6 py-5", children: "Industry" }), _jsx("th", { className: "px-6 py-5", children: "Status" }), _jsx("th", { className: "px-8 py-5 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-borderColor/50", children: loading ? ([...Array(3)].map((_, i) => (_jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 5, className: "px-8 py-10 bg-white/[0.01]" }) }, i)))) : filteredProjects.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-8 py-20 text-center text-soft-gray", children: "No projects found." }) })) : (filteredProjects.map((project) => (_jsxs("tr", { className: "group hover:bg-white/[0.02] transition-colors", children: [_jsx("td", { className: "px-8 py-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-10 rounded-lg bg-navy overflow-hidden border border-borderColor relative group-hover:border-electric transition-colors", children: project.coverImage ? (_jsx("img", { src: project.coverImage, alt: "", className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-white/10", children: _jsx(ImageIcon, { className: "w-5 h-5" }) })) }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-white group-hover:text-electric transition-colors", children: project.projectName.en }), _jsx("span", { className: "text-[10px] font-mono text-soft-gray", children: project.slug })] })] }) }), _jsx("td", { className: "px-6 py-6", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm text-white/80", children: project.clientName }), _jsx("span", { className: `text-[10px] font-bold uppercase tracking-wider ${project.projectType === 'Global' ? 'text-purple' : 'text-amber-500'}`, children: project.projectType })] }) }), _jsx("td", { className: "px-6 py-6 text-sm text-soft-gray", children: project.industry }), _jsx("td", { className: "px-6 py-6", children: _jsx("span", { className: `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${project.status === 'Published'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-white/5 text-white/40 border-white/10'}`, children: project.status }) }), _jsx("td", { className: "px-8 py-6 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => toggleProjectFeatured(project.id, project.isFeatured).then(fetchProjects), className: `p-2 rounded-lg transition-all ${project.isFeatured ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-white/10 hover:text-white'}`, children: _jsx(Star, { className: `w-4 h-4 ${project.isFeatured ? 'fill-current' : ''}` }) }), _jsx("button", { onClick: () => openEditModal(project), className: "p-2 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-lg transition-all", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(project.id), className: "p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, project.id)))) })] }) }) }), isModalOpen && (_jsxs("div", { className: "fixed inset-0 z-[3000] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-navy/98 backdrop-blur-xl", onClick: () => setIsModalOpen(false) }), _jsxs("div", { className: "relative w-full max-w-6xl bg-navy-surface border border-borderColor rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300", children: [_jsxs("div", { className: "p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [_jsx(Briefcase, { className: "text-electric" }), editMode ? 'Edit Case Study' : 'New Portfolio Entry'] }), _jsx("p", { className: "text-xs text-soft-gray mt-1 font-mono tracking-widest uppercase", children: "Project Identity & Technical Specs" })] }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-10 overflow-y-auto custom-scrollbar space-y-12", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-sm font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 01. Branding"] }), _jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Project Name (EN)" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none", value: formData.projectName.en, onChange: (e) => handleNameChange(e.target.value, 'en') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "\u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F\u09C7\u09B0 \u09A8\u09BE\u09AE (\u09AC\u09BE\u0982\u09B2\u09BE)" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none", value: formData.projectName.bn, onChange: (e) => handleNameChange(e.target.value, 'bn') })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-sm font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 02. Classification"] }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Client Name" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none", value: formData.clientName, onChange: (e) => setFormData({ ...formData, clientName: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Client Type" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none appearance-none", value: formData.projectType, onChange: (e) => setFormData({ ...formData, projectType: e.target.value }), children: [_jsx("option", { value: "Global", children: "Global Client" }), _jsx("option", { value: "Local", children: "Local Client" })] })] })] })] })] }), _jsxs("div", { className: "space-y-8", children: [_jsxs("h3", { className: "text-sm font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 03. Outcome & Success Metrics"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Industry" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.industry, onChange: (e) => setFormData({ ...formData, industry: e.target.value }), placeholder: "e.g. Fintech, Healthcare" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Cover Image (Cloudinary URL)" }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("input", { type: "text", className: "flex-1 bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-xs font-mono", value: formData.coverImage, onChange: (e) => setFormData({ ...formData, coverImage: e.target.value }), placeholder: "https://cloudinary.com/..." }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Status" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { value: "Draft", children: "Draft (Internal)" }), _jsx("option", { value: "Published", children: "Published (Public)" })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-sm font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 04. Case Study Details"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Overview (EN)" }), _jsx("textarea", { rows: 4, className: "w-full bg-navy border border-borderColor rounded-2xl px-5 py-4 text-white focus:border-electric outline-none resize-none", value: formData.overview.en, onChange: (e) => setFormData({ ...formData, overview: { ...formData.overview, en: e.target.value } }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "\u09B8\u09BE\u09B0\u09B8\u0982\u0995\u09CD\u09B7\u09C7\u09AA (\u09AC\u09BE\u0982\u09B2\u09BE)" }), _jsx("textarea", { rows: 4, className: "w-full bg-navy border border-borderColor rounded-2xl px-5 py-4 text-white focus:border-electric outline-none resize-none", value: formData.overview.bn, onChange: (e) => setFormData({ ...formData, overview: { ...formData.overview, bn: e.target.value } }) })] })] })] }), _jsxs("div", { className: "pt-10 border-t border-borderColor flex items-center justify-end gap-4", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all", children: "Discard" }), _jsxs("button", { type: "submit", className: "px-12 py-4 bg-electric hover:bg-electric-bright text-navy font-black rounded-2xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2", children: [_jsx(Check, { className: "w-5 h-5" }), editMode ? 'Update Case Study' : 'Publish to Portfolio'] })] })] })] })] }))] }));
};
