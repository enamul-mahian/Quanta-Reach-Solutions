import React, { useState, useEffect } from 'react';
import { 
  getPricingPackages, 
  createPricingPackage, 
  updatePricingPackage, 
  deletePricingPackage, 
  PricingPackage,
  PricingFeature,
  togglePackageStatus,
  togglePackageRecommended
} from '@/services/pricingService';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  Tag, 
  X, 
  Check, 
  DollarSign, 
  Clock, 
  RefreshCcw, 
  Zap,
  Globe2,
  MapPin,
  ListPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PricingManagerPage: React.FC = () => {
  const { language } = useLanguage();
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // ইনিশিয়াল ফর্ম স্টেট
  const initialFormState: Omit<PricingPackage, 'id' | 'createdAt' | 'updatedAt'> = {
    name: { en: '', bn: '' },
    description: { en: '', bn: '' },
    priceBDT: 0,
    priceUSD: 0,
    pricingType: 'Starting From',
    features: [],
    deliveryTime: { en: '', bn: '' },
    revisionLimit: 'Unlimited',
    supportPeriod: { en: '', bn: '' },
    availability: 'Both',
    isRecommended: false,
    ctaLabel: { en: 'Get Started', bn: 'শুরু করুন' },
    status: 'Active',
    sortOrder: 0
  };

  const [formData, setFormData] = useState(initialFormState);

  // ডাইনামিক ফিচার স্টেট
  const [newFeature, setNewFeature] = useState<PricingFeature>({
    text: { en: '', bn: '' },
    included: true
  });

  // ডাটা লোড করা
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await getPricingPackages({ includeInactive: true });
      setPackages(data);
    } catch (error) {
      toast.error('Failed to load pricing packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // ফিচার হ্যান্ডলিং
  const addFeature = () => {
    if (!newFeature.text.en) return;
    setFormData({ ...formData, features: [...formData.features, newFeature] });
    setNewFeature({ text: { en: '', bn: '' }, included: true });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  // সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.en || formData.priceBDT <= 0) {
      toast.error('Name and Price are required');
      return;
    }

    try {
      if (editMode && currentId) {
        await updatePricingPackage(currentId, formData);
        toast.success('Package updated');
      } else {
        await createPricingPackage(formData);
        toast.success('New package created');
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (error) {
      toast.error('Submission failed');
    }
  };

  const openEditModal = (pkg: PricingPackage) => {
    setEditMode(true);
    setCurrentId(pkg.id!);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...rest } = pkg;
    setFormData(rest);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanently delete this pricing package?')) return;
    try {
      await deletePricingPackage(id);
      toast.success('Package removed');
      fetchPackages();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const filteredPackages = packages.filter(p => 
    p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.bn.includes(searchQuery)
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Tag className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Pricing & Packages' : 'প্রাইসিং ও প্যাকেজ সমূহ'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">
            Manage your service tiers, BDT/USD pricing, and feature comparisons.
          </p>
        </div>
        
        <button 
          onClick={() => { setEditMode(false); setFormData(initialFormState); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-electric hover:bg-bright-blue text-navy font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(22,139,255,0.2)]"
        >
          <Plus className="w-5 h-5" />
          {language === 'en' ? 'Create Package' : 'প্যাকেজ তৈরি করুন'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
        <input 
          type="text"
          placeholder="Search packages..."
          className="w-full bg-navy-surface border border-borderColor rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-electric outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="glass-panel border-borderColor rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] border-b border-borderColor text-[10px] font-mono uppercase tracking-[0.2em] text-soft-gray">
              <tr>
                <th className="px-8 py-5">Package Identity</th>
                <th className="px-6 py-5">Price (BDT / USD)</th>
                <th className="px-6 py-5">Availability</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor/50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={5} className="px-8 py-10 bg-white/[0.01]" /></tr>
                ))
              ) : filteredPackages.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-soft-gray">No packages defined yet.</td></tr>
              ) : (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${pkg.isRecommended ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/5 text-white/30'}`}>
                          <Zap className={`w-5 h-5 ${pkg.isRecommended ? 'fill-current' : ''}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-electric transition-colors">{pkg.name.en}</h4>
                          <p className="text-[11px] text-soft-gray">{pkg.pricingType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono font-bold text-white">৳{pkg.priceBDT.toLocaleString()}</span>
                        <span className="text-xs text-soft-gray">${pkg.priceUSD}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/50 uppercase">
                          {pkg.availability === 'Global' ? <Globe2 className="w-3.5 h-3.5 text-purple" /> : <MapPin className="w-3.5 h-3.5 text-amber-500" />}
                          {pkg.availability}
                       </span>
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={() => togglePackageStatus(pkg.id!, pkg.status).then(fetchPackages)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                          pkg.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-white/5 text-white/20 border-white/5'
                        }`}
                      >
                        {pkg.status}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => togglePackageRecommended(pkg.id!, pkg.isRecommended).then(fetchPackages)}
                          className={`p-2 rounded-lg transition-all ${pkg.isRecommended ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-white/10 hover:text-white'}`}
                          title="Set as Recommended"
                        >
                          <Star className={`w-4 h-4 ${pkg.isRecommended ? 'fill-current' : ''}`} />
                        </button>
                        <button onClick={() => openEditModal(pkg)} className="p-2 bg-white/5 hover:bg-electric text-white hover:text-navy rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(pkg.id!)} className="p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/98 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-5xl bg-navy-surface border border-borderColor rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-8 border-b border-borderColor flex justify-between items-center bg-white/[0.01]">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Tag className="text-electric" />
                  {editMode ? 'Modify Pricing Tier' : 'New Pricing Package'}
                </h2>
                <p className="text-xs text-soft-gray mt-1 uppercase tracking-widest font-mono">Bilingual Revenue Optimization</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-soft-gray transition-all"><X /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto custom-scrollbar space-y-12">
              
              {/* Core Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                      <span className="w-10 h-[1px] bg-electric/30"></span> 01. Naming
                   </h3>
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Package Name (EN)</label>
                        <input required type="text" className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none" 
                          value={formData.name.en} onChange={(e) => setFormData({...formData, name: {...formData.name, en: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">প্যাকেজের নাম (বাংলা)</label>
                        <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none" 
                          value={formData.name.bn} onChange={(e) => setFormData({...formData, name: {...formData.name, bn: e.target.value}})}
                        />
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                      <span className="w-10 h-[1px] bg-electric/30"></span> 02. Commercials
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Price (BDT ৳)</label>
                        <input required type="number" className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none font-mono" 
                          value={formData.priceBDT} onChange={(e) => setFormData({...formData, priceBDT: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Price (USD $)</label>
                        <input required type="number" className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none font-mono" 
                          value={formData.priceUSD} onChange={(e) => setFormData({...formData, priceUSD: Number(e.target.value)})}
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Market Availability</label>
                      <select 
                        className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none appearance-none"
                        value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value as any})}
                      >
                        <option value="Both">Global & Local</option>
                        <option value="Local">Local (Bangladesh) Only</option>
                        <option value="Global">Global (International) Only</option>
                      </select>
                   </div>
                </div>
              </div>

              {/* Dynamic Features Editor */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-electric uppercase tracking-[0.3em] flex items-center gap-4">
                   <span className="w-10 h-[1px] bg-electric/30"></span> 03. Dynamic Feature List
                </h3>
                <div className="bg-navy border border-borderColor rounded-3xl p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-5 space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase">Feature (EN)</label>
                        <input type="text" className="w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-electric" 
                          value={newFeature.text.en} onChange={(e) => setNewFeature({...newFeature, text: {...newFeature.text, en: e.target.value}})}
                          placeholder="e.g. Free Domain Registration"
                        />
                      </div>
                      <div className="md:col-span-5 space-y-2">
                        <label className="text-[10px] font-bold text-soft-gray uppercase">ফিচার (বাংলা)</label>
                        <input type="text" className="w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-electric" 
                          value={newFeature.text.bn} onChange={(e) => setNewFeature({...newFeature, text: {...newFeature.text, bn: e.target.value}})}
                        />
                      </div>
                      <div className="md:col-span-2">
                         <button type="button" onClick={addFeature} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-borderColor flex items-center justify-center gap-2 text-xs font-bold transition-all">
                            <Plus className="w-4 h-4" /> Add
                         </button>
                      </div>
                   </div>

                   <div className="space-y-3 pt-4 border-t border-borderColor/30">
                      {formData.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl group">
                           <div className="flex items-center gap-4">
                              <button type="button" onClick={() => {
                                const updated = [...formData.features];
                                updated[idx].included = !updated[idx].included;
                                setFormData({...formData, features: updated});
                              }}>
                                 <Check className={`w-5 h-5 ${feature.included ? 'text-emerald-400' : 'text-white/10'}`} />
                              </button>
                              <div>
                                 <p className="text-xs font-bold text-white">{feature.text.en}</p>
                                 <p className="text-[10px] text-soft-gray">{feature.text.bn}</p>
                              </div>
                           </div>
                           <button type="button" onClick={() => removeFeature(idx)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      ))}
                      {formData.features.length === 0 && <p className="text-center text-[10px] text-white/10 uppercase tracking-[0.2em] py-4">No features added yet</p>}
                   </div>
                </div>
              </div>

              {/* Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Delivery Time (EN)</label>
                    <div className="relative">
                       <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" />
                       <input type="text" className="w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-4 text-white focus:border-electric outline-none" 
                        value={formData.deliveryTime.en} onChange={(e) => setFormData({...formData, deliveryTime: {...formData.deliveryTime, en: e.target.value}})}
                        placeholder="e.g. 15-20 Days"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Revisions</label>
                    <div className="relative">
                       <RefreshCcw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gray" />
                       <input type="text" className="w-full bg-navy border border-borderColor rounded-xl pl-12 pr-4 py-4 text-white focus:border-electric outline-none" 
                        value={formData.revisionLimit} onChange={(e) => setFormData({...formData, revisionLimit: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Sort Order</label>
                    <input type="number" className="w-full bg-navy border border-borderColor rounded-xl px-5 py-4 text-white focus:border-electric outline-none font-mono" 
                      value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})}
                    />
                 </div>
              </div>

              {/* Action Bar */}
              <div className="pt-10 border-t border-borderColor flex items-center justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all">Discard</button>
                <button type="submit" className="px-12 py-4 bg-electric hover:bg-bright-blue text-navy font-black rounded-2xl transition-all shadow-[0_10px_40px_rgba(22,139,255,0.3)] flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {editMode ? 'Update Package' : 'Publish Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};