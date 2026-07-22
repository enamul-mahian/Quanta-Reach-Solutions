import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, toggleMemberStatus, toggleMemberFeatured } from '/src/services/teamService.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { Plus, Search, Edit3, Trash2, Star, Users, X, Check, Linkedin, Github, Globe, User, Award } from 'lucide-react';
import toast from 'react-hot-toast';
export const TeamManagerPage = () => {
    const { language } = useLanguage();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    // ইনিশিয়াল ফর্ম স্টেট
    const initialFormState = {
        name: '',
        photo: '',
        role: { en: '', bn: '' },
        department: 'Engineering',
        skills: [],
        experienceYears: 0,
        languages: { english: 'Professional', bangla: 'Native' },
        bio: { en: '', bn: '' },
        socialLinks: { linkedin: '', github: '', twitter: '', portfolio: '' },
        emailVisibility: true,
        isFeatured: false,
        status: 'Active',
        sortOrder: 0
    };
    const [formData, setFormData] = useState(initialFormState);
    const [skillInput, setSkillInput] = useState('');
    // ডাটা ফেচিং
    const fetchMembers = async () => {
        setLoading(true);
        try {
            const data = await getTeamMembers();
            setMembers(data);
        }
        catch (error) {
            toast.error('Failed to load team members');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMembers();
    }, []);
    // স্কিল হ্যান্ডলিং
    const addSkill = () => {
        if (!skillInput.trim())
            return;
        const newSkills = skillInput.split(',').map(s => s.trim()).filter(s => s !== "" && !formData.skills.includes(s));
        setFormData({ ...formData, skills: [...formData.skills, ...newSkills] });
        setSkillInput('');
    };
    const removeSkill = (skill) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };
    // সাবমিট হ্যান্ডলার
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.role.en) {
            toast.error('Name and English role are required');
            return;
        }
        try {
            if (editMode && currentId) {
                await updateTeamMember(currentId, formData);
                toast.success('Member updated successfully');
            }
            else {
                await createTeamMember(formData);
                toast.success('New member added to team');
            }
            setIsModalOpen(false);
            fetchMembers();
        }
        catch (error) {
            toast.error('An error occurred during submission');
        }
    };
    const openEditModal = (member) => {
        setEditMode(true);
        setCurrentId(member.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...rest } = member;
        setFormData(rest);
        setIsModalOpen(true);
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Remove this member from the team permanently?'))
            return;
        try {
            await deleteTeamMember(id);
            toast.success('Member removed');
            fetchMembers();
        }
        catch (error) {
            toast.error('Failed to delete');
        }
    };
    const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.department.toLowerCase().includes(searchQuery.toLowerCase()));
    return (_jsxs("div", { className: "p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white tracking-tight flex items-center gap-3", children: [_jsx(Users, { className: "w-8 h-8 text-electric" }), language === 'en' ? 'Team Management' : 'টিম ম্যানেজমেন্ট'] }), _jsx("p", { className: "text-soft-gray mt-1 text-sm", children: "Manage your agency experts, department heads, and professional profiles." })] }), _jsxs("button", { onClick: () => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }, className: "flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-bright text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)]", children: [_jsx(Plus, { className: "w-5 h-5" }), language === 'en' ? 'Add Member' : 'মেম্বার যোগ করুন'] })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Search by name, role or department...", className: "w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsx("div", { className: "glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray", children: _jsxs("tr", { children: [_jsx("th", { className: "px-8 py-5", children: "Expert Profile" }), _jsx("th", { className: "px-6 py-5", children: "Department" }), _jsx("th", { className: "px-6 py-5", children: "Exp" }), _jsx("th", { className: "px-6 py-5", children: "Status" }), _jsx("th", { className: "px-8 py-5 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-borderColor/50", children: loading ? ([...Array(3)].map((_, i) => (_jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 5, className: "px-8 py-10 bg-white/[0.01]" }) }, i)))) : filteredMembers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-8 py-20 text-center text-soft-gray", children: "No team members found." }) })) : (filteredMembers.map((member) => (_jsxs("tr", { className: "group hover:bg-white/[0.02] transition-colors", children: [_jsx("td", { className: "px-8 py-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-navy border border-borderColor overflow-hidden", children: member.photo ? (_jsx("img", { src: member.photo, alt: "", className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-white/10", children: _jsx(User, {}) })) }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-white group-hover:text-electric transition-colors", children: member.name }), _jsx("p", { className: "text-[11px] text-soft-gray uppercase tracking-widest", children: member.role.en })] })] }) }), _jsx("td", { className: "px-6 py-6 text-sm text-white/70 font-medium", children: member.department }), _jsxs("td", { className: "px-6 py-6 text-sm font-mono text-electric", children: [member.experienceYears, "y+"] }), _jsx("td", { className: "px-6 py-6", children: _jsx("button", { onClick: () => toggleMemberStatus(member.id, member.status).then(fetchMembers), className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${member.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-white/5 text-white/20 border-white/5'}`, children: member.status }) }), _jsx("td", { className: "px-8 py-6 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => toggleMemberFeatured(member.id, member.isFeatured).then(fetchMembers), className: `p-2 rounded-lg transition-all ${member.isFeatured ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-white/10 hover:text-white'}`, children: _jsx(Star, { className: `w-4 h-4 ${member.isFeatured ? 'fill-current' : ''}` }) }), _jsx("button", { onClick: () => openEditModal(member), className: "p-2.5 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-xl transition-all", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(member.id), className: "p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, member.id)))) })] }) }) }), isModalOpen && (_jsxs("div", { className: "fixed inset-0 z-[3000] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-navy/98 backdrop-blur-xl", onClick: () => setIsModalOpen(false) }), _jsxs("div", { className: "relative w-full max-w-5xl bg-navy-surface border border-borderColor rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300", children: [_jsxs("div", { className: "p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [_jsx(Award, { className: "text-electric" }), editMode ? 'Update Member Profile' : 'Add New Expert'] }), _jsx("p", { className: "text-xs text-soft-gray mt-1 uppercase tracking-widest", children: "Global Expertise Management" })] }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-10 overflow-y-auto custom-scrollbar space-y-10", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 01. Personal Identity"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Full Name" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Photo URL (Cloudinary)" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none font-mono text-xs", value: formData.photo, onChange: (e) => setFormData({ ...formData, photo: e.target.value }) })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 02. Professional Role"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Department" }), _jsxs("select", { className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none", value: formData.department, onChange: (e) => setFormData({ ...formData, department: e.target.value }), children: [_jsx("option", { value: "Engineering", children: "Engineering" }), _jsx("option", { value: "Design", children: "Design & UI/UX" }), _jsx("option", { value: "Marketing", children: "Growth & Marketing" }), _jsx("option", { value: "Management", children: "Management" }), _jsx("option", { value: "Operations", children: "Operations" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Experience (Years)" }), _jsx("input", { type: "number", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.experienceYears, onChange: (e) => setFormData({ ...formData, experienceYears: Number(e.target.value) }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "Role (English)" }), _jsx("input", { required: true, type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.role.en, onChange: (e) => setFormData({ ...formData, role: { ...formData.role, en: e.target.value } }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-bold text-soft-gray uppercase tracking-widest", children: "\u09AA\u09A6\u09AC\u09C0 (\u09AC\u09BE\u0982\u09B2\u09BE)" }), _jsx("input", { type: "text", className: "w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: formData.role.bn, onChange: (e) => setFormData({ ...formData, role: { ...formData.role, bn: e.target.value } }) })] })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 03. Skills & Technologies"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("input", { type: "text", placeholder: "Add skills (e.g. React, Node.js, Figma)...", className: "flex-1 bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none", value: skillInput, onChange: (e) => setSkillInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && (e.preventDefault(), addSkill()) }), _jsx("button", { type: "button", onClick: addSkill, className: "px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-borderColor", children: "Add" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: formData.skills.map((skill, idx) => (_jsxs("span", { className: "flex items-center gap-2 px-3 py-1.5 bg-electric/5 border border-electric/20 text-electric text-xs font-bold rounded-lg uppercase tracking-wider", children: [skill, _jsx("button", { type: "button", onClick: () => removeSkill(skill), children: _jsx(X, { className: "w-3 h-3 hover:text-white" }) })] }, idx))) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4", children: [_jsx("span", { className: "w-10 h-[1px] bg-electric/30" }), " 04. Social Connectivity"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Linkedin, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "LinkedIn Profile", className: "w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-3 text-white focus:border-electric outline-none text-xs", value: formData.socialLinks.linkedin, onChange: (e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } }) })] }), _jsxs("div", { className: "relative", children: [_jsx(Github, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "GitHub Profile", className: "w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-3 text-white focus:border-electric outline-none text-xs", value: formData.socialLinks.github, onChange: (e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } }) })] }), _jsxs("div", { className: "relative", children: [_jsx(Globe, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" }), _jsx("input", { type: "text", placeholder: "Personal Portfolio", className: "w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-3 text-white focus:border-electric outline-none text-xs", value: formData.socialLinks.portfolio, onChange: (e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, portfolio: e.target.value } }) })] })] })] }), _jsxs("div", { className: "pt-10 border-t border-borderColor flex items-center justify-end gap-4", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all", children: "Discard" }), _jsxs("button", { type: "submit", className: "px-12 py-4 bg-electric hover:bg-electric-bright text-navy font-black rounded-2xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2", children: [_jsx(Check, { className: "w-5 h-5" }), editMode ? 'Update Expert Profile' : 'Publish to Team'] })] })] })] })] }))] }));
};
