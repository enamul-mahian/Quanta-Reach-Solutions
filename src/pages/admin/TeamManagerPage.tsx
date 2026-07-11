import React, { useState, useEffect } from 'react';
import { 
  getTeamMembers, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember, 
  TeamMember,
  toggleMemberStatus,
  toggleMemberFeatured 
} from '@/services/teamService';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  Users, 
  X, 
  Check, 
  Linkedin, 
  Github, 
  Globe, 
  Mail, 
  User,
  Briefcase,
  Layers,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

export const TeamManagerPage: React.FC = () => {
  const { language } = useLanguage();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // ইনিশিয়াল ফর্ম স্টেট
  const initialFormState: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'> = {
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
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // স্কিল হ্যান্ডলিং
  const addSkill = () => {
    if (!skillInput.trim()) return;
    const newSkills = skillInput.split(',').map(s => s.trim()).filter(s => s !== "" && !formData.skills.includes(s));
    setFormData({ ...formData, skills: [...formData.skills, ...newSkills] });
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  // সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role.en) {
      toast.error('Name and English role are required');
      return;
    }

    try {
      if (editMode && currentId) {
        await updateTeamMember(currentId, formData);
        toast.success('Member updated successfully');
      } else {
        await createTeamMember(formData);
        toast.success('New member added to team');
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      toast.error('An error occurred during submission');
    }
  };

  const openEditModal = (member: TeamMember) => {
    setEditMode(true);
    setCurrentId(member.id!);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...rest } = member;
    setFormData(rest);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this member from the team permanently?')) return;
    try {
      await deleteTeamMember(id);
      toast.success('Member removed');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Team Management' : 'টিম ম্যানেজমেন্ট'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">
            Manage your agency experts, department heads, and professional profiles.
          </p>
        </div>
        
        <button 
          onClick={() => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-electric hover:bg-bright-blue text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)]"
        >
          <Plus className="w-5 h-5" />
          {language === 'en' ? 'Add Member' : 'মেম্বার যোগ করুন'}
        </button>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
        <input 
          type="text"
          placeholder="Search by name, role or department..."
          className="w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Team Table */}
      <div className="glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray">
              <tr>
                <th className="px-8 py-5">Expert Profile</th>
                <th className="px-6 py-5">Department</th>
                <th className="px-6 py-5">Exp</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor/50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={5} className="px-8 py-10 bg-white/[0.01]" /></tr>
                ))
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-soft-gray">No team members found.</td></tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-navy border border-borderColor overflow-hidden">
                          {member.photo ? (
                            <img src={member.photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10"><User /></div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-electric transition-colors">{member.name}</h4>
                          <p className="text-[11px] text-soft-gray uppercase tracking-widest">{member.role.en}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm text-white/70 font-medium">
                      {member.department}
                    </td>
                    <td className="px-6 py-6 text-sm font-mono text-electric">
                      {member.experienceYears}y+
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={() => toggleMemberStatus(member.id!, member.status).then(fetchMembers)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                          member.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-white/5 text-white/20 border-white/5'
                        }`}
                      >
                        {member.status}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleMemberFeatured(member.id!, member.isFeatured).then(fetchMembers)}
                          className={`p-2 rounded-lg transition-all ${member.isFeatured ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-white/10 hover:text-white'}`}
                        >
                          <Star className={`w-4 h-4 ${member.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                        <button onClick={() => openEditModal(member)} className="p-2.5 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(member.id!)} className="p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/98 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-5xl bg-navy-surface border border-borderColor rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Award className="text-electric" />
                  {editMode ? 'Update Member Profile' : 'Add New Expert'}
                </h2>
                <p className="text-xs text-soft-gray mt-1 uppercase tracking-widest">Global Expertise Management</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all"><X /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto custom-scrollbar space-y-10">
              
              {/* Core Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-electric/30"></span> 01. Personal Identity
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Full Name</label>
                      <input required type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Photo URL (Cloudinary)</label>
                      <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none font-mono text-xs" 
                        value={formData.photo} onChange={(e) => setFormData({...formData, photo: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-electric/30"></span> 02. Professional Role
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Department</label>
                        <select 
                          className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none"
                          value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Design">Design & UI/UX</option>
                          <option value="Marketing">Growth & Marketing</option>
                          <option value="Management">Management</option>
                          <option value="Operations">Operations</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Experience (Years)</label>
                        <input type="number" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                          value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Role (English)</label>
                        <input required type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                          value={formData.role.en} onChange={(e) => setFormData({...formData, role: {...formData.role, en: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">পদবী (বাংলা)</label>
                        <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                          value={formData.role.bn} onChange={(e) => setFormData({...formData, role: {...formData.role, bn: e.target.value}})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Management */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-electric/30"></span> 03. Skills & Technologies
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Add skills (e.g. React, Node.js, Figma)..." 
                      className="flex-1 bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <button type="button" onClick={addSkill} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-borderColor">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-electric/5 border border-electric/20 text-electric text-xs font-bold rounded-lg uppercase tracking-wider">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)}><X className="w-3 h-3 hover:text-white" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-electric/30"></span> 04. Social Connectivity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" />
                    <input type="text" placeholder="LinkedIn Profile" className="w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-3 text-white focus:border-electric outline-none text-xs" 
                      value={formData.socialLinks.linkedin} onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                    />
                  </div>
                  <div className="relative">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" />
                    <input type="text" placeholder="GitHub Profile" className="w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-3 text-white focus:border-electric outline-none text-xs" 
                      value={formData.socialLinks.github} onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, github: e.target.value}})}
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" />
                    <input type="text" placeholder="Personal Portfolio" className="w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-3 text-white focus:border-electric outline-none text-xs" 
                      value={formData.socialLinks.portfolio} onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, portfolio: e.target.value}})}
                    />
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-10 border-t border-borderColor flex items-center justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all">Discard</button>
                <button type="submit" className="px-12 py-4 bg-electric hover:bg-bright-blue text-navy font-black rounded-2xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {editMode ? 'Update Expert Profile' : 'Publish to Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};