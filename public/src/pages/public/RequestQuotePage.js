import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Request a Quote Page (Laravel API Integrated)
// =========================================================================
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, Paperclip, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { uploadMedia } from '/src/lib/mediaUpload.js';
import { submitInquiry } from '/src/services/inquiryService.js';
import { isLaravelReady } from '/src/lib/backend.js';
import { openPreparedEmail } from '/src/lib/contactFallback.js';
import { SITE } from '/src/config/site.js';
import { Container } from '/src/components/common/Container.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { Button } from '/src/components/common/Button.js';
export const RequestQuotePage = () => {
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
        clientType: 'Global',
        preferredLanguage: 'English',
        contactMethod: 'Email',
        services: [],
        projectType: 'New Project',
        budget: '',
        currency: 'USD',
        timeline: '',
        description: '',
        referenceLinks: '',
        ndaRequired: false,
        meetingRequired: false,
        consent: false
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const availableServices = [
        'Web Development', 'Mobile App', 'UI/UX Design',
        'E-commerce', 'Digital Marketing & SEO', 'Cloud & Security'
    ];
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleServiceToggle = (service) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };
    const handleFileChange = (e) => {
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
    const handleSubmit = async (e) => {
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
            // A static fallback remains available if the Laravel backend cannot be reached.
            if (!isLaravelReady()) {
                openPreparedEmail(`Quote request from ${formData.name.trim()} — ${SITE.name}`, [
                    `Name: ${formData.name.trim()}`,
                    formData.company.trim() ? `Company: ${formData.company.trim()}` : undefined,
                    `Email: ${formData.email.trim()}`,
                    `Phone: ${formData.phone.trim()}`,
                    formData.whatsapp.trim() ? `WhatsApp: ${formData.whatsapp.trim()}` : undefined,
                    formData.country.trim() ? `Country: ${formData.country.trim()}` : undefined,
                    `Client type: ${formData.clientType}`,
                    `Preferred contact: ${formData.contactMethod}`,
                    `Services: ${formData.services.join(', ')}`,
                    `Project type: ${formData.projectType}`,
                    `Budget: ${formData.budget} ${formData.currency}`,
                    `Timeline: ${formData.timeline || 'Not specified'}`,
                    `NDA required: ${formData.ndaRequired ? 'Yes' : 'No'}`,
                    `Meeting required: ${formData.meetingRequired ? 'Yes' : 'No'}`,
                    formData.referenceLinks.trim() ? `References: ${formData.referenceLinks.trim()}` : undefined,
                    selectedFile ? `Attachment to add manually: ${selectedFile.name}` : undefined,
                    '',
                    'Project description:',
                    formData.description.trim().slice(0, 3000),
                ]);
                toast.success(language === 'en'
                    ? 'Your email app has opened with the quote request prepared. Add the attachment if needed, then press Send.'
                    : 'আপনার ইমেইল অ্যাপে কোটেশন অনুরোধটি প্রস্তুত হয়েছে। প্রয়োজন হলে ফাইল যুক্ত করে Send চাপুন।', { id: 'processToast' });
                return;
            }
            // Upload the optional attachment to Laravel local media storage.
            if (selectedFile) {
                toast.loading(language === 'en' ? 'Uploading attachment...' : 'ফাইল আপলোড হচ্ছে...', { id: 'processToast' });
                const uploadResult = await uploadMedia(selectedFile, (percent) => {
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
                preferredLanguage: formData.preferredLanguage === 'English' ? 'en' : 'bn',
                preferredContactMethod: (formData.contactMethod === 'Phone Call' ? 'Phone' : formData.contactMethod),
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
            // ৩. Laravel/MySQL-এ সেভ করা
            toast.loading(language === 'en' ? 'Sending request...' : 'রিকোয়েস্ট পাঠানো হচ্ছে...', { id: 'processToast' });
            await submitInquiry(payload);
            // ৪. সফল সাবমিশন মেসেজ
            toast.success(language === 'en'
                ? 'Quote request sent successfully! We will contact you soon.'
                : 'কোটেশন রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।', { id: 'processToast' });
            // ৫. ফর্ম রিসেট
            setFormData({
                name: '', company: '', email: '', phone: '', whatsapp: '', country: '',
                clientType: 'Global', preferredLanguage: 'English', contactMethod: 'Email',
                services: [], projectType: 'New Project', budget: '', currency: 'USD', timeline: '',
                description: '', referenceLinks: '', ndaRequired: false, meetingRequired: false, consent: false
            });
            setSelectedFile(null);
            setUploadProgress(0);
        }
        catch (error) {
            console.error("Submission Error:", error);
            toast.error(language === 'en' ? 'Submission failed. Please check your connection.' : 'সাবমিশন ব্যর্থ হয়েছে। আপনার ইন্টারনেট কানেকশন চেক করুন।', { id: 'processToast' });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "w-full flex flex-col bg-navy min-h-screen", children: [_jsx(Helmet, { children: _jsxs("title", { children: [language === 'en' ? 'Request a Quote' : 'কোটেশন অনুরোধ করুন', " | Quanta Reach Solutions"] }) }), _jsxs("section", { className: "pt-24 pb-12 lg:pt-32 lg:pb-16 border-b border-borderColor bg-navy-surface relative", children: [_jsx("div", { className: "absolute top-0 right-1/4 w-[400px] h-[400px] bg-electric/10 rounded-full blur-[100px] pointer-events-none" }), _jsx(Container, { className: "relative z-10 text-center max-w-3xl", children: _jsx(SectionHeading, { badge: t.common.requestQuote, title: language === 'en' ? 'Tell Us About Your Project' : 'আপনার প্রজেক্ট সম্পর্কে আমাদের জানান', subtitle: language === 'en'
                                ? 'Fill out the form below to get a detailed proposal, timeline, and estimated cost for your project.'
                                : 'আপনার প্রজেক্টের বিস্তারিত প্রপোজাল, সময়সীমা এবং খরচের ধারণা পেতে নিচের ফর্মটি পূরণ করুন।', className: "mx-auto mb-0" }) })] }), _jsx("section", { className: "py-16 relative", children: _jsx(Container, { className: "max-w-4xl", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-10", children: [_jsxs("div", { className: "glass-panel p-8 rounded-2xl border-borderColor", children: [_jsx("h3", { className: "text-xl font-bold text-white mb-6 border-b border-borderColor pb-4", children: language === 'en' ? '1. Client Information' : '১. ক্লায়েন্টের তথ্য' }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Full Name *' : 'পুরো নাম *' }), _jsx("input", { required: true, type: "text", name: "name", value: formData.name, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Company Name' : 'কোম্পানির নাম' }), _jsx("input", { type: "text", name: "company", value: formData.company, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Email Address *' : 'ইমেইল এড্রেস *' }), _jsx("input", { required: true, type: "email", name: "email", value: formData.email, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Phone Number *' : 'ফোন নম্বর *' }), _jsx("input", { required: true, type: "tel", name: "phone", value: formData.phone, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'WhatsApp Number' : 'হোয়াটসঅ্যাপ নম্বর' }), _jsx("input", { type: "tel", name: "whatsapp", value: formData.whatsapp, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Country *' : 'দেশ *' }), _jsx("input", { required: true, type: "text", name: "country", value: formData.country, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Client Type' : 'ক্লায়েন্ট টাইপ' }), _jsxs("select", { name: "clientType", value: formData.clientType, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none", children: [_jsx("option", { value: "Global", children: "Global (International)" }), _jsx("option", { value: "Local", children: "Local (Bangladesh)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Preferred Language' : 'পছন্দের ভাষা' }), _jsxs("select", { name: "preferredLanguage", value: formData.preferredLanguage, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none", children: [_jsx("option", { value: "English", children: "English" }), _jsx("option", { value: "Bangla", children: "\u09AC\u09BE\u0982\u09B2\u09BE (Bangla)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Contact Method' : 'যোগাযোগের মাধ্যম' }), _jsxs("select", { name: "contactMethod", value: formData.contactMethod, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none", children: [_jsx("option", { value: "Email", children: "Email" }), _jsx("option", { value: "WhatsApp", children: "WhatsApp" }), _jsx("option", { value: "Phone Call", children: "Phone Call" })] })] })] })] }), _jsxs("div", { className: "glass-panel p-8 rounded-2xl border-borderColor", children: [_jsx("h3", { className: "text-xl font-bold text-white mb-6 border-b border-borderColor pb-4", children: language === 'en' ? '2. Project Details' : '২. প্রজেক্টের বিস্তারিত' }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-4 block", children: language === 'en' ? 'Required Services * (Select multiple)' : 'প্রয়োজনীয় সার্ভিস * (একাধিক নির্বাচন করা যাবে)' }), _jsx("div", { className: "flex flex-wrap gap-3", children: availableServices.map((service) => (_jsx("button", { type: "button", onClick: () => handleServiceToggle(service), className: `px-4 py-2 rounded-full text-sm font-medium transition-all border ${formData.services.includes(service)
                                                        ? 'bg-electric/20 border-electric text-white'
                                                        : 'bg-navy border-borderColor text-soft-gray hover:border-electric/50 hover:text-white'}`, children: service }, service))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Project Type' : 'প্রজেক্টের ধরন' }), _jsxs("select", { name: "projectType", value: formData.projectType, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none", children: [_jsx("option", { value: "New Project", children: "New Project / From Scratch" }), _jsx("option", { value: "Redesign", children: "Redesign / Revamp" }), _jsx("option", { value: "Maintenance", children: "Maintenance / Support" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Expected Timeline' : 'প্রত্যাশিত সময়সীমা' }), _jsxs("select", { name: "timeline", value: formData.timeline, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none", children: [_jsx("option", { value: "", children: "Select Timeline" }), _jsx("option", { value: "1-2 Months", children: "1-2 Months" }), _jsx("option", { value: "3-6 Months", children: "3-6 Months" }), _jsx("option", { value: "6+ Months", children: "6+ Months" }), _jsx("option", { value: "Urgent", children: "Urgent (ASAP)" })] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Project Description *' : 'প্রজেক্টের বিবরণ *' }), _jsx("textarea", { required: true, name: "description", value: formData.description, onChange: handleInputChange, rows: 5, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all resize-none outline-none", placeholder: language === 'en' ? 'Describe your goals, features, and requirements...' : 'আপনার প্রজেক্টের লক্ষ্য এবং রিকোয়ারমেন্টস লিখুন...' })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Reference Links (Optional)' : 'রেফারেন্স লিংক (ঐচ্ছিক)' }), _jsx("input", { type: "text", name: "referenceLinks", value: formData.referenceLinks, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none", placeholder: "https://example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Upload Document/Brief (Optional)' : 'ডকুমেন্ট আপলোড (ঐচ্ছিক)' }), _jsxs("div", { className: "relative border-2 border-dashed border-borderColor rounded-lg p-6 hover:border-electric transition-colors bg-navy text-center", children: [_jsx("input", { type: "file", onChange: handleFileChange, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer", accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg" }), _jsxs("div", { className: "flex flex-col items-center pointer-events-none", children: [_jsx(Paperclip, { className: "w-8 h-8 text-soft-gray mb-2" }), _jsx("span", { className: "text-white font-medium", children: selectedFile ? selectedFile.name : (language === 'en' ? 'Click or drag file to upload' : 'আপলোড করতে এখানে ক্লিক করুন') }), _jsx("span", { className: "text-xs text-soft-gray mt-1", children: "PDF, DOC, JPG (Max 15MB)" })] })] }), uploadProgress > 0 && uploadProgress < 100 && (_jsx("div", { className: "w-full bg-navy-surface rounded-full h-1.5 mt-4 overflow-hidden", children: _jsx("div", { className: "bg-electric h-1.5 rounded-full transition-all duration-300", style: { width: `${uploadProgress}%` } }) }))] })] }), _jsxs("div", { className: "glass-panel p-8 rounded-2xl border-borderColor", children: [_jsx("h3", { className: "text-xl font-bold text-white mb-6 border-b border-borderColor pb-4", children: language === 'en' ? '3. Budget & Requirements' : '৩. বাজেট এবং অন্যান্য' }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Estimated Budget *' : 'আনুমানিক বাজেট *' }), _jsx("input", { required: true, type: "text", name: "budget", value: formData.budget, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none", placeholder: "e.g. 50,000 or 5,000" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-soft-gray mb-2 block", children: language === 'en' ? 'Currency' : 'মুদ্রা (Currency)' }), _jsxs("select", { name: "currency", value: formData.currency, onChange: handleInputChange, className: "w-full bg-navy border border-borderColor rounded-lg px-4 py-3 text-white focus:border-electric focus:ring-1 focus:ring-electric transition-all outline-none", children: [_jsx("option", { value: "USD", children: "USD ($)" }), _jsx("option", { value: "BDT", children: "BDT (\u09F3)" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("label", { className: "flex items-center gap-3 cursor-pointer group", children: [_jsxs("div", { className: "relative flex items-center justify-center", children: [_jsx("input", { type: "checkbox", name: "ndaRequired", checked: formData.ndaRequired, onChange: handleInputChange, className: "peer appearance-none w-5 h-5 border-2 border-soft-gray rounded checked:border-electric checked:bg-electric transition-colors" }), _jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" })] }), _jsx("span", { className: "text-soft-gray group-hover:text-white transition-colors", children: language === 'en' ? 'I require a Non-Disclosure Agreement (NDA)' : 'আমার একটি এনডিএ (NDA) চুক্তি প্রয়োজন' })] }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer group", children: [_jsxs("div", { className: "relative flex items-center justify-center", children: [_jsx("input", { type: "checkbox", name: "meetingRequired", checked: formData.meetingRequired, onChange: handleInputChange, className: "peer appearance-none w-5 h-5 border-2 border-soft-gray rounded checked:border-purple-accent checked:bg-purple-accent transition-colors" }), _jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" })] }), _jsx("span", { className: "text-soft-gray group-hover:text-white transition-colors", children: language === 'en' ? 'I want to schedule an initial consultation meeting' : 'আমি একটি প্রাথমিক মিটিং শিডিউল করতে চাই' })] }), _jsxs("label", { className: "flex items-start gap-3 cursor-pointer group pt-4 border-t border-borderColor", children: [_jsxs("div", { className: "relative flex items-center justify-center mt-0.5", children: [_jsx("input", { required: true, type: "checkbox", name: "consent", checked: formData.consent, onChange: handleInputChange, className: "peer appearance-none w-5 h-5 border-2 border-soft-gray rounded checked:border-electric checked:bg-electric transition-colors" }), _jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" })] }), _jsx("span", { className: "text-sm text-soft-gray group-hover:text-white transition-colors", children: language === 'en' ? 'I agree to the Privacy Policy and consent to Quanta Reach Solutions storing and processing my personal data for this inquiry. *' : 'আমি প্রাইভেসি পলিসিতে সম্মতি দিচ্ছি এবং কোয়ান্টা রিচ সলিউশনস-কে এই ইনকোয়ারির জন্য আমার ব্যক্তিগত ডেটা সংরক্ষণ ও প্রসেস করার অনুমতি দিচ্ছি। *' })] })] })] }), _jsxs("div", { className: "text-center pt-6", children: [_jsx(Button, { type: "submit", size: "lg", className: "w-full md:w-auto md:min-w-[300px]", isLoading: isSubmitting, rightIcon: !isSubmitting && _jsx(Send, { className: "w-5 h-5" }), children: language === 'en' ? 'Submit Quote Request' : 'কোটেশন রিকোয়েস্ট পাঠান' }), _jsx("p", { className: "text-soft-gray text-sm mt-4", children: language === 'en' ? 'We will get back to you within 24 business hours.' : 'আমরা ২৪ কর্মঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।' })] })] }) }) })] }));
};
