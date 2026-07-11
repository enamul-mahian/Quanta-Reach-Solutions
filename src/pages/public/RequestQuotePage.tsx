// =========================================================================
// MetaFore Technologies - Request a Quote Page (Live Firestore Integrated)
// =========================================================================

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, Paperclip, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { submitInquiry } from '@/services/inquiryService'; // ব্যাকএন্ড সার্ভিস ইম্পোর্ট
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';

export const RequestQuotePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ফর্মের সম্পূর্ণ স্টেট
  const [formData, setFormData] = useState({
    name: '', 
    company: '', 
    email: '', 
    phone: '', 
    whatsapp: '', 
    country: '',
    clientType: 'Global' as 'Local' | 'Global', 
    preferredLanguage: 'English', 
    contactMethod: 'Email',
    services: [] as string[], 
    projectType: 'New Project',
    budget: '', 
    currency: 'USD' as 'USD' | 'BDT', 
    timeline: '',
    description: '', 
    referenceLinks: '',
    ndaRequired: false, 
    meetingRequired: false, 
    consent: false
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const availableServices = [
    'Web Development', 'Mobile App', 'UI/UX Design', 
    'E-commerce', 'Digital Marketing & SEO', 'Cloud & Security'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service) 
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        toast.error(language === 'en' ? 'File size must be less than 15MB.' : 'ফাইলের সাইজ ১৫ মেগাবাইটের কম হতে হবে।');
        return;
      }
      setSelectedFile(file);
    }
  };

  // ফর্ম সাবমিশন লজিক
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ভ্যালিডেশন
    if (!formData.consent) {
      toast.error(language === 'en' ? 'Please agree to the privacy policy.' : 'দয়া করে প্রাইভেসি পলিসিতে সম্মতি দিন।');
      return;
    }
    if (formData.services.length === 0) {
      toast.error(language === 'en' ? 'Please select at least one service.' : 'দয়া করে অন্তত একটি সার্ভিস নির্বাচন করুন।');
      return;
    }

    setIsSubmitting(true);
    let fileUrl = '';

    try {
      // ১. ফাইল থাকলে ক্লাউডিনারিতে আপলোড
      if (selectedFile) {
        toast.loading(language === 'en' ? 'Uploading attachment...' : 'ফাইল আপলোড হচ্ছে...', { id: 'processToast' });
        const uploadResult = await uploadToCloudinary(selectedFile, (percent) => {
          setUploadProgress(percent);
        });
        fileUrl = uploadResult.url;
      }

      // ২. ডেটা ম্যাপিং (Interface অনুযায়ী রূপান্তর)
      const payload = {
        fullName: formData.name,
        companyName: formData.company,
        email: formData.email,
        phone: formData.phone,
        whatsappNumber: formData.whatsapp,
        country: formData.country,
        clientType: formData.clientType,
        preferredLanguage: formData.preferredLanguage === 'English' ? 'en' : 'bn' as 'en' | 'bn',
        preferredContactMethod: (formData.contactMethod === 'Phone Call' ? 'Phone' : formData.contactMethod) as 'Email' | 'WhatsApp' | 'Phone',
        requiredServices: formData.services,
        projectType: formData.projectType,
        estimatedBudget: formData.budget,
        currency: formData.currency,
        expectedTimeline: formData.timeline || 'Not Specified',
        projectDescription: formData.description,
        referenceLinks: formData.referenceLinks,
        fileUrl: fileUrl,
        ndaRequired: formData.ndaRequired,
        meetingRequired: formData.meetingRequired,
        consent: formData.consent
      };

      // ৩. ফায়ারস্টোরে সেভ করা
      toast.loading(language === 'en' ? 'Sending request...' : 'রিকোয়েস্ট পাঠানো হচ্ছে...', { id: 'processToast' });
      await submitInquiry(payload);

      // ৪. সফল সাবমিশন মেসেজ
      toast.success(
        language === 'en' 
          ? 'Quote request sent successfully! We will contact you soon.' 
          : 'কোটেশন রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।',
        { id: 'processToast' }
      );
      
      // ৫. ফর্ম রিসেট
      setFormData({
        name: '', company: '', email: '', phone: '', whatsapp: '', country: '',
        clientType: 'Global', preferredLanguage: 'English', contactMethod: 'Email',
        services: [], projectType: 'New Project', budget: '', currency: 'USD', timeline: '',
        description: '', referenceLinks: '', ndaRequired: false, meetingRequired: false, consent: false
      });
      setSelectedFile(null);
      setUploadProgress(0);

    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.error(language === 'en' ? 'Submission failed. Please check your connection.' : 'সাবমিশন ব্যর্থ হয়েছে। আপনার ইন্টারনেট কানেকশন চেক করুন।', { id: 'processToast' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col bg-navy min-h-screen">
      <Helmet>
        <title>{language === 'en' ? 'Request a Quote' : 'কোটেশন অনুরোধ করুন'} | MetaFore Technologies</title>
      </Helmet>

      {/* Header Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 border-b border-borderColor bg-navy-surface relative">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-electric/10 rounded-full blur-[100px] pointer-events-none"></div>
        <Container className="relative z-10 text-center max-w-3xl">
          <SectionHeading 
            badge={t.common.requestQuote}
            title={language === 'en' ? 'Tell Us About Your Project' : 'আপনার প্রজেক্ট সম্পর্কে আমাদের জানান'}
            subtitle={language === 'en' 
              ? 'Fill out the form below to get a detailed proposal, timeline, and estimated cost for your project.' 
              : 'আপনার প্রজেক্টের বিস্তারিত প্রপোজাল, সময়সীমা এবং খরচের ধারণা পেতে নিচের ফর্মটি পূরণ করুন।'}
            className="mx-auto mb-0"
          />
        </Container>
      </section>

      {/* Form Section */}
      <section className="py-16 relative">
        <Container className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* 1. Client Information */}
            <div className="glass-panel p-8 rounded-2xl border-borderColor">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-borderColor pb-4">
                {language === 'en' ? '1. Client Information' : '১. ক্লায়েন্টের তথ্য'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Full Name *' : 'পুরো নাম *'}</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Company Name' : 'কোম্পানির নাম'}</label>
                  <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Email Address *' : 'ইমেইল এড্রেস *'}</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Phone Number *' : 'ফোন নম্বর *'}</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'WhatsApp Number' : 'হোয়াটসঅ্যাপ নম্বর'}</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Country *' : 'দেশ *'}</label>
                  <input required type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Client Type' : 'ক্লায়েন্ট টাইপ'}</label>
                  <select name="clientType" value={formData.clientType} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none">
                    <option value="Global">Global (International)</option>
                    <option value="Local">Local (Bangladesh)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Preferred Language' : 'পছন্দের ভাষা'}</label>
                  <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none">
                    <option value="English">English</option>
                    <option value="Bangla">বাংলা (Bangla)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Contact Method' : 'যোগাযোগের মাধ্যম'}</label>
                  <select name="contactMethod" value={formData.contactMethod} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none">
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Project Details */}
            <div className="glass-panel p-8 rounded-2xl border-borderColor">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-borderColor pb-4">
                {language === 'en' ? '2. Project Details' : '২. প্রজেক্টের বিস্তারিত'}
              </h3>
              
              <div className="mb-6">
                <label className="text-sm font-medium text-soft-gray mb-4 block">{language === 'en' ? 'Required Services * (Select multiple)' : 'প্রয়োজনীয় সার্ভিস * (একাধিক নির্বাচন করা যাবে)'}</label>
                <div className="flex flex-wrap gap-3">
                  {availableServices.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        formData.services.includes(service)
                          ? 'bg-electric/20 border-electric text-white'
                          : 'bg-navy border-borderColor text-soft-gray hover:border-electric/50 hover:text-white'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Project Type' : 'প্রজেক্টের ধরন'}</label>
                  <select name="projectType" value={formData.projectType} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none">
                    <option value="New Project">New Project / From Scratch</option>
                    <option value="Redesign">Redesign / Revamp</option>
                    <option value="Maintenance">Maintenance / Support</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Expected Timeline' : 'প্রত্যাশিত সময়সীমা'}</label>
                  <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none">
                    <option value="">Select Timeline</option>
                    <option value="1-2 Months">1-2 Months</option>
                    <option value="3-6 Months">3-6 Months</option>
                    <option value="6+ Months">6+ Months</option>
                    <option value="Urgent">Urgent (ASAP)</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Project Description *' : 'প্রজেক্টের বিবরণ *'}</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={5} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all resize-none outline-none" placeholder={language === 'en' ? 'Describe your goals, features, and requirements...' : 'আপনার প্রজেক্টের লক্ষ্য এবং রিকোয়ারমেন্টস লিখুন...'}></textarea>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Reference Links (Optional)' : 'রেফারেন্স লিংক (ঐচ্ছিক)'}</label>
                <input type="text" name="referenceLinks" value={formData.referenceLinks} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" placeholder="https://example.com" />
              </div>

              <div>
                <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Upload Document/Brief (Optional)' : 'ডকুমেন্ট আপলোড (ঐচ্ছিক)'}</label>
                <div className="relative border-2 border-dashed border-borderColor rounded-lg p-6 hover:border-electric transition-colors bg-navy text-center">
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  <div className="flex flex-col items-center pointer-events-none">
                    <Paperclip className="w-8 h-8 text-soft-gray mb-2" />
                    <span className="text-white font-medium">
                      {selectedFile ? selectedFile.name : (language === 'en' ? 'Click or drag file to upload' : 'আপলোড করতে এখানে ক্লিক করুন')}
                    </span>
                    <span className="text-xs text-soft-gray mt-1">PDF, DOC, JPG (Max 15MB)</span>
                  </div>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-navy-surface rounded-full h-1.5 mt-4 overflow-hidden">
                    <div className="bg-electric h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Budget & Extras */}
            <div className="glass-panel p-8 rounded-2xl border-borderColor">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-borderColor pb-4">
                {language === 'en' ? '3. Budget & Requirements' : '৩. বাজেট এবং অন্যান্য'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Estimated Budget *' : 'আনুমানিক বাজেট *'}</label>
                  <input required type="text" name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" placeholder="e.g. 50,000 or 5,000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-gray mb-2 block">{language === 'en' ? 'Currency' : 'মুদ্রা (Currency)'}</label>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none">
                    <option value="USD">USD ($)</option>
                    <option value="BDT">BDT (৳)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" name="ndaRequired" checked={formData.ndaRequired} onChange={handleInputChange} className="peer appearance-none w-5 h-5 border-2 border-soft-gray rounded checked:border-electric checked:bg-electric transition-colors" />
                    <ShieldCheck className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-soft-gray group-hover:text-white transition-colors">
                    {language === 'en' ? 'I require a Non-Disclosure Agreement (NDA)' : 'আমার একটি এনডিএ (NDA) চুক্তি প্রয়োজন'}
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" name="meetingRequired" checked={formData.meetingRequired} onChange={handleInputChange} className="peer appearance-none w-5 h-5 border-2 border-soft-gray rounded checked:border-purple-accent checked:bg-purple-accent transition-colors" />
                    <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-soft-gray group-hover:text-white transition-colors">
                    {language === 'en' ? 'I want to schedule an initial consultation meeting' : 'আমি একটি প্রাথমিক মিটিং শিডিউল করতে চাই'}
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group pt-4 border-t border-borderColor">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input required type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} className="peer appearance-none w-5 h-5 border-2 border-soft-gray rounded checked:border-electric checked:bg-electric transition-colors" />
                    <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-sm text-soft-gray group-hover:text-white transition-colors">
                    {language === 'en' ? 'I agree to the Privacy Policy and consent to MetaFore Technologies storing and processing my personal data for this inquiry. *' : 'আমি প্রাইভেসি পলিসিতে সম্মতি দিচ্ছি এবং এই তথ্যের সংরক্ষণে অনুমতি দিচ্ছি। *'}
                  </span>
                </label>
              </div>
            </div>

            <div className="text-center pt-6">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full md:w-auto md:min-w-[300px]"
                isLoading={isSubmitting}
                rightIcon={!isSubmitting && <Send className="w-5 h-5" />}
              >
                {language === 'en' ? 'Submit Quote Request' : 'কোটেশন রিকোয়েস্ট পাঠান'}
              </Button>
              <p className="text-soft-gray text-sm mt-4">
                {language === 'en' ? 'We will get back to you within 24 business hours.' : 'আমরা ২৪ কর্মঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।'}
              </p>
            </div>
          </form>
        </Container>
      </section>
    </div>
  );
};