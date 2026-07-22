import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '/src/components/common/Button.js';
import { Container } from '/src/components/common/Container.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { SITE } from '/src/config/site.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { submitInquiry } from '/src/services/inquiryService.js';
import { isLaravelReady } from '/src/lib/backend.js';
import { openPreparedEmail } from '/src/lib/contactFallback.js';
const emptyForm = { name: '', email: '', phone: '', company: '', message: '' };
export const ContactPage = () => {
    const { t, language } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting)
            return;
        setIsSubmitting(true);
        try {
            if (!isLaravelReady()) {
                openPreparedEmail(`Website enquiry from ${formData.name.trim()}`, [
                    `Name: ${formData.name.trim()}`,
                    `Email: ${formData.email.trim()}`,
                    `Phone: ${formData.phone.trim()}`,
                    formData.company.trim() ? `Company: ${formData.company.trim()}` : undefined,
                    '',
                    'Message:',
                    formData.message.trim(),
                ]);
                toast.success(language === 'en'
                    ? 'Your email app has opened with the message prepared. Please press Send there.'
                    : 'আপনার ইমেইল অ্যাপে মেসেজটি প্রস্তুত করা হয়েছে। সেখানে Send চাপুন।');
                return;
            }
            await submitInquiry({
                fullName: formData.name.trim(),
                companyName: formData.company.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                whatsappNumber: '',
                country: 'Bangladesh / Not specified',
                clientType: 'Local',
                preferredLanguage: language,
                preferredContactMethod: 'Email',
                requiredServices: ['General Consultation'],
                projectType: 'Website Contact Form',
                estimatedBudget: 'Not specified',
                currency: 'BDT',
                expectedTimeline: 'Not specified',
                projectDescription: formData.message.trim(),
                referenceLinks: '',
                fileUrl: '',
                ndaRequired: false,
                meetingRequired: false,
                consent: true,
            });
            toast.success(language === 'en'
                ? 'Message sent successfully. Our team will contact you soon.'
                : 'আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। আমাদের টিম শীঘ্রই যোগাযোগ করবে।');
            setFormData(emptyForm);
        }
        catch (error) {
            console.error('Contact form submission failed', error);
            toast.error(language === 'en'
                ? 'The message could not be sent. Please call, email, or try again.'
                : 'মেসেজ পাঠানো যায়নি। অনুগ্রহ করে ফোন, ইমেইল অথবা আবার চেষ্টা করুন।');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const contactInfo = [
        {
            icon: _jsx(Phone, { className: "h-6 w-6 text-electric" }),
            title: language === 'en' ? 'Call Us' : 'কল করুন',
            details: SITE.phoneDisplay,
            action: SITE.phoneHref,
            external: false,
        },
        {
            icon: _jsx(MessageSquare, { className: "h-6 w-6 text-purple-accent" }),
            title: language === 'en' ? 'WhatsApp' : 'হোয়াটসঅ্যাপ',
            details: SITE.phoneDisplay,
            action: SITE.whatsappHref,
            external: true,
        },
        {
            icon: _jsx(Mail, { className: "h-6 w-6 text-electric-bright" }),
            title: language === 'en' ? 'Email Address' : 'ইমেইল ঠিকানা',
            details: SITE.email,
            action: `mailto:${SITE.email}`,
            external: false,
        },
        {
            icon: _jsx(Clock, { className: "h-6 w-6 text-electric" }),
            title: t.contact.businessHours,
            details: language === 'en' ? SITE.businessHours : 'শনিবার - বৃহস্পতিবার (সকাল ১০টা - সন্ধ্যা ৭টা)',
            action: null,
            external: false,
        },
    ];
    return (_jsxs("div", { className: "flex w-full flex-col", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [t.navigation.contact, " | ", SITE.name] }), _jsx("meta", { name: "description", content: language === 'en'
                            ? `Contact ${SITE.name} for digital product, website, software, design, and growth projects.`
                            : `${SITE.name}-এর সাথে ওয়েবসাইট, সফটওয়্যার, ডিজাইন ও ডিজিটাল গ্রোথ প্রজেক্ট নিয়ে যোগাযোগ করুন।` })] }), _jsxs("section", { className: "relative overflow-hidden border-b border-borderColor bg-navy-surface pb-16 pt-32 lg:pb-24 lg:pt-40", children: [_jsx("div", { className: "pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-electric/10 blur-[120px]" }), _jsx("div", { className: "pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-accent/10 blur-[120px]" }), _jsx(Container, { className: "relative z-10 max-w-4xl text-center", children: _jsx(SectionHeading, { badge: t.navigation.contact, title: language === 'en' ? "Let's Start a Conversation" : 'চলুন কথা বলি', subtitle: language === 'en'
                                ? 'Have a project in mind or need technical consultation? Our team is ready to help turn your ideas into a reliable solution.'
                                : 'নতুন প্রজেক্ট বা টেকনিক্যাল পরামর্শ প্রয়োজন? আপনার আইডিয়াকে নির্ভরযোগ্য সমাধানে রূপ দিতে আমাদের টিম প্রস্তুত।', className: "mx-auto" }) })] }), _jsx("section", { className: "relative bg-navy py-20 lg:py-28", children: _jsx(Container, { children: _jsxs("div", { className: "grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8", children: [_jsxs("div", { className: "space-y-8 lg:col-span-5", children: [_jsxs("div", { children: [_jsx("h2", { className: "mb-6 text-2xl font-bold text-white", children: language === 'en' ? 'Contact Information' : 'যোগাযোগের তথ্য' }), _jsx("p", { className: `mb-8 leading-relaxed text-soft-gray ${language === 'bn' ? 'bn-text-safe' : ''}`, children: language === 'en'
                                                    ? 'Submit the form and our team will review your request. You can also reach us directly by phone, WhatsApp, or email.'
                                                    : 'ফর্মটি জমা দিন, আমাদের টিম আপনার অনুরোধ পর্যালোচনা করবে। ফোন, হোয়াটসঅ্যাপ বা ইমেইলেও সরাসরি যোগাযোগ করতে পারেন।' })] }), _jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: contactInfo.map((info) => (_jsxs("div", { className: "glass-panel rounded-xl border-borderColor p-6", children: [_jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-borderColor bg-navy-surface", children: info.icon }), _jsx("h3", { className: "mb-2 font-semibold text-white", children: info.title }), info.action ? (_jsx("a", { href: info.action, target: info.external ? '_blank' : undefined, rel: info.external ? 'noopener noreferrer' : undefined, className: "block break-words text-sm text-soft-gray transition-colors hover:text-electric", children: info.details })) : _jsx("p", { className: "text-sm text-soft-gray", children: info.details })] }, info.title))) }), _jsxs("div", { className: "glass-panel flex items-start gap-4 rounded-xl border-borderColor p-6", children: [_jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-borderColor bg-navy-surface", children: _jsx(MapPin, { className: "h-6 w-6 text-electric" }) }), _jsxs("div", { children: [_jsx("h3", { className: "mb-2 font-semibold text-white", children: t.contact.officeAddress }), _jsxs("p", { className: "text-sm leading-relaxed text-soft-gray", children: [SITE.location, _jsx("br", {}), language === 'en' ? 'Detailed address is shared for scheduled meetings.' : 'নির্ধারিত মিটিংয়ের জন্য বিস্তারিত ঠিকানা দেওয়া হয়।'] })] })] })] }), _jsx("div", { className: "lg:col-span-7", children: _jsxs("div", { className: "glass-panel h-full rounded-2xl border-borderColor p-8 md:p-10", children: [_jsx("h2", { className: "mb-8 text-2xl font-bold text-white", children: language === 'en' ? 'Send Us a Message' : 'আমাদের মেসেজ পাঠান' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [_jsxs("label", { className: "space-y-2 text-sm font-medium text-soft-gray", children: [t.contact.nameLabel, " *", _jsx("input", { type: "text", name: "name", required: true, minLength: 2, maxLength: 100, autoComplete: "name", value: formData.name, onChange: handleChange, className: "mt-2 w-full rounded-lg border border-borderColor bg-navy-surface px-4 py-3 text-white outline-none transition focus:border-electric focus:ring-1 focus:ring-electric", placeholder: language === 'en' ? 'Your name' : 'আপনার নাম' })] }), _jsxs("label", { className: "space-y-2 text-sm font-medium text-soft-gray", children: [t.contact.emailLabel, " *", _jsx("input", { type: "email", name: "email", required: true, maxLength: 160, autoComplete: "email", value: formData.email, onChange: handleChange, className: "mt-2 w-full rounded-lg border border-borderColor bg-navy-surface px-4 py-3 text-white outline-none transition focus:border-electric focus:ring-1 focus:ring-electric", placeholder: "name@example.com" })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [_jsxs("label", { className: "space-y-2 text-sm font-medium text-soft-gray", children: [t.contact.phoneLabel, " *", _jsx("input", { type: "tel", name: "phone", required: true, minLength: 7, maxLength: 30, autoComplete: "tel", value: formData.phone, onChange: handleChange, className: "mt-2 w-full rounded-lg border border-borderColor bg-navy-surface px-4 py-3 text-white outline-none transition focus:border-electric focus:ring-1 focus:ring-electric", placeholder: "+880 1XXX XXXXXX" })] }), _jsxs("label", { className: "space-y-2 text-sm font-medium text-soft-gray", children: [t.contact.companyLabel, " (", language === 'en' ? 'Optional' : 'ঐচ্ছিক', ")", _jsx("input", { type: "text", name: "company", maxLength: 160, autoComplete: "organization", value: formData.company, onChange: handleChange, className: "mt-2 w-full rounded-lg border border-borderColor bg-navy-surface px-4 py-3 text-white outline-none transition focus:border-electric focus:ring-1 focus:ring-electric", placeholder: language === 'en' ? 'Company name' : 'কোম্পানির নাম' })] })] }), _jsxs("label", { className: "block space-y-2 text-sm font-medium text-soft-gray", children: [t.contact.messageLabel, " *", _jsx("textarea", { name: "message", rows: 6, required: true, minLength: 10, maxLength: 5000, value: formData.message, onChange: handleChange, className: "mt-2 w-full resize-none rounded-lg border border-borderColor bg-navy-surface px-4 py-3 text-white outline-none transition focus:border-electric focus:ring-1 focus:ring-electric", placeholder: language === 'en' ? 'Tell us about your project requirements...' : 'আপনার প্রজেক্টের বিস্তারিত লিখুন...' })] }), _jsx(Button, { type: "submit", size: "lg", fullWidth: true, isLoading: isSubmitting, disabled: isSubmitting, rightIcon: !isSubmitting ? _jsx(Send, { className: "h-5 w-5" }) : undefined, children: t.contact.sendButton })] })] }) })] }) }) }), _jsx("section", { className: "relative h-[400px] w-full border-t border-borderColor grayscale transition-all duration-700 hover:grayscale-0", children: _jsx("iframe", { src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d233667.8223908687!2d90.27923710646989!3d23.780887457084543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1705600000000!5m2!1sen!2sus", width: "100%", height: "100%", style: { border: 0 }, allowFullScreen: true, loading: "lazy", referrerPolicy: "no-referrer-when-downgrade", title: `${SITE.name} location` }) })] }));
};
