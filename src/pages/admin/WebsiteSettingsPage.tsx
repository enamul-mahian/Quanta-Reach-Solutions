import React, { useState, useEffect } from 'react';
import { 
  getWebsiteSettings, 
  updateWebsiteSettings, 
  WebsiteSettingsData 
} from '@/services/websiteSettingsService';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Settings, 
  Save, 
  Globe, 
  Phone, 
  Share2, 
  BarChart2, 
  ShieldAlert,
  Image as ImageIcon,
  Check,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

type TabType = 'general' | 'contact' | 'social' | 'stats' | 'advanced';

export const WebsiteSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // সম্পূর্ণ ডিফল্ট স্টেট
  const defaultSettings: WebsiteSettingsData = {
    agencyName: 'MetaFore Technologies',
    tagline: { en: 'Digital Solutions for Global Growth', bn: 'গ্লোবাল গ্রোথের জন্য ডিজিটাল সলিউশন' },
    websiteUrl: 'https://metafore.tech',
    logo: '',
    favicon: '',
    contact: {
      phone: '', whatsapp: '', email: '',
      officeAddress: { en: '', bn: '' },
      googleMapUrl: '',
      businessHours: { en: '10:00 AM - 07:00 PM', bn: 'সকাল ১০:০০ - সন্ধ্যা ০৭:০০' }
    },
    social: { facebook: '', linkedin: '', twitter: '', instagram: '', youtube: '' },
    stats: { yearsOfExperience: 0, teamSize: 0, projectsCompleted: 0, clientsServed: 0, countriesServed: 0 },
    defaultLanguage: 'en',
    defaultCurrency: 'USD',
    globalAvailability: true,
    localMeetingAvailability: true,
    footerContent: { en: '© 2026 MetaFore. All Rights Reserved.', bn: '© ২০২৬ মেটাফোর। সর্বস্বত্ব সংরক্ষিত।' },
    announcement: { isActive: false, text: { en: '', bn: '' }, link: '' },
    maintenanceMode: false
  };

  const [formData, setFormData] = useState<WebsiteSettingsData>(defaultSettings);

  // ডাটা ফেচিং
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getWebsiteSettings();
      if (data) {
        // নতুন ফিল্ডগুলো যেন মিসিং না থাকে তাই ডিফল্টের সাথে মার্জ (Merge) করা হলো
        setFormData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // নেস্টেড অবজেক্ট আপডেটার হেল্পার
  const handleNestedChange = (category: keyof WebsiteSettingsData, field: string, value: any, lang?: 'en' | 'bn') => {
    setFormData(prev => {
      const updatedCategory = { ...(prev[category] as any) };
      if (lang) {
        updatedCategory[field] = { ...updatedCategory[field], [lang]: value };
      } else {
        updatedCategory[field] = value;
      }
      return { ...prev, [category]: updatedCategory };
    });
  };

  // সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Saving configuration...');
    try {
      await updateWebsiteSettings(formData);
      toast.success('Settings updated successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to save settings', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-electric border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1200px] mx-auto pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-electric" />
            {language === 'en' ? 'Global Settings' : 'গ্লোবাল সেটিংস'}
          </h1>
          <p className="text-soft-gray mt-1 text-sm">Manage core identity, contact info, and website configurations.</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 border-b border-borderColor">
        {[
          { id: 'general', icon: Globe, label: 'Identity & Basics' },
          { id: 'contact', icon: Phone, label: 'Contact Info' },
          { id: 'social', icon: Share2, label: 'Social Networks' },
          { id: 'stats', icon: BarChart2, label: 'Agency Stats' },
          { id: 'advanced', icon: ShieldAlert, label: 'Advanced / Preferences' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'text-electric border-electric bg-electric/5' 
                : 'text-soft-gray border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form id="settings-form" onSubmit={handleSubmit} className="space-y-10">
        
        {/* 1. General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Agency Name</label>
                <input required type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                  value={formData.agencyName} onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Primary Website URL</label>
                <input required type="url" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none font-mono text-xs" 
                  value={formData.websiteUrl} onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Tagline (EN)</label>
                <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                  value={formData.tagline.en} onChange={(e) => setFormData({...formData, tagline: {...formData.tagline, en: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">ট্যাগলাইন (বাংলা)</label>
                <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                  value={formData.tagline.bn} onChange={(e) => setFormData({...formData, tagline: {...formData.tagline, bn: e.target.value}})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Logo (Cloudinary URL)</label>
                <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none font-mono text-xs" 
                  value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Favicon (Cloudinary URL)</label>
                <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none font-mono text-xs" 
                  value={formData.favicon} onChange={(e) => setFormData({...formData, favicon: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Contact Info Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Primary Phone</label>
                <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                  value={formData.contact.phone} onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">WhatsApp Number</label>
                <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                  value={formData.contact.whatsapp} onChange={(e) => handleNestedChange('contact', 'whatsapp', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Support Email</label>
                <input type="email" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none" 
                  value={formData.contact.email} onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Office Address (EN)</label>
                <textarea rows={3} className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none resize-none" 
                  value={formData.contact.officeAddress.en} onChange={(e) => handleNestedChange('contact', 'officeAddress', e.target.value, 'en')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">অফিসের ঠিকানা (বাংলা)</label>
                <textarea rows={3} className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none resize-none" 
                  value={formData.contact.officeAddress.bn} onChange={(e) => handleNestedChange('contact', 'officeAddress', e.target.value, 'bn')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Business Hours (EN / BN)</label>
                <div className="flex gap-4">
                  <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-xs" 
                    value={formData.contact.businessHours.en} onChange={(e) => handleNestedChange('contact', 'businessHours', e.target.value, 'en')}
                  />
                  <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-xs" 
                    value={formData.contact.businessHours.bn} onChange={(e) => handleNestedChange('contact', 'businessHours', e.target.value, 'bn')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Google Map Embed URL</label>
                <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none font-mono text-xs" 
                  value={formData.contact.googleMapUrl} onChange={(e) => handleNestedChange('contact', 'googleMapUrl', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Social Networks Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
            {Object.keys(formData.social).map((network) => (
              <div key={network} className="flex items-center gap-4">
                <label className="w-32 text-xs font-bold text-soft-gray uppercase tracking-widest">{network}</label>
                <input 
                  type="url" 
                  placeholder={`https://${network}.com/...`}
                  className="flex-1 bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-xs font-mono" 
                  value={(formData.social as any)[network]} 
                  onChange={(e) => handleNestedChange('social', network, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* 4. Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {Object.keys(formData.stats).map((statKey) => (
              <div key={statKey} className="space-y-2 p-6 bg-navy border border-borderColor rounded-2xl">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">
                  {statKey.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input 
                  type="number" 
                  className="w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-2xl font-black text-electric outline-none font-mono" 
                  value={(formData.stats as any)[statKey]} 
                  onChange={(e) => handleNestedChange('stats', statKey, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        )}

        {/* 5. Advanced / Preferences Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-navy border border-borderColor rounded-3xl">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Default Language</label>
                <select className="w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-sm"
                  value={formData.defaultLanguage} onChange={(e) => setFormData({...formData, defaultLanguage: e.target.value as any})}
                >
                  <option value="en">English (EN)</option>
                  <option value="bn">Bangla (BN)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Base Currency</label>
                <select className="w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-sm"
                  value={formData.defaultCurrency} onChange={(e) => setFormData({...formData, defaultCurrency: e.target.value as any})}
                >
                  <option value="USD">USD ($)</option>
                  <option value="BDT">BDT (৳)</option>
                </select>
              </div>
              <div className="flex flex-col justify-center space-y-4 pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-electric" checked={formData.globalAvailability} onChange={(e) => setFormData({...formData, globalAvailability: e.target.checked})} />
                  <span className="text-xs font-bold text-soft-gray uppercase">Global Service On</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-electric" checked={formData.localMeetingAvailability} onChange={(e) => setFormData({...formData, localMeetingAvailability: e.target.checked})} />
                  <span className="text-xs font-bold text-soft-gray uppercase">Office Meetings On</span>
                </label>
              </div>
            </div>

            {/* Announcement Bar */}
            <div className="p-8 bg-navy border border-borderColor rounded-3xl space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-sm font-bold text-white uppercase tracking-widest">Announcement Bar</h3>
                 <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-electric" checked={formData.announcement.isActive} onChange={(e) => handleNestedChange('announcement', 'isActive', e.target.checked)} />
                    <span className="text-xs font-bold text-white uppercase">Enable Bar</span>
                 </label>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-100 transition-opacity">
                  <input type="text" placeholder="Promo Text (EN)" className="w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-white text-sm outline-none" value={formData.announcement.text.en} onChange={(e) => handleNestedChange('announcement', 'text', e.target.value, 'en')} />
                  <input type="text" placeholder="Promo Text (BN)" className="w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-white text-sm outline-none" value={formData.announcement.text.bn} onChange={(e) => handleNestedChange('announcement', 'text', e.target.value, 'bn')} />
                  <input type="text" placeholder="Call to Action Link (/pricing)" className="w-full bg-navy-surface border border-borderColor rounded-xl px-4 py-3 text-white text-sm outline-none md:col-span-2 font-mono" value={formData.announcement.link} onChange={(e) => handleNestedChange('announcement', 'link', e.target.value)} />
               </div>
            </div>

            {/* Footer Copyright */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">Footer Copyright (EN)</label>
                <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-xs" 
                  value={formData.footerContent.en} onChange={(e) => setFormData({...formData, footerContent: {...formData.footerContent, en: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-soft-gray uppercase tracking-widest">ফুটার কপিরাইট (বাংলা)</label>
                <input type="text" className="w-full bg-navy border border-borderColor rounded-xl px-4 py-3 text-white focus:border-electric outline-none text-xs" 
                  value={formData.footerContent.bn} onChange={(e) => setFormData({...formData, footerContent: {...formData.footerContent, bn: e.target.value}})}
                />
              </div>
            </div>

            {/* DANGER ZONE: Maintenance Mode */}
            <div className="p-6 mt-8 border border-red-500/20 bg-red-500/5 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-red-400 font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Maintenance Mode</h4>
                <p className="text-xs text-soft-gray mt-1">If enabled, public users will see a "Under Construction" page.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.maintenanceMode} onChange={(e) => setFormData({...formData, maintenanceMode: e.target.checked})} />
                <div className="w-11 h-6 bg-navy rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-soft-gray peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        )}

      </form>

      {/* Sticky Save Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-navy-surface/90 backdrop-blur-xl border-t border-borderColor z-50 flex items-center justify-end gap-4 shadow-[0_-10px_40px_rgba(7,20,38,0.5)]">
        <button 
          type="button" 
          onClick={fetchSettings} 
          disabled={saving}
          className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-50"
        >
          Reset
        </button>
        <button 
          type="submit" 
          form="settings-form"
          disabled={saving}
          className="px-12 py-3.5 bg-electric hover:bg-bright-blue text-navy font-black rounded-xl transition-all shadow-[0_10px_30px_rgba(22,139,255,0.3)] active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin"/> : <Save className="w-5 h-5" />}
          {saving ? 'Saving Config...' : 'Save Configuration'}
        </button>
      </div>

    </div>
  );
};