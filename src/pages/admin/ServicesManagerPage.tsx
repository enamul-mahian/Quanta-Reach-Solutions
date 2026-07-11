import React, { useState, useEffect } from 'react';
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService, 
  ServiceData, 
  toggleFeatured 
} from '@/services/serviceService';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  Globe, 
  DollarSign, 
  Layout, 
  X, 
  Check,
  Eye,
  ArrowRight,
  Settings2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ServicesManagerPage: React.FC = () => {
  const { language } = useLanguage();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // ফর্মের প্রফেশনাল স্টেট
  const initialFormState: Omit<ServiceData, 'id' | 'createdAt' | 'updatedAt'> = {
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
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ২. স্লাগ জেনারেশন লজিক
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  // ৩. ইনপুট হ্যান্ডলিং
  const handleTitleChange = (val: string, lang: 'en' | 'bn') => {
    setFormData(prev => {
      const newState = { ...prev, title: { ...prev.title, [lang]: val } };
      if (lang === 'en' && !editMode) {
        newState.slug = generateSlug(val);
      }
      return newState;
    });
  };

  // ৪. সাবমিট হ্যান্ডলার (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.en || !formData.slug) {
      toast.error('English Title and Slug are required!');
      return;
    }

    try {
      if (editMode && currentId) {
        await updateService(currentId, formData);
        toast.success('Service updated successfully');
      } else {
        await createService(formData);
        toast.success('Service created successfully');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      toast.error('An error occurred during submission');
    }
  };

  // ৫. এডিট মুড ওপেন
  const openEditModal = (service: ServiceData) => {
    setEditMode(true);
    setCurrentId(service.id!);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...rest } = service;
    setFormData(rest);
    setIsModalOpen(true);
  };

  // ৬. ডিলিট হ্যান্ডলার
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      await deleteService(id);
      toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredServices = services.filter(s => 
    s.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.title.bn.includes(searchQuery)
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Services Management' : 'সার্ভিস ম্যানেজমেন্ট'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">
            Create and manage bilingual service offerings with real-time updates.
          </p>
        </div>
        
        <button 
          onClick={() => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-electric hover:bg-bright-blue text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {language === 'en' ? 'Add New Service' : 'নতুন সার্ভিস যোগ করুন'}
        </button>
      </div>

      {/* Action Bar & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
          <input 
            type="text"
            placeholder={language === 'en' ? "Search services..." : "সার্ভিস খুঁজুন..."}
            className="w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="bg-navy-surface border border-borderColor rounded-2xl p-4 flex items-center justify-between">
          <span className="text-soft-gray text-sm font-medium">Total Published</span>
          <span className="text-2xl font-bold text-electric">{services.filter(s => s.status === 'Published').length}</span>
        </div>
      </div>

      {/* Services Table */}
      <div className="glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray">
              <tr>
                <th className="px-8 py-5">Service Overview</th>
                <th className="px-6 py-5">Pricing (USD / BDT)</th>
                <th className="px-6 py-5">Featured</th>
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
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-soft-gray font-light">
                    No services found. Start by adding one.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-electric/10 border border-electric/20 flex items-center justify-center text-electric group-hover:scale-110 transition-transform">
                          <Layout className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white group-hover:text-electric transition-colors">
                            {service.title.en}
                          </h4>
                          <p className="text-xs text-soft-gray mt-0.5">{service.title.bn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono font-bold text-white">${service.startingPriceUSD}</span>
                        <span className="text-xs text-soft-gray">৳{service.startingPriceBDT}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={() => toggleFeatured(service.id!, service.isFeatured).then(fetchServices)}
                        className={`p-2 rounded-xl transition-all ${service.isFeatured ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-soft-gray bg-white/5 border border-white/5'}`}
                      >
                        <Star className={`w-5 h-5 ${service.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        service.status === 'Published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(service)}
                          className="p-2.5 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-xl transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id!)}
                          className="p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all"
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

      {/* Professional Data Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 lg:p-8">
          <div className="absolute inset-0 bg-navy/95 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-5xl bg-navy-surface border border-borderColor rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {editMode ? <Edit3 className="text-electric" /> : <Plus className="text-electric" />}
                  {editMode ? 'Edit Service Listing' : 'Create New Agency Service'}
                </h2>
                <p className="text-xs text-soft-gray uppercase tracking-widest mt-1">Global & Local Sync Enabled</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-white/5 rounded-2xl text-soft-gray hover:text-white transition-all border border-transparent hover:border-borderColor"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body - Scrollable Form */}
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-10">
              
              {/* Section 1: Basic Info (Bilingual) */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-electric uppercase tracking-widest flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-electric/30"></span> 1. Core Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soft-gray uppercase">Service Title (English)</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none"
                      value={formData.title.en}
                      onChange={(e) => handleTitleChange(e.target.value, 'en')}
                      placeholder="e.g. Enterprise Web Development"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soft-gray uppercase">সার্ভিস টাইটেল (বাংলা)</label>
                    <input 
                      type="text"
                      className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none"
                      value={formData.title.bn}
                      onChange={(e) => handleTitleChange(e.target.value, 'bn')}
                      placeholder="যেমন: এন্টারপ্রাইজ ওয়েব ডেভেলপমেন্ট"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-soft-gray uppercase">URL Slug (Auto-generated)</label>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-soft-gray" />
                    <input 
                      required
                      type="text"
                      className="flex-1 bg-navy/50 border border-borderColor rounded-xl px-4 py-3 text-electric font-mono text-sm outline-none"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: generateSlug(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Sorting */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-electric uppercase tracking-widest flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-electric/30"></span> 2. Commercials & Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soft-gray uppercase">Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" />
                      <input 
                        type="number"
                        className="w-full bg-navy border border-borderColor rounded-xl pl-10 pr-4 py-3 text-white focus:border-electric outline-none"
                        value={formData.startingPriceUSD}
                        onChange={(e) => setFormData({...formData, startingPriceUSD: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soft-gray uppercase">Price (BDT)</label>
                    <div className="relative font-sans font-bold flex items-center">
                      <span className="absolute left-4 text-soft-gray">৳</span>
                      <input 
                        type="number"
                        className="w-full bg-navy border border-borderColor rounded-xl pl-10 pr-4 py-3 text-white focus:border-electric outline-none"
                        value={formData.startingPriceBDT}
                        onChange={(e) => setFormData({...formData, startingPriceBDT: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soft-gray uppercase">Status</label>
                    <select 
                      className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none appearance-none"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option value="Draft">Draft (Hidden)</option>
                      <option value="Published">Published (Live)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Content Descriptions */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-electric uppercase tracking-widest flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-electric/30"></span> 3. Content Strategy
                </h3>
                <div className="space-y-4">
                  <label className="text-xs font-mono text-soft-gray uppercase">Short Description (English)</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none resize-none"
                    value={formData.shortDescription.en}
                    onChange={(e) => setFormData({...formData, shortDescription: {...formData.shortDescription, en: e.target.value}})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-mono text-soft-gray uppercase">সংক্ষিপ্ত বর্ণনা (বাংলা)</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none resize-none"
                    value={formData.shortDescription.bn}
                    onChange={(e) => setFormData({...formData, shortDescription: {...formData.shortDescription, bn: e.target.value}})}
                  />
                </div>
              </div>

              {/* Section 4: SEO Metadata */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-electric uppercase tracking-widest flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-electric/30"></span> 4. Search Engine Optimization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soft-gray uppercase">SEO Meta Title</label>
                    <input 
                      type="text"
                      className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none"
                      value={formData.seo.title}
                      onChange={(e) => setFormData({...formData, seo: {...formData.seo, title: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soft-gray uppercase">SEO Keywords (Comma separated)</label>
                    <input 
                      type="text"
                      className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none font-mono text-xs"
                      placeholder="web development, react, agency"
                      onChange={(e) => setFormData({...formData, seo: {...formData.seo, keywords: e.target.value.split(',')}})}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-10 border-t border-borderColor flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="px-10 py-3.5 bg-electric hover:bg-bright-blue text-navy font-black rounded-2xl transition-all shadow-[0_10px_30px_rgba(22,139,255,0.3)] active:scale-95 flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editMode ? 'Update Database' : 'Publish Service'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};