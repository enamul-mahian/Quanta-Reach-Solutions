import React, { useState, useEffect } from 'react';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  PortfolioProject, 
  toggleProjectFeatured 
} from '@/services/portfolioService';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  ExternalLink, 
  Briefcase, 
  X, 
  Check, 
  Globe, 
  Cpu, 
  BarChart3,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PortfolioManagerPage: React.FC = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // মাস্টার প্রম্পট অনুযায়ী পোর্টফোলিও ইনিশিয়াল স্টেট
  const initialFormState: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'> = {
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
    } catch (error) {
      toast.error('Failed to load portfolio projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // স্লাগ জেনারেশন
  const handleNameChange = (val: string, lang: 'en' | 'bn') => {
    setFormData(prev => {
      const newState = { ...prev, projectName: { ...prev.projectName, [lang]: val } };
      if (lang === 'en' && !editMode) {
        newState.slug = val.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      }
      return newState;
    });
  };

  // সাবমিশন লজিক
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName.en || !formData.slug) {
      toast.error('Project Name and Slug are required');
      return;
    }

    try {
      if (editMode && currentId) {
        await updateProject(currentId, formData);
        toast.success('Project updated successfully');
      } else {
        await createProject(formData);
        toast.success('New project added to portfolio');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const openEditModal = (project: PortfolioProject) => {
    setEditMode(true);
    setCurrentId(project.id!);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...rest } = project;
    setFormData(rest);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.projectName.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Portfolio & Case Studies' : 'পোর্টফোলিও ও কেস স্টাডি'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">
            Manage your project showcase, client results, and success stories.
          </p>
        </div>
        
        <button 
          onClick={() => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-electric hover:bg-bright-blue text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)]"
        >
          <Plus className="w-5 h-5" />
          {language === 'en' ? 'Add Project' : 'নতুন প্রজেক্ট যোগ করুন'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
        <input 
          type="text"
          placeholder="Search by project name or client..."
          className="w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Projects Table */}
      <div className="glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray">
              <tr>
                <th className="px-8 py-5">Project Name</th>
                <th className="px-6 py-5">Client & Type</th>
                <th className="px-6 py-5">Industry</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor/50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-10 bg-white/[0.01]" />
                  </tr>
                ))
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-soft-gray">No projects found.</td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 rounded-lg bg-navy overflow-hidden border border-borderColor relative group-hover:border-electric transition-colors">
                          {project.coverImage ? (
                            <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon className="w-5 h-5" /></div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-electric transition-colors">
                            {project.projectName.en}
                          </h4>
                          <span className="text-[10px] font-mono text-soft-gray">{project.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-white/80">{project.clientName}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${project.projectType === 'Global' ? 'text-purple' : 'text-amber-500'}`}>
                          {project.projectType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm text-soft-gray">
                      {project.industry}
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        project.status === 'Published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleProjectFeatured(project.id!, project.isFeatured).then(fetchProjects)}
                          className={`p-2 rounded-lg transition-all ${project.isFeatured ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-white/10 hover:text-white'}`}
                        >
                          <Star className={`w-4 h-4 ${project.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={() => openEditModal(project)}
                          className="p-2 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id!)}
                          className="p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portfolio Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/98 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-6xl bg-navy-surface border border-borderColor rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Briefcase className="text-electric" />
                  {editMode ? 'Edit Case Study' : 'New Portfolio Entry'}
                </h2>
                <p className="text-xs text-soft-gray mt-1 font-mono tracking-widest uppercase">Project Identity & Technical Specs</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all"><X /></button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto custom-scrollbar space-y-12">
              
              {/* Step 1: Core Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-electric/30"></span> 01. Branding
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Project Name (EN)</label>
                      <input 
                        required type="text" className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none"
                        value={formData.projectName.en} onChange={(e) => handleNameChange(e.target.value, 'en')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">প্রজেক্টের নাম (বাংলা)</label>
                      <input 
                        type="text" className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none"
                        value={formData.projectName.bn} onChange={(e) => handleNameChange(e.target.value, 'bn')}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-electric/30"></span> 02. Classification
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Client Name</label>
                      <input 
                        required type="text" className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none"
                        value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Client Type</label>
                      <select 
                        className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none appearance-none"
                        value={formData.projectType} onChange={(e) => setFormData({...formData, projectType: e.target.value as any})}
                      >
                        <option value="Global">Global Client</option>
                        <option value="Local">Local Client</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Content & Result Metrics */}
              <div className="space-y-8">
                <h3 className="text-sm font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-electric/30"></span> 03. Outcome & Success Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Industry</label>
                    <input 
                      type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none"
                      value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      placeholder="e.g. Fintech, Healthcare"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Cover Image (Cloudinary URL)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" className="flex-1 bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-xs font-mono"
                        value={formData.coverImage} onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                        placeholder="https://cloudinary.com/..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Status</label>
                    <select 
                      className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none"
                      value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option value="Draft">Draft (Internal)</option>
                      <option value="Published">Published (Public)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Case Study Summary */}
              <div className="space-y-6">
                 <h3 className="text-sm font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-electric/30"></span> 04. Case Study Details
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Overview (EN)</label>
                      <textarea 
                        rows={4} className="w-full bg-navy border border-borderColor rounded-2xl px-5 py-4 text-white focus:border-electric outline-none resize-none"
                        value={formData.overview.en} onChange={(e) => setFormData({...formData, overview: {...formData.overview, en: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">সারসংক্ষেপ (বাংলা)</label>
                      <textarea 
                        rows={4} className="w-full bg-navy border border-borderColor rounded-2xl px-5 py-4 text-white focus:border-electric outline-none resize-none"
                        value={formData.overview.bn} onChange={(e) => setFormData({...formData, overview: {...formData.overview, bn: e.target.value}})}
                      />
                    </div>
                 </div>
              </div>

              {/* Action Bar */}
              <div className="pt-10 border-t border-borderColor flex items-center justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all">Discard</button>
                <button type="submit" className="px-12 py-4 bg-electric hover:bg-bright-blue text-navy font-black rounded-2xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {editMode ? 'Update Case Study' : 'Publish to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};