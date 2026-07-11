import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  getAllLegalPages, 
  updateLegalPage, 
  LegalPageData, 
  LegalPageType 
} from '@/services/legalPageService';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Scale, 
  ShieldCheck, 
  FileSignature, 
  RefreshCcw, 
  LockKeyhole, 
  Edit3, 
  X, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

// ফিক্সড ৪টি লিগ্যাল পেজের কনফিগারেশন
const LEGAL_PAGES_CONFIG: { type: LegalPageType; icon: any; title: string; desc: string }[] = [
  { type: 'privacy-policy', icon: ShieldCheck, title: 'Privacy Policy', desc: 'Rules on user data collection and processing.' },
  { type: 'terms-and-conditions', icon: FileSignature, title: 'Terms & Conditions', desc: 'General rules and guidelines for using the services.' },
  { type: 'refund-policy', icon: RefreshCcw, title: 'Refund Policy', desc: 'Conditions under which clients can request refunds.' },
  { type: 'nda-and-confidentiality', icon: LockKeyhole, title: 'NDA & Confidentiality', desc: 'Non-disclosure and privacy agreements for projects.' }
];

export const LegalPagesManagerPage: React.FC = () => {
  const { language } = useLanguage();
  const [dbPages, setDbPages] = useState<Record<string, LegalPageData>>({});
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<LegalPageType | null>(null);

  // এডিটর ফর্ম স্টেট
  const initialFormState: Omit<LegalPageData, 'id' | 'type' | 'createdAt' | 'updatedAt'> = {
    title: { en: '', bn: '' },
    content: { en: '', bn: '' },
    seo: { title: '', description: '', keywords: [] },
    status: 'Draft'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [tagInput, setTagInput] = useState('');

  // ১. ডাটা ফেচিং
  const fetchLegalPages = async () => {
    setLoading(true);
    try {
      const data = await getAllLegalPages();
      // ডাটাবেস থেকে আসা অ্যারে-কে অবজেক্টে রূপান্তর করা হলো সহজে খোঁজার জন্য
      const pagesMap: Record<string, LegalPageData> = {};
      data.forEach(page => {
        pagesMap[page.type] = page;
      });
      setDbPages(pagesMap);
    } catch (error) {
      toast.error('Failed to load legal pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegalPages();
  }, []);

  // ২. Quill এডিটর কনফিগারেশন
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  }), []);

  // ৩. এডিটর ওপেন করা
  const openEditor = (type: LegalPageType) => {
    setSelectedType(type);
    const existingData = dbPages[type];
    
    if (existingData) {
      setFormData({
        title: existingData.title,
        content: existingData.content,
        seo: existingData.seo || { title: '', description: '', keywords: [] },
        status: existingData.status
      });
    } else {
      // যদি ডাটাবেসে না থাকে, তাহলে ডিফল্ট টাইটেল দিয়ে শুরু হবে
      const config = LEGAL_PAGES_CONFIG.find(c => c.type === type);
      setFormData({
        ...initialFormState,
        title: { en: config?.title || '', bn: '' }
      });
    }
    setIsModalOpen(true);
  };

  // ৪. সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    if (!formData.title.en) {
      toast.error('English Title is required');
      return;
    }

    try {
      await updateLegalPage(selectedType, formData);
      toast.success('Legal page updated successfully');
      setIsModalOpen(false);
      fetchLegalPages();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update legal page');
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.seo.keywords.includes(tagInput.trim())) {
        setFormData({ 
          ...formData, 
          seo: { ...formData.seo, keywords: [...formData.seo.keywords, tagInput.trim()] } 
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ 
      ...formData, 
      seo: { ...formData.seo, keywords: formData.seo.keywords.filter(t => t !== tag) } 
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Scale className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Legal & Policy Pages' : 'লিগ্যাল পেজ ম্যানেজমেন্ট'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">
            Manage your agency's privacy policies, terms, and NDAs.
          </p>
        </div>
      </div>

      {/* Grid Layout for Fixed Legal Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {LEGAL_PAGES_CONFIG.map((config) => {
          const pageData = dbPages[config.type];
          const isPublished = pageData?.status === 'Published';
          const Icon = config.icon;

          return (
            <div key={config.type} className="glass-panel border-borderColor rounded-3xl p-6 flex flex-col justify-between group hover:border-electric transition-colors h-[280px]">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${pageData ? 'bg-electric/10 text-electric' : 'bg-navy border border-borderColor text-soft-gray'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {pageData && (
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      {pageData.status}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{config.title}</h3>
                <p className="text-xs text-soft-gray leading-relaxed">{config.desc}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-borderColor/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-soft-gray">
                  {pageData?.updatedAt ? `Updated: ${pageData.updatedAt.toDate().toLocaleDateString()}` : 'Not Created Yet'}
                </span>
                <button 
                  onClick={() => openEditor(config.type)}
                  className={`p-2.5 rounded-xl transition-all ${pageData ? 'bg-white/5 hover:bg-electric text-white hover:text-navy' : 'bg-electric hover:bg-bright-blue text-navy font-bold shadow-[0_5px_15px_rgba(22,139,255,0.2)]'}`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Screen Editor Modal */}
      {isModalOpen && selectedType && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center">
          <div className="absolute inset-0 bg-navy/98 backdrop-blur-xl" />
          
          <div className="relative w-full h-full lg:w-[95%] lg:h-[95vh] bg-navy-surface border border-borderColor lg:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500">
            {/* Header */}
            <div className="p-6 lg:p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-electric/10 flex items-center justify-center text-electric">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{dbPages[selectedType] ? 'Edit' : 'Create'} {LEGAL_PAGES_CONFIG.find(c => c.type === selectedType)?.title}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-soft-gray uppercase tracking-widest font-mono">Status</span>
                    <ChevronRight className="w-3 h-3 text-white/20" />
                    <span className="text-[10px] text-electric uppercase tracking-widest font-mono">{formData.status}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all"><X /></button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 space-y-16 pb-32">
              
              {/* Titles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-electric/30"></span> 01. Legal Document Title
                  </h3>
                  <div className="space-y-4">
                    <input required type="text" placeholder="Title (EN) - e.g. Privacy Policy" className="w-full bg-navy border border-borderColor rounded-2xl px-6 py-4 text-lg font-bold text-white focus:border-electric outline-none" 
                      value={formData.title.en} onChange={(e) => setFormData({...formData, title: {...formData.title, en: e.target.value}})}
                    />
                    <input type="text" placeholder="টাইটেল (বাংলা) - যেমন: প্রাইভেসি পলিসি" className="w-full bg-navy border border-borderColor rounded-2xl px-6 py-4 text-lg font-bold text-white focus:border-electric outline-none" 
                      value={formData.title.bn} onChange={(e) => setFormData({...formData, title: {...formData.title, bn: e.target.value}})}
                    />
                  </div>
                </div>
              </div>

              {/* Rich Text Editor - English */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-electric/30"></span> 02. English Policy Content
                </h3>
                <div className="bg-navy border border-borderColor rounded-3xl overflow-hidden min-h-[400px]">
                   <ReactQuill theme="snow" value={formData.content.en} onChange={(val) => setFormData({...formData, content: {...formData.content, en: val}})} modules={quillModules} className="h-[350px] text-white" />
                </div>
              </div>

              {/* Rich Text Editor - Bangla */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-purple uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-purple/30"></span> 03. বাংলা পলিসি কন্টেন্ট (BN)
                </h3>
                <div className="bg-navy border border-borderColor rounded-3xl overflow-hidden min-h-[400px]">
                   <ReactQuill theme="snow" value={formData.content.bn} onChange={(val) => setFormData({...formData, content: {...formData.content, bn: val}})} modules={quillModules} className="h-[350px] text-white" />
                </div>
              </div>

              {/* SEO and Status */}
              <div className="space-y-6 pb-20">
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-amber-500/30"></span> 04. Metadata & Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-navy/30 border border-borderColor rounded-3xl p-8">
                   <div className="space-y-4">
                      <input type="text" placeholder="SEO Meta Title" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white" 
                        value={formData.seo.title} onChange={(e) => setFormData({...formData, seo: {...formData.seo, title: e.target.value}})}
                      />
                      <textarea rows={3} placeholder="Meta Description for Search Engines" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white resize-none" 
                        value={formData.seo.description} onChange={(e) => setFormData({...formData, seo: {...formData.seo, description: e.target.value}})}
                      />
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <input type="text" placeholder="Keywords (Press Enter)" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white" 
                           value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagAdd}
                         />
                         <div className="flex flex-wrap gap-2 mt-2">
                            {formData.seo.keywords.map(tag => (
                              <span key={tag} className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-soft-gray rounded-md">
                                {tag} <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3 hover:text-white" /></button>
                              </span>
                            ))}
                         </div>
                      </div>
                      <select className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-xs text-white outline-none appearance-none" 
                        value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      >
                         <option value="Draft">Save as Draft (Hidden)</option>
                         <option value="Published">Publish Live</option>
                      </select>
                   </div>
                </div>
              </div>

              {/* Sticky Footer Action Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-6 bg-navy-surface/80 backdrop-blur-xl border-t border-borderColor z-10 flex items-center justify-end gap-4 shadow-[0_-10px_40px_rgba(7,20,38,0.5)]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white/5 text-white font-bold rounded-xl transition-all">Discard</button>
                  <button type="submit" className="px-12 py-3 bg-electric hover:bg-bright-blue text-navy font-black rounded-xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {dbPages[selectedType] ? 'Update Policy' : 'Create Policy'}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};